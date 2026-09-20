# Claude Coding Agent

> Nome do repositório/pasta local: `vscode-claude` (codinome de desenvolvimento, não renomeado). O nome do produto — **Claude Coding Agent** — foi decidido em 2026-09-19; ver [`docs/DECISIONS.md`](docs/DECISIONS.md#1-nome-do-projeto).

Extensão para VS Code que entrega uma experiência de chat e agente de codificação comparável à do GitHub Copilot Chat, construída sobre o **Claude Agent SDK** da Anthropic — **sem exigir assinatura do GitHub Copilot**.

**Status: planejamento, todas as decisões estruturais fechadas.** Este repositório contém apenas documentação — nenhuma linha de código de implementação foi escrita, mas as nove questões de [`docs/DECISIONS.md`](docs/DECISIONS.md) já foram todas decididas. Nada trava mais o início da implementação.

---

## O problema

Hoje existem três caminhos para usar Claude dentro do VS Code, e cada um cobra um preço:

| Caminho | Limitação |
|---|---|
| Claude dentro do GitHub Copilot Chat | Exige assinatura Copilot; o harness é da Microsoft/GitHub, não da Anthropic — problemas recorrentes de estabilidade e confiabilidade, sem controle nosso sobre o loop do agente. |
| Extensão oficial Claude Code | Boa, mas é essencialmente uma casca em torno do CLI; a Anthropic não planeja dar suporte nativo às APIs de extensão do VS Code além desse caminho. |
| CLI no terminal integrado | Funciona bem, mas fica fora do fluxo do editor: sem diffs nativos, sem @-referência ligada à seleção, sem gerenciamento visual de sessões. |

## A proposta

Um meio-termo deliberado entre duas coisas que já existem:

- A **UX** do GitHub Copilot Chat — painel de chat, chat inline, modo agente, revisão de diffs, seletor de modelo, sessões gerenciáveis, slash commands.
- As **capacidades** do harness Claude Code — subagentes, hooks, `CLAUDE.md`, modo Plan, MCP, permissões granulares, checkpoints.

Com três compromissos que definem o projeto:

1. **Zero dependência do Copilot.** Nem assinatura, nem extensão instalada, nem login no GitHub.
2. **O harness é o da Anthropic.** O loop do agente, o gerenciamento de contexto e as ferramentas vêm do Claude Agent SDK, não de uma reimplementação nossa.
3. **A UI é nativa do VS Code.** Diffs no editor de diff nativo, aprovações que respeitam o tema, sessões que se comportam como abas.

## Decisões estruturais já tomadas

| Decisão | Escolha |
|---|---|
| Runtime do agente | **Claude Agent SDK como biblioteca** ([#8](docs/DECISIONS.md#8-sdk-como-biblioteca-ou-wrapping-do-cli)) |
| Superfície de UI | **Webview própria**, superfície única — sem Chat Participant API ([#9](docs/DECISIONS.md#9-superfície-de-ui-webview-própria-ou-chat-participant-api)) |
| Autenticação | **Reutilizar o login do Claude Code CLI** via token OAuth no ambiente, com API key como alternativa ([#4](docs/DECISIONS.md#4-autenticação)) |
| Nome do projeto | **Claude Coding Agent** — descritivo, sem marca própria ([#1](docs/DECISIONS.md#1-nome-do-projeto)) |
| Licença | **Apache 2.0**, aberto desde o primeiro commit ([#2](docs/DECISIONS.md#2-licença-e-modelo-de-abertura)) |
| Remote Development | `extensionKind: workspace` + detectar e orientar; sem travessia de fronteira Windows↔WSL ([#6](docs/DECISIONS.md#6-remote-development-no-mvp)) |
| Distribuição | **Marketplace + Open VSX + GitHub Releases**, mesmo CI, papéis distintos ([#3](docs/DECISIONS.md#3-distribuição)) |
| Telemetria | **Zero de rede + log de diagnóstico local exportável** ([#5](docs/DECISIONS.md#5-telemetria)) |
| Multi-provider | **Claude-only na v1**, porta entreaberta — `AgentRuntime` não desenhada para isso ([#7](docs/DECISIONS.md#7-só-claude-ou-multi-provider)) |

## Escopo da v0.1 (MVP)

Decidido: **chat + edição com aprovação.**

- Painel de chat com streaming
- `@`-referência de arquivos e seleção do editor como contexto
- Modo agente com as ferramentas nativas (Read / Write / Edit / Bash / Glob / Grep)
- Diff viewer e aprovação interativa de ferramentas

Fora do MVP: chat inline no editor, checkpoints via git, MCP, subagentes, Remote Development. Detalhamento em [`docs/ROADMAP.md`](docs/ROADMAP.md).

## Documentação

| Documento | Conteúdo |
|---|---|
| [`docs/VISION.md`](docs/VISION.md) | Objetivos, público-alvo, non-goals explícitos |
| [`docs/FEATURE-PARITY.md`](docs/FEATURE-PARITY.md) | Comparação Copilot Chat × Claude Code oficial × v1 desta extensão, com prioridades |
| [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) | Arquitetura técnica, APIs do VS Code usadas, diagramas de fluxo |
| [`docs/DECISIONS.md`](docs/DECISIONS.md) | Log das nove decisões estruturais, com contexto, opções e prós/contras |
| [`docs/ROADMAP.md`](docs/ROADMAP.md) | Fases v0.0 (spikes) até v1.0 |

## Stack prevista

- TypeScript, Node.js 18+ (requisito do Agent SDK)
- `@anthropic-ai/claude-agent-sdk` como runtime do agente
- Webview (VS Code Webview API) para o painel de chat
- APIs nativas do VS Code para diff, seleção, diagnósticos e comandos

## Restrições conhecidas

Duas restrições vêm da própria Anthropic e não são negociáveis:

- **Autenticação e uso não comercial:** a regra escrita é *"Unless previously approved, Anthropic does not allow third party developers to offer claude.ai login or rate limits for their products, including agents built on the Claude Agent SDK."* ([Agent SDK Quickstart](https://code.claude.com/docs/en/agent-sdk/quickstart)). Para **este projeto**, sem fins comerciais, Thariq (Anthropic) esclareceu que reutilizar o login do CLI local do próprio usuário não é problema. **Essa dispensa é condicional e não é transferível:** vale enquanto o projeto não for comercializado, e um fork comercial — mesmo sendo Apache 2.0 e portanto legítimo quanto ao código — não a herda. Detalhes em [DECISIONS #4](docs/DECISIONS.md#4-autenticação).
- **Marca:** o nome do produto não pode ser "Claude Code" nem imitar sua identidade visual. Formas permitidas: "Claude Agent", "*{SeuNome}* Powered by Claude". ([Branding guidelines](https://code.claude.com/docs/en/agent-sdk/overview))

Este projeto não é afiliado, patrocinado ou endossado pela Anthropic, pela Microsoft ou pelo GitHub.

## Licença

Apache License, Version 2.0 — ver [`LICENSE`](LICENSE). Leia também o [`NOTICE`](NOTICE): ele registra que a reutilização do login do Claude Code CLI foi autorizada pela Anthropic **especificamente para este projeto sem fins comerciais**, e que essa autorização não é herdada por forks comerciais — mesmo sendo o código, em si, livre para forkar sob Apache 2.0.

## Próximo passo

Nada mais trava o primeiro commit de código — as nove decisões estruturais estão fechadas ([`docs/DECISIONS.md`](docs/DECISIONS.md#registro)), e `LICENSE`/`NOTICE` já existem no repositório. O próximo passo são os spikes da v0.0 em [`docs/ROADMAP.md`](docs/ROADMAP.md#v00--spikes-de-validação) — prioridade para o **S2** (binário nativo empacotado no `.vsix`, agora também autenticando com o token do CLI) e o **S4** (ciclo de aprovação de ferramentas numa sessão longa).
