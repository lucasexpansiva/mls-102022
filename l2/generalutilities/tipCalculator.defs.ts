/// <mls shortName="tipCalculator" project="102022" folder="generalutilities" groupName="generalutilities" enhancement="_blank" />

// Do not change – automatically generated code.

export const defs: mls.l4.BaseDefs = {
  "meta": {
    "projectId": 102022,
    "folder": "generalutilities",
    "shortName": "tipCalculator",
    "type": "page",
    "executionRegions": [],
    "languages": [
      "pt-BR"
    ],
    "group": "generalutilities",
    "updatedAtByAI": "2025-12-11",
    "tags": [
      "utilities",
      "calculator",
      "tip",
      "BRL"
    ],
    "devFidelity": "scaffold"
  },
  "planning": {
    "generalDescription": "Aplicativo simples para calcular a gorjeta (em Reais) e dividir o valor total da conta entre múltiplas pessoas, com opções de porcentagens predefinidas, porcentagem personalizada e arredondamento opcional do total por pessoa.",
    "goal": "Permitir que usuários de restaurantes ou grupos de amigos calculem rapidamente a gorjeta e o valor por pessoa de forma clara e sem configurações complexas.",
    "userStories": [
      {
        "story": "Como usuário comum, quero inserir o valor da conta, escolher uma porcentagem ou definir uma personalizada, informar o número de pessoas e obter o valor da gorjeta e o total por pessoa para dividir a conta facilmente.",
        "derivedRequirements": [
          {
            "description": "Campo de entrada para valor da conta em moeda (BRL).",
            "done": false
          },
          {
            "description": "Seleção de porcentagens predefinidas (ex.: 10%, 15%, 20%) e campo para porcentagem personalizada.",
            "done": false
          },
          {
            "description": "Campo para número de pessoas (inteiro >=1).",
            "done": false
          },
          {
            "description": "Cálculo automático da gorjeta total e do valor total por pessoa e da gorjeta por pessoa.",
            "done": false
          },
          {
            "description": "Opção de arredondamento do total por pessoa (ex.: arredondar para cima, para baixo ou ao inteiro mais próximo).",
            "done": false
          },
          {
            "description": "Validações básicas de entrada (números positivos, tratamento de valores nulos).",
            "done": false
          }
        ]
      }
    ],
    "userRequestsFeatures": [
      {
        "description": "Porcentagens predefinidas (10%, 15%, 20%) e entrada para porcentagem personalizada.",
        "done": false
      },
      {
        "description": "Opção de arredondamento opcional do total por pessoa.",
        "done": false
      },
      {
        "description": "Suporte apenas para BRL e interface em pt-BR.",
        "done": false
      },
      {
        "description": "Interface simples com: campo de valor da conta, seleção/entrada de porcentagem, número de pessoas, e exibição de gorjeta total, total por pessoa e gorjeta por pessoa.",
        "done": false
      },
      {
        "description": "Cálculo realizado localmente sem integrações externas.",
        "done": false
      },
      {
        "description": "Formato de moeda exibido com símbolo R$ e duas casas decimais.",
        "done": false
      }
    ],
    "userRequestsBugs": [],
    "userRequestsEnhancements": [
      {
        "description": "Adicionar suporte para alternar moedas no futuro.",
        "done": false
      },
      {
        "description": "Salvar preferências do usuário (porcentagem padrão, arredondamento) em versão posterior.",
        "done": false
      },
      {
        "description": "Permitir personalizar a lista de porcentagens predefinidas.",
        "done": false
      }
    ],
    "constraints": [
      "Cálculo 100% local, sem integrações externas.",
      "Idioma inicial: pt-BR; projetado para BRL (R$).",
      "Sem persistência de configurações na versão inicial.",
      "Interface minimalista e responsiva para uso rápido em dispositivos móveis."
    ]
  }
}



