# Visão do produto

Status: rascunho para discussão. Última revisão: 2026-09-19.

## 1. Frase-resumo

Uma extensão de VS Code que dá ao harness do Claude uma interface de primeira classe dentro do editor, sem passar pelo GitHub Copilot.

## 2. Por que existir

O ponto de partida não é "falta uma UI de chat para LLM no VS Code" — existem várias. O ponto é mais estreito:

**O harness importa mais que o modelo.** Quando o Claude roda dentro do Copilot Chat, o modelo é da Anthropic, mas o loop do agente, o gerenciamento de contexto, a compactação, a política de ferramentas e a recuperação de erro são da Microsoft. É aí que a instabilidade aparece. Ferramentas como Cline, Roo Code e Continue resolvem a parte da UI, mas também reimplementam o harness — trocam um harness de terceiros por outro.

Este projeto aposta em uma combinação que hoje não existe empacotada:

```
harness da Anthropic  +  UI nativa do VS Code  +  sem dependência de Copilot
```

A extensão oficial da Anthropic chega perto, mas é uma casca fina sobre o CLI e a Anthropic sinalizou que não pretende ir além disso nas APIs de extensão do VS Code. Existe espaço para uma extensão de terceiros que trate o VS Code como cidadão de primeira classe.

## 3. Público-alvo

**Primário — desenvolvedor individual que já paga Anthropic e vive no VS Code.**
Tem API key ou assinatura Claude, usa o CLI e quer o mesmo comportamento dentro do editor, com diffs, seleção e diagnósticos integrados. Não quer pagar Copilot só para ter o painel de chat.

**Secundário — time pequeno que padronizou em Claude.**
Quer `CLAUDE.md`, skills e servidores MCP compartilhados no repositório, valendo igualmente no CLI e no editor, sem forçar cada pessoa a montar sua própria configuração.

**Terciário — quem hoje usa Cline/Roo/Continue e sente falta do comportamento do Claude Code.**
Quer modo Plan, subagentes, hooks e o mesmo modelo de permissões do CLI — não uma aproximação.

**Explicitamente não é o público:** quem quer um agregador multi-provider, quem quer autocomplete inline estilo Copilot, e quem precisa de gestão centralizada de licenças em empresa grande.

## 4. O que este projeto É

- **Um cliente de VS Code para o harness Claude Code.** A inteligência sobre *como* o agente trabalha vive no SDK/CLI da Anthropic. Nossa responsabilidade é apresentação, contexto do editor e controle do usuário.
- **Uma UI de chat e de agente integrada ao editor.** Painel de chat, revisão de diffs no editor de diff nativo, aprovações de ferramenta, sessões navegáveis.
- **Uma ponte de contexto.** Trazer para o agente o que só o VS Code sabe: seleção atual, arquivos abertos, diagnósticos do language server, controle de versão, terminal, ferramentas contribuídas por outras extensões.
- **Uma camada de controle.** Tornar visível e aprovável cada ação do agente, com granularidade maior que "sim/não" — por comando, por caminho, por sessão.
- **Transparente sobre custo.** Tokens e custo por turno e por sessão, na UI, sempre.

## 5. O que este projeto NÃO é (non-goals)

Cada item aqui é uma decisão, não uma omissão.

