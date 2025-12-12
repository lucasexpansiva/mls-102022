/// <mls shortName="monthlySales" project="102022" folder="reports" groupName="Reports" enhancement="_blank" />

// Do not change – automatically generated code.

export const defs: mls.l4.BaseDefs = {
  "meta": {
    "projectId": 102022,
    "folder": "reports",
    "shortName": "monthlySales",
    "type": "page",
    "executionRegions": [],
    "languages": [
      "pt"
    ],
    "group": "Reports",
    "updatedAtByAI": "2025-12-11",
    "tags": [
      "finance",
      "sales",
      "report",
      "monthly"
    ],
    "devFidelity": "scaffold"
  },
  "planning": {
    "generalDescription": "Página de relatório para visualizar vendas consolidadas e detalhadas do mês atual. Inclui visão agregada, tabelas detalhadas, filtros, exportação e controle de acesso restrito a usuários com a função Financial.",
    "goal": "Permitir que usuários com a função Financial visualizem, filtrem, detalhem e exportem relatórios de vendas do mês atual para análise financeira e auditoria.",
    "userStories": [
      {
        "story": "Como usuário Financial quero ver um resumo consolidado das vendas do mês atual para avaliar o desempenho mensal.",
        "derivedRequirements": [
          {
            "description": "Exibir KPIs principais (total de vendas, número de pedidos, ticket médio) no topo da página.",
            "done": false
          },
          {
            "description": "Apresentar gráficos (linha/coluna/pie) com evolução das vendas no mês atual por dia/semana.",
            "done": false
          },
          {
            "description": "Carregar por padrão o período do mês corrente com opção de navegar para meses anteriores.",
            "done": false
          }
        ]
      },
      {
        "story": "Como usuário Financial quero detalhar vendas por cliente, produto e transação para auditoria e análise.",
        "derivedRequirements": [
          {
            "description": "Tabela detalhada de transações com colunas: data, pedido, cliente, produto, quantidade, valor, status; suportar paginação e ordenação.",
            "done": false
          },
          {
            "description": "Funcionalidade de drill-down: clicar em um resumo para ver transações subjacentes.",
            "done": false
          },
          {
            "description": "Filtro avançado (cliente, produto, status, faixa de valor) e campo de busca por ID/pedido/cliente.",
            "done": false
          },
          {
            "description": "Exportar relatório consolidado ou detalhe em CSV/PDF.",
            "done": false
          }
        ]
      }
    ],
    "userRequestsFeatures": [
      {
        "description": "Acesso restrito apenas para usuários com role 'Financial' (RBAC).",
        "done": false
      },
      {
        "description": "Visão consolidada + detalhada do mês atual (default) com filtros e drill-down.",
        "done": false
      },
      {
        "description": "Gráficos interativos e tabela detalhada com paginação.",
        "done": false
      },
      {
        "description": "Exportação em CSV e PDF e possibilidade de copiar visualizações.",
        "done": false
      },
      {
        "description": "Carregamento eficiente e paginação para grandes volumes de dados; integração com API de vendas.",
        "done": false
      },
      {
        "description": "Design responsivo para desktop e tablet (foco em desktop para analistas financeiros).",
        "done": false
      }
    ],
    "userRequestsBugs": [],
    "userRequestsEnhancements": [
      {
        "description": "Agendamento de envio automático do relatório mensal por e-mail para um grupo de destinatários.",
        "done": false
      },
      {
        "description": "Capacidade de salvar views/filters personalizados.",
        "done": false
      }
    ],
    "constraints": [
      "Uso exclusivo para usuários com função 'Financial' (deve ser verificado via RBAC no backend).",
      "Por padrão, exibir dados do mês atual; mudanças de período devem ser explícitas pelo usuário.",
      "Necessidade de integrar com o backend/serviço de vendas existente para obter dados em tempo real.",
      "Conformidade com políticas de segurança e proteção de dados sensíveis."
    ]
  }
}



