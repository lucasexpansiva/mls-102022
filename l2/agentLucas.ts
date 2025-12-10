/// <mls shortName="agentLucas" project="102022" enhancement="_blank" />

import { IAgent, svg_agent } from '/_100554_/l2/aiAgentBase';
import { getPromptByHtml } from '/_100554_/l2/aiPrompts';
import './_100554_widgetQuestionsForClarification';
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

// IMPORTANTE ********
const agentName = "agentLucas";
const project = 102022;

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
    console.info('initializing _beforePrompt with context', context);
    console.info('_beforePrompt: info about content', context.message.content, typeof context.message.content);
    const taskTitle = "Planning...";
    if (!context || !context.message) throw new Error("Invalid context");
    if (!context.task) {
        console.info('_beforePrompt - entrou sem context.task');
        let prompt = context.message.content.replace('@@agentLucas', '').trim();
        let data = mls.common.safeParseArgs(prompt);
        console.info('_beforePrompt: info about data', data);
        const fn = getFileName(data.page, 2);
        console.info('_beforePrompt: info about fn', fn);
        console.info('_beforePrompt: info about ts file', await mls.stor.files[fn + '.ts'].getContent(''));
        console.info('_beforePrompt: info about html file', await mls.stor.files[fn + '.html'].getContent(''));
        console.info('_beforePrompt: info about defs file', await mls.stor.files[fn + '.defs.ts'].getContent(''));
        console.info('_beforePrompt: info about less file', await mls.stor.files[fn + '.less'].getContent(''));
        const inputs: any = await getPrompts(prompt);
        await startNewAiTask(agentName, taskTitle, context.message.content, context.message.threadId, context.message.senderId, inputs, context, _afterPrompt);
        return;
    }
    console.info('_beforePrompt - entrou com context.task');
    const step: mls.msg.AIAgentStep | null = getNextPendingStepByAgentName(context.task, agentName);
    if (!step) throw new Error(`[${agentName}](beforePrompt) No pending step found for this agent.`);

    if (!step.prompt) throw new Error(`[${agentName}](beforePrompt) No prompt found in step for this agent.`);
    const inputs = await getPrompts(step.prompt);
    await startNewInteractionInAiTask(agentName, taskTitle, inputs, context, _afterPrompt, step.stepId);

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

const _afterPrompt = async (context: mls.msg.ExecutionContext): Promise<void> => {
    console.info('initializing _afterPrompt with context', context);
    if (!context || !context.message || !context.task) throw new Error("Invalid context");
    const step: mls.msg.AIAgentStep | null = getNextInProgressStepByAgentName(context.task, agentName);
    if (!step) throw new Error(`[${agentName}] afterPrompt: No in progress interaction found.`);
    console.info('_afterPrompt: info about step', step);
    const payload = step.interaction?.payload || [];
    console.info('_afterPrompt: info about payload', payload);
    if (!payload || payload.length > 1) throw new Error('afterPrompt: Invalid payload');
    const hasError = payload[0].type === 'result';
    console.info('_afterPrompt: info about hasError', hasError, (payload[0] as any).message || '');
    if (hasError) {
        const status = payload[0].status;
        const message = (payload[0] as any).message || '';
        //if (context.task) context.task = await updateTaskTitle(context.task, status);
        throw new Error(`[${agentName}](afterPrompt) ${status}: ${ message }`)
    }
    const pageHtml = (payload[0] as any).result
    console.info('_afterPrompt: info about pageHtml', pageHtml);
    context = await updateStepStatus(context, step.stepId, "completed");

    notifyTaskChange(context);
    await executeNextStep(context);

    console.info('Finished ', context);
}

function teste(context: mls.msg.ExecutionContext) {
    if (!context || !context.task) throw new Error(`[${agentName}] updateFile: Not found context`);
    const step = getNextFlexiblePendingStep(context.task);
    console.info('dados do step', step);

    //if (!step || step.type !== 'flexible') throw new Error(`[${agentName}] updateFile: Invalid step in updateFile`);

    console.info('tipo retornado: ', step?.type);

    const step2 = getNextResultStep(context.task);
    console.info('tipo retornado: ', step2?.type);

    const step3 = getNextClarificationStep(context.task);
    console.info('tipo retornado: ', step3?.type);

}

async function nextStep(context: mls.msg.ExecutionContext) {
    if (!context.task) throw new Error(`[${agentName}]: nextStep not found task`);
    const step = getNextPendentStep(context.task) as mls.msg.AIPayload | null;

    if (!step || step.type !== 'flexible' || !step.result) throw new Error(`[${agentName}]: ` + 'Invalid step in update defs, type: "' + step?.type + '"');

    console.info('nextStep - info about result.info', step.result.info);
    if (typeof step.result === 'string' || !step.result.info) return;

    await appendLongTermMemory(context, { "info": JSON.stringify(step.result.info) });

    const newStep: mls.msg.AIPayload = {
        agentName: 'agentUpdateMiniApp',
        prompt: JSON.stringify(step.result.info),
        status: 'pending',
        stepId: step.stepId + 1,
        interaction: null,
        nextSteps: null,
        rags: null,
        type: 'agent'
    }

    await addNewStep(context, step.stepId, [newStep]);

}

async function getPrompts(userPrompt: string): Promise<mls.msg.IAMessageInputType[]> {

    const dataForReplace = {
        userPrompt,
        projectId: mls.actualProject
    }

    const prompts = await getPromptByHtml({ project, shortName: agentName, folder: '', data: dataForReplace })
    return prompts;
}

export interface PayloadResultOk {
    pageHtml: string;
    result: mls.l4.BaseDefs;
}