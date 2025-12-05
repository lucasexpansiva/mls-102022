/// <mls shortName="agentUpdateMiniApp" project="102022" enhancement="_blank" />

import { IAgent, svg_agent } from '/_100554_/l2/aiAgentBase';
import { getPromptByHtml } from '/_100554_/l2/aiPrompts';
import { convertFileNameToTag, convertTagToFileName } from '/_100554_/l2/utilsLit.js';
import '/_100554_/l2/widgetQuestionsForClarification';
import {
    getNextInProgressStepByAgentName,
    notifyTaskChange,
    notifyThreadChange,
    updateStepStatus,
    getNextPendentStep,
    appendLongTermMemory,
    getNextFlexiblePendingStep,
    getNextResultStep,
    getNextClarificationStep,
    getNextStepIdAvaliable,
    updateTaskTitle,
    getNextPendingStepByAgentName
} from "/_100554_/l2/aiAgentHelper";

import {
    startNewAiTask,
    startNewInteractionInAiTask,
    executeNextStep,
    addNewStep,
    startClarification,
    ClarificationValue
} from "/_100554_/l2/aiAgentOrchestration";
import { createNewFile } from '/_100554_/l2/pluginNewFileBase';
import { ServiceSource100554 } from '/_100554_/l2/serviceSource';
import { getState } from '/_100554_/l2/collabState';

// IMPORTANTE ********
const agentName = "agentUpdateMiniApp";
const project = 102022;

const enhancementTs = '_100554_enhancementLit'
const enhancementStyle = '_100554_enhancementStyle';

export function createAgent(): IAgent {
    return {
        agentName,
        avatar_url: svg_agent,
        agentDescription: "Agent NewMiniApp, for decide instructions",
        visibility: "private",
        async beforePrompt(context: mls.msg.ExecutionContext): Promise<void> {
            return _beforePrompt(context);
        },
        async afterPrompt(context: mls.msg.ExecutionContext): Promise<void> {
            return _afterPrompt(context);
        },
        async installBot(context: mls.msg.ExecutionContext): Promise<boolean> {
            throw new Error('Not implement');
        },
        async beforeBot(context: mls.msg.ExecutionContext, msg: string, toolsBeforeSendMessage: mls.bots.ToolsBeforeSendMessage[]): Promise<Record<string, any>> {
            throw new Error('Not implement');
        },
        async afterBot(context: mls.msg.ExecutionContext, output: mls.msg.BotOutput): Promise<string> {
            throw new Error('Not implement');

        }
    };
}

const _beforePrompt = async (context: mls.msg.ExecutionContext): Promise<void> => {
    console.info(agentName, '_beforePrompt - initializing - info about context', context);
    const taskTitle = "Planning...";
    if (!context || !context.message) throw new Error("Invalid context");
    if (!context.task) {
        let prompt = context.message.content.replace('@@agentUpdateMiniApp', '').trim();
        const inputs: any = await getPrompts(prompt);        
        let data = mls.common.safeParseArgs(prompt);
        let userMessage = context.message.content
        const isUserPrompt = 'page' in data && 'prompt' in data;
        if (isUserPrompt) {
            const payloadUpdate = await getContentsFromFiles(data.page)
            payloadUpdate.prompt = data.prompt;
            userMessage = JSON.stringify(payloadUpdate);
        }          
        await startNewAiTask(agentName, taskTitle, userMessage, context.message.threadId, context.message.senderId, inputs, context, _afterPrompt);
        return;
    }

    /**
     *  
     * If context.task is undefined or null, 
     *    it means this agent was triggered by another agent.  
     * 
    */

    const step: mls.msg.AIAgentStep | null = getNextPendingStepByAgentName(context.task, agentName);
    if (!step) throw new Error(`[${agentName}](beforePrompt) No pending step found for this agent.`);

    if (!step.prompt) throw new Error(`[${agentName}](beforePrompt) No prompt found in step for this agent.`);
    const inputs = await getPrompts(step.prompt);

    await startNewInteractionInAiTask(agentName, taskTitle, inputs, context, _afterPrompt, step.stepId);
    console.info(agentName, '_beforePrompt finished', context);
}