| Non-goal | Por quê |
|---|---|
| **Não é um fork ou substituto do Claude Code CLI.** | O CLI continua sendo a referência de comportamento. Se a extensão e o CLI divergirem, o bug é da extensão. |
| **Não reimplementa o loop do agente.** | Reimplementar planejamento, compactação de contexto e política de ferramentas em TypeScript é exatamente o erro que gerou a instabilidade que motivou o projeto. |
| **Não é um agregador multi-provider no v1.** | Suportar GPT/Gemini/Llama significa abandonar o harness Claude — é um produto diferente. A arquitetura deixa a porta entreaberta (ver [DECISIONS #7](DECISIONS.md#7-só-claude-ou-multi-provider)), mas v1 é Claude-only. |
| **Não faz autocomplete inline (ghost text).** | Produto distinto, com requisitos de latência e custo incompatíveis com um agente. É o que Copilot faz bem e não é onde queremos competir. |
| **Não substitui a extensão oficial da Anthropic.** | Podem coexistir. Se a oficial evoluir para cobrir isto, ótimo. |
| **Não tenta paridade 1:1 com Copilot Chat.** | Recursos que dependem do backend do GitHub (Copilot Workspace, code review de PR, indexação remota de repositório, `@workspace` com embeddings do GitHub) são inalcançáveis por design. Ver [FEATURE-PARITY.md](FEATURE-PARITY.md). |
| **Não é um cliente de API genérico.** | Sem playground de prompt, sem ajuste de `temperature`, sem edição de system prompt cru. Quem quer isso usa a API direto. |
| **Não coleta telemetria de conteúdo.** | Nenhum prompt, trecho de código ou nome de arquivo sai da máquina do usuário para servidores nossos. Escopo exato em [DECISIONS #5](DECISIONS.md#5-telemetria). |
| **Não hospeda nem faz proxy de credenciais.** | A credencial do usuário vai direto do processo local para a Anthropic. Não existe backend nosso no caminho, e a extensão não implementa fluxo de login próprio — ela reutiliza o que já está na máquina. |
| **Não é comercializado.** | O uso da credencial de assinatura do próprio usuário foi liberado pela Anthropic **na condição de o projeto ser sem fins comerciais** ([#4](DECISIONS.md#4-autenticação)). Licença paga, versão pro ou patrocínio vinculado ao produto reabrem essa conversa. A condição não é herdada por forks. |
| **Não suporta outros editores no v1.** | Cursor e Windsurf são forks do VS Code e provavelmente funcionam por acidente; não serão testados nem suportados. JetBrains está fora. |
| **Não usa a view de chat nativa do VS Code.** | A superfície é uma webview própria, decidida em 2026-09-19 ([#9](DECISIONS.md#9-superfície-de-ui-webview-própria-ou-chat-participant-api)). O custo — histórico, seletor de modelo, sessões e acessibilidade por nossa conta — é o preço de não depender de política da Microsoft. |

## 6. Princípios de design

1. **O harness é a fonte da verdade.** Toda vez que houver escolha entre reimplementar um comportamento e delegar ao SDK, delegar.
2. **Nenhuma ação invisível.** Toda escrita em disco, todo comando de shell e toda chamada MCP aparece na UI antes ou depois de rodar — mesmo em modo autônomo. Isso tem consequência arquitetural direta: permissões pré-aprovadas *não* passam pelo callback de permissão do SDK, então a observabilidade tem que vir de hooks. Ver [ARCHITECTURE.md § Permissões](ARCHITECTURE.md#7-permissões-e-observabilidade-de-ferramentas).
3. **Configuração é do repositório, não da extensão.** `CLAUDE.md`, `.claude/settings.json`, `.mcp.json` e skills são lidos do projeto. A extensão adiciona preferências de UI, não um segundo lugar para configurar o agente.
4. **Degradar, não quebrar.** Sem API key configurada, sem workspace aberto, em Remote SSH, com o binário faltando: a extensão diz o que houve e o que fazer, e as partes que funcionam continuam funcionando.
5. **Superfície pequena de configuração.** Cada setting nova é dívida. O default tem que ser bom.

## 7. Como saber se deu certo

Critérios de sucesso para a v1, em ordem de importância:

1. **Paridade de comportamento com o CLI.** Uma tarefa que o `claude` resolve no terminal resolve igual na extensão, com o mesmo `CLAUDE.md` e as mesmas ferramentas.
2. **Substituição real.** O autor do projeto para de abrir o terminal para tarefas de agente.
3. **Sem regressão de confiabilidade.** Sessões longas não travam, não perdem contexto silenciosamente e não deixam o workspace num estado meio-editado.
4. **Instalação em menos de dois minutos** para quem já tem API key.
5. **Nenhum requisito de conta GitHub em nenhum ponto do fluxo.**

## 8. Riscos que podem matar o projeto

Listados aqui porque afetam a decisão de começar, não só a execução.

- **Contrato de I/O instável.** Tanto o SDK quanto o CLI evoluem rápido. Mitigação: a camada `AgentRuntime` (ver ARCHITECTURE) isola o contato, e testes de contrato rodam contra versões fixadas.
- **Condição de uso não comercial.** O projeto reutiliza o login do Claude Code CLI do próprio usuário com base num esclarecimento da Anthropic válido para uso **sem fins comerciais**. Monetizar reabre a questão; um esclarecimento informal também pode ser revisto. Se isso cair, o produto volta a ser só-API-key e perde quem tem apenas assinatura Pro/Max. Ver [DECISIONS #4](DECISIONS.md#4-autenticação).
- **A Anthropic resolver fazer isso.** Se a extensão oficial ganhar tudo que está no roadmap, o projeto perde razão de existir. Mitigação parcial: o valor está na integração com o VS Code, não no harness — e essa parte continua sendo trabalho.
- **APIs de chat do VS Code fecharem ainda mais.** Boa parte da experiência de chat "de primeira classe" está atrás de APIs propostas que a Microsoft só libera para extensões próprias. Ver [ARCHITECTURE.md § Superfícies de UI](ARCHITECTURE.md#4-superfícies-de-ui-o-que-o-vs-code-realmente-oferece).
