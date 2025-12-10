/// <mls shortName="temperatureConverter" project="102022" folder="utils" groupName="utilities" enhancement="_blank" />

// Do not change – automatically generated code.

export const defs: mls.l4.BaseDefs = {
  "meta": {
    "projectId": 102022,
    "folder": "utils",
    "shortName": "temperatureConverter",
    "type": "page",
    "executionRegions": [],
    "languages": [
      "pt",
      "en"
    ],
    "group": "utilities",
    "updatedAtByAI": "2025-12-10",
    "tags": [
      "converter",
      "temperature",
      "utility",
      "celsius",
      "fahrenheit"
    ],
    "devFidelity": "scaffold"
  },
  "planning": {
    "generalDescription": "Mini app simples para converter temperaturas entre Celsius e Fahrenheit. Interface limpa com campo de entrada, seleção/alternância de direção da conversão e resultado em tempo real.",
    "goal": "Permitir que qualquer usuário converta valores de temperatura entre Celsius e Fahrenheit de forma rápida e confiável, com validação básica e UX acessível.",
    "userStories": [
      {
        "story": "Como usuário, quero inserir um valor de temperatura e obter rapidamente o valor convertido entre Celsius e Fahrenheit para poder interpretar medições.",
        "derivedRequirements": [
          {
            "description": "Campo de entrada numérico que aceite inteiros e decimais."
          },
          {
            "description": "Botão ou toggle para escolher direção da conversão (C→F ou F→C)."
          },
          {
            "description": "Cálculo correto e preciso com formatação de resultado (por ex., 2 casas decimais)."
          },
          {
            "description": "Validação para entradas inválidas e mensagens de erro amigáveis."
          },
          {
            "description": "Botão para limpar entrada e resultado."
          }
        ]
      },
      {
        "story": "Como usuário, quero ver o resultado instantaneamente sem recarregar a página para agilizar a tarefa.",
        "derivedRequirements": [
          {
            "description": "Conversão em tempo real enquanto o usuário digita (debounce opcional)."
          },
          {
            "description": "Indicação visual de que o valor foi convertido (ex.: destaque do resultado)."
          }
        ]
      }
    ],
    "userRequestsFeatures": [
      {
        "description": "Entrada numérica com suporte a ponto decimal e caracteres locais."
      },
      {
        "description": "Swap/Toggle para alternar direção da conversão (Celsius ↔ Fahrenheit)."
      },
      {
        "description": "Exibição do resultado com opção de copiar para área de transferência."
      },
      {
        "description": "Botão limpar e histórico simples (opcional).",
        "done": false
      },
      {
        "description": "Suporte a acessibilidade (labels, roles, foco claro)."
      },
      {
        "description": "Responsivo e compatível com navegadores modernos."
      }
    ],
    "userRequestsBugs": [],
    "userRequestsEnhancements": [
      {
        "description": "Adicionar Kelvin como unidade adicional no futuro.",
        "done": false
      }
    ],
    "constraints": [
      "Não requer backend — toda a conversão é feita no cliente.",
      "Compatível com navegadores modernos (ES6+).",
      "Interface deve ser acessível (WCAG básico).",
      "Sem restrições geográficas."
    ]
  }
}