const _afterPrompt = async (context: mls.msg.ExecutionContext): Promise<void> => {
    console.info(agentName, '_afterPrompt - initializing - info about context', context);
    if (!context || !context.message || !context.task) throw new Error("Invalid context");
    const step: mls.msg.AIAgentStep | null = getNextInProgressStepByAgentName(context.task, agentName);
    if (!step) throw new Error(`[${agentName}] afterPrompt: No in progress interaction found.`);
    
    const payload = step.interaction?.payload || [];
    if (!payload || payload.length > 1) throw new Error('afterPrompt: Invalid payload');

    const hasError = payload[0].type === 'result';
    if (hasError) {
        const status = payload[0].status;
        const message = (payload[0] as any).message || '';        
        throw new Error(`[${agentName}](afterPrompt) ${status}: ${message}`)
    }
    const result: PayloadOk = (payload[0] as any).result

    context = await updateStepStatus(context, step.stepId, "completed");
    if (context.task) context.task = await updateTaskTitle(context.task, "Done");

    notifyTaskChange(context);
    await executeNextStep(context);

    if (!result.isUpdate) await createFile(result);
    else console.info('_afterPrompt - need to update files');

    console.info(agentName, '_afterPrompt Finished', context);
}

async function createFile(contents: PayloadOk) {

    const { projectId, folder, shortName, group } = contents.defs.meta;

    const info = { project: projectId, shortName, folder };
    const pageTagName = convertFileNameToTag(info);
    const sourceTS = contents.pageTs;
    const sourceHTML = contents.pageHtml;
    const sourceLess = generateLessPage(info, group!, pageTagName, '');;
    const sourceDefs = generateDefsPage(info, group!, contents.defs);

    console.info('createFile - info about projectId, shortname, folder and group')
    console.info(projectId, folder, shortName, group)
    //debugger
    console.info('*********** Vai criar o arquivo', shortName);
    await createNewFile({
        project,
        folder,
        shortName,
        position: 'right',
        enhancement: enhancementTs,
        sourceTS: sourceTS.trim(),
        sourceHTML,
        sourceLess,
        sourceDefs,
        openPreview: false
    });

    console.info(`page created: ${folder}/${shortName}`);

}

async function updateFile(contents: PayloadOk) {
    const { projectId, folder, shortName, group } = contents.defs.meta;

    const serviceSource: ServiceSource100554 = getState(`serviceSource.left.service`);
    if (!serviceSource) throw new Error('Not found service source instance');

    const models = getModel({ folder: folder || '', project: projectId, shortName });
    if (!models) throw new Error(`[${agentName}] updateFile: Not found models`);

    const contentHTML = contents.pageHtml;
    const contentTS = contents.pageTs;
    const contentDefs = contents.defs;

    /*if (contentDefs && models.defs) {
        serviceSource.setValueInModeKeepingUndo(models.defs.model, contentDefs, false);
    }*/

    if (contentHTML && models.html) {
        serviceSource.setValueInModeKeepingUndo(models.html.model, contentHTML, false);
    }
    // models.html.model.setValue(contentHTML);
    if (contentTS && models.ts) {
        //models.ts.model.setValue(contentTS);
        serviceSource.setValueInModeKeepingUndo(models.ts.model, contentTS, false);
        const ok = await mls.l2.typescript.compileAndPostProcess(models.ts, true, false);
    }
    /*if (contentLess && models.style) {

        const resultLessComponent2 = await prepareComponentCss(contentLess, +projectMemory, folderMemory || '');
        serviceSource.setValueInModeKeepingUndo(models.style.model, resultLessComponent2, false);
        // models.style.model.setValue(resultLessComponent2);
        const ok = await mls.l2.less.compileStyle(models.style);
        hasErrorLess = ok === false;
    }*/
}

async function getContentsFromFiles(pageName: string): Promise<PayloadUpdate> {

    const level = 2;
    const fn = getFileName(pageName, level);

    const pageTs =  await mls.stor.files[fn + '.ts'].getContent('') as string;
    const pageHtml = await mls.stor.files[fn + '.html'].getContent('') as string;
    let defsStr =  await mls.stor.files[fn + '.defs.ts'].getContent('') as string;
    const pageLess = await mls.stor.files[fn + '.less'].getContent('') as string;
    defsStr = extracJsonFromDefs(defsStr);
    if (!defsStr || defsStr === '') throw new Error(`[${agentName}](getContentsFromFiles) Invalid defs.`)
    const defs = JSON.parse(defsStr);

    return { 
        defs,
        pageHtml,
        pageLess,
        pageTs,
    }

}

function extracJsonFromDefs(str: string): string {
    const start = str.indexOf('{');
    const end = str.lastIndexOf('}');

    if (start !== -1 && end !== -1 && end > start) {
        return (str.substring(start, end + 1)).replace(/\\"/g, '"');
    } else {
        return ''; // ou lançar erro, dependendo do caso
    }
}

function getFileName(page: string, nivel: number): string {
  // Remove o primeiro "_" inicial, se existir
  const cleaned = page.startsWith("_") ? page.substring(1) : page;

  // Extrai o número do projeto (até o próximo '_')
  const firstUnderscoreIndex = cleaned.indexOf("_");
  if (firstUnderscoreIndex === -1) {
    throw new Error("Formato inválido. Não foi possível localizar o código do projeto.");
  }

  const projectCode = cleaned.substring(0, firstUnderscoreIndex);
  const rest = cleaned.substring(firstUnderscoreIndex + 1);

  // Monta o nome final
 
  return `${projectCode}_${nivel}_${rest}`;
}

function getModel(info: { project: number, shortName: string, folder: string }): mls.editor.IModels | undefined {
    const key = mls.editor.getKeyModel(info.project, info.shortName, info.folder, 2);
    return mls.editor.models[key];    
}

function generateLessPage(
    info: {
        shortName: string;
        project: number;
        folder: string;
    },
    groupName: string,
    pageTagName: string,
    htmlString: string
): string {


    const enhancement = enhancementStyle;
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');
    const styles = doc.querySelectorAll('style[type="text/less"]');
    const resultStyles = Array.from(styles).map(style => ({
        name: style.getAttribute('data-name'),
        content: style.textContent
    }));



    const tagNameWithoutFolder = convertFileNameToTag({ shortName: info.shortName, project: info.project });
    let styleData = resultStyles.find((result) => result.name === `page-${tagNameWithoutFolder}`); // page-home-100554
    if (!styleData) styleData = resultStyles.find((result) => result.name === `page-${info.shortName}`); //page-adminPanel
    if (!styleData) return "";

    if (styleData && !styleData.content) return "";
    const lessContent = '';//replacePageLessTag(styleData.content as string, info.project, info.shortName, pageTagName);
    const lessResult = `/// <mls shortName="${info.shortName}" project="${info.project}" folder="${info.folder}" groupName="${groupName}" enhancement="${enhancement}" />\n\n ${lessContent}`;
    return lessResult;

}

function generateDefsPage(
    info: {
        shortName: string;
        project: number;
        folder: string;
    },
    groupName: string,
    defs: mls.l4.BaseDefs
): string {
    
    return `/// <mls shortName="${info.shortName}" project="${info.project}" folder="${info.folder}" groupName="${groupName}" enhancement="_blank" />\n\n` +
        `// Do not change – automatically generated code.\n\n` +
        `export const defs: mls.l4.BaseDefs = ${JSON.stringify(defs, null, 2)}\n\n

`;
}

async function getPrompts(userPrompt: string): Promise<mls.msg.IAMessageInputType[]> {

    const dataForReplace = {
        userPrompt,
        projectId: mls.actualProject
    }

    const prompts = await getPromptByHtml({ project, shortName: agentName, folder: '', data: dataForReplace })
    return prompts;
}

export interface PayloadOk {
    pageTs: string;
    pageHtml: string;
    defs: mls.l4.BaseDefs;
    pageLess?: string;
    isUpdate: boolean;
}

export interface PayloadUpdate {
    defs: mls.l4.BaseDefs;
    pageTs?: string;
    pageHtml?: string;
    pageLess?: string;
    prompt?: string;
}
