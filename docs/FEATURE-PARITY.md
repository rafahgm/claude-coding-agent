# Paridade de funcionalidades

Comparação entre **(a)** GitHub Copilot Chat no VS Code, **(b)** a extensão oficial Claude Code, **(c)** o projeto de referência `claude-code-chat` (terceiro, 1.087 ★) e **(d)** o que está planejado aqui.

Última revisão: 2026-09-19.

## Legenda

| Símbolo | Significado |
|---|---|
| ✅ | Suportado |
| ⚠️ | Parcial, ou com ressalva relevante |
| ❌ | Não suportado |
| ❔ | Não confirmado na pesquisa — precisa de verificação prática |
| ➖ | Não se aplica |

| Prioridade | Significado |
|---|---|
| **P0** | Must-have da v0.1 (MVP) |
| **P1** | Must-have da v1.0 |
| **P2** | Nice-to-have — entra se couber |
| **P3** | Fora de escopo por ora — reavaliar depois da v1 |
| **✖** | Fora de escopo por decisão (ver [VISION.md § non-goals](VISION.md#5-o-que-este-projeto-não-é-non-goals)) |

> As colunas (a), (b) e (c) refletem o que foi possível confirmar na documentação pública em setembro de 2026. Itens marcados ❔ não foram confirmados e não devem ser tratados como fato.

---

## 1. Superfícies de UI

| Funcionalidade | Copilot Chat | Claude Code oficial | claude-code-chat | Esta extensão (v1) | Prio |
|---|---|---|---|---|---|
| Painel de chat dedicado | ✅ (view nativa de chat) | ✅ (secondary sidebar, arrastável para painel/aba) | ✅ (webview própria) | ✅ webview própria | **P0** |
| Chat na sidebar **e** no painel principal | ✅ | ✅ | ✅ | ✅ | **P1** |
| Chat inline no editor (Ctrl+I) | ✅ | ⚠️ via seleção + @-mention | ❌ | ⚠️ ver nota abaixo | **P2** |
| Chat no terminal | ✅ | ➖ (o CLI *é* o terminal) | ❌ | ❌ | **P3** |
| Quick chat (palette) | ✅ | ❌ | ❌ | ❌ | **P3** |
| Participante `@` na view de chat nativa | ➖ (é o dono da view) | ❌ | ❌ | ✖ fora de escopo ([#9](DECISIONS.md#9-superfície-de-ui-webview-própria-ou-chat-participant-api)) | **✖** |
| Tema do VS Code respeitado | ✅ | ✅ | ✅ | ✅ | **P0** |
| Múltiplas conversas simultâneas | ✅ | ✅ (abas de sessão) | ⚠️ uma por vez | ⚠️ v1: uma ativa, várias persistidas | **P1** |

**Nota — chat inline.** Não existe API pública finalizada para um terceiro contribuir com um provedor de chat inline no editor. A alternativa viável é uma implementação própria: `CodeLens`/`CodeAction` para disparar, webview posicionada ou `InputBox`, e aplicação da edição via `WorkspaceEdit` com o diff nativo. É trabalho real, não adaptação — por isso P2.

**Nota — participante `@`.** Fora de escopo por decisão ([#9](DECISIONS.md#9-superfície-de-ui-webview-própria-ou-chat-participant-api)): a webview própria é a superfície única. A API é finalizada e um terceiro pode registrar `@meu-agente`, mas carrega duas ressalvas documentadas — precisa ser @-mencionado e não pode ser o participante padrão — e uma incerteza que nunca foi resolvida: se a view de chat nativa é utilizável sem plano Copilot. Com a decisão, essa incerteza deixa de ser um risco do projeto. Ver [ARCHITECTURE.md § 4.2](ARCHITECTURE.md#42-chat-participant-api--descartada-em-2026-09-19).

## 2. Conversa e contexto

| Funcionalidade | Copilot Chat | Claude Code oficial | claude-code-chat | Esta extensão (v1) | Prio |
|---|---|---|---|---|---|
| Streaming de resposta | ✅ | ✅ | ✅ | ✅ | **P0** |
| `@`/`#` referência de arquivos | ✅ | ✅ | ✅ (`@` com busca no workspace) | ✅ `@` com quick-pick | **P0** |
| Seleção do editor como contexto | ✅ | ✅ (@-mentions ligadas à seleção) | ⚠️ | ✅ | **P0** |
| Arquivos abertos / aba ativa como contexto | ✅ | ✅ | ❔ | ✅ | **P1** |
| Diagnósticos do language server como contexto | ✅ | ✅ (MCP embutido que expõe diagnostics) | ❌ | ✅ via bridge MCP | **P1** |
| Colar imagem com preview | ✅ | ✅ | ✅ (preview + base64) | ✅ | **P1** |
| Arrastar arquivo/pasta para o chat | ✅ | ❔ | ❌ | ✅ | **P2** |
| Markdown com syntax highlight | ✅ | ✅ | ✅ | ✅ | **P0** |
| Copiar bloco de código / mensagem | ✅ | ✅ | ✅ | ✅ | **P0** |
| Editar e reenviar mensagem anterior | ✅ | ⚠️ | ❌ | ⚠️ v1: reenviar; editar depende de fork de sessão | **P2** |
| Interromper geração | ✅ | ✅ | ✅ (botão stop) | ✅ | **P0** |
| Enfileirar mensagens durante execução | ✅ | ✅ | ❔ | ✅ (nativo do modo streaming do SDK) | **P1** |
| `@workspace` com índice semântico do repositório | ✅ (backend do GitHub) | ❌ | ❌ | ✖ inalcançável | **✖** |

## 3. Modo agente e ferramentas

| Funcionalidade | Copilot Chat | Claude Code oficial | claude-code-chat | Esta extensão (v1) | Prio |
|---|---|---|---|---|---|
| Modo agente autônomo (multi-turno, multi-ferramenta) | ✅ | ✅ | ✅ | ✅ | **P0** |
| Ferramentas de arquivo (read/write/edit) | ✅ | ✅ | ✅ | ✅ (nativas do SDK) | **P0** |
| Execução de comandos de shell | ✅ | ✅ | ✅ | ✅ | **P0** |
| Busca no código (glob/grep) | ✅ | ✅ | ✅ | ✅ | **P0** |
| Web search / web fetch | ✅ | ✅ | ✅ | ✅ (ferramenta nativa do SDK) | **P1** |
| Modo Plan (planejar antes de editar) | ⚠️ (plan mode recente) | ✅ | ✅ (toggle "Plan First") | ✅ (`permissionMode: 'plan'`) | **P1** |
| Níveis de raciocínio (think / ultrathink) | ⚠️ | ✅ | ✅ (4 níveis) | ✅ (via `effort`) | **P1** |
| Subagentes | ✅ (custom agents) | ✅ | ⚠️ via `/agents` do CLI | ✅ (`options.agents`) | **P2** |
| Hooks de ciclo de vida | ❌ | ✅ | ⚠️ herdado do CLI | ✅ (usado internamente, exposto depois) | **P1** interno / **P2** exposto |
| Servidores MCP | ✅ | ✅ | ✅ + marketplace de MCP | ✅ (stdio/http/sse + in-process) | **P2** |
| Consumir ferramentas de outras extensões VS Code | ✅ (`vscode.lm.tools`) | ❌ | ❌ | ❔ ver nota | **P2** |
| Skills / plugins | ⚠️ (agent plugins, preview) | ✅ | ✅ (browser de skills) | ⚠️ herdado se o `settingSource` do projeto estiver ativo | **P2** |
| `CLAUDE.md` / memória de projeto | ⚠️ (`.github/copilot-instructions.md`) | ✅ | ✅ | ✅ (carregado pelo SDK) | **P0** |
| Slash commands | ✅ (`/explain`, `/fix`, `/tests`) | ✅ (23+ nativos) | ✅ (modal com 23+) | ⚠️ v1: subconjunto | **P1** |
| Marketplace de MCP / skills dentro da UI | ✅ | ❌ | ✅ | ❌ | **P3** |

**Nota — ferramentas de outras extensões.** A Language Model Tool API é finalizada e `vscode.lm.tools` lista as ferramentas contribuídas por extensões instaladas. Expô-las ao Claude via um servidor MCP in-process é arquiteturalmente limpo e seria um diferencial real. **Porém**, não foi confirmado se `vscode.lm.invokeTool` pode ser chamada fora do contexto de uma requisição de chat (o parâmetro `toolInvocationToken`). Precisa de spike antes de virar promessa.

## 4. Permissões e segurança

| Funcionalidade | Copilot Chat | Claude Code oficial | claude-code-chat | Esta extensão (v1) | Prio |
|---|---|---|---|---|---|
| Aprovação por ferramenta antes de executar | ✅ | ✅ | ✅ | ✅ | **P0** |
| Preview do comando/diff antes de aprovar | ✅ | ✅ | ✅ | ✅ | **P0** |
| "Always allow" por comando/padrão | ✅ | ✅ | ✅ (npm, git, docker…) | ✅ (grava em `.claude/settings.json`) | **P0** |
| Escopo da regra: sessão / workspace / global | ✅ | ✅ | ⚠️ | ✅ | **P1** |
| Modo autônomo sem aprovações ("YOLO") | ✅ | ✅ (`--dangerously-skip-permissions`) | ✅ ("YOLO Mode") | ✅ com atrito deliberado | **P1** |
| Auto-aprovar apenas edições de arquivo | ✅ | ✅ | ⚠️ | ✅ (`acceptEdits`) | **P0** |
| Deny-list de ferramentas/caminhos | ✅ | ✅ | ⚠️ | ✅ (`disallowedTools`) | **P1** |
| Log auditável de tudo que o agente executou | ⚠️ | ⚠️ | ❌ | ✅ (via hooks `PreToolUse`/`PostToolUse`) | **P1** |
| Confinar escritas ao workspace | ✅ | ✅ | ⚠️ | ✅ | **P0** |

## 5. Revisão e reversão de mudanças

| Funcionalidade | Copilot Chat | Claude Code oficial | claude-code-chat | Esta extensão (v1) | Prio |
|---|---|---|---|---|---|
| Diff inline dentro da mensagem | ✅ | ✅ | ✅ | ✅ | **P0** |
| Abrir no editor de diff nativo do VS Code | ✅ | ✅ (side-by-side) | ✅ (um clique) | ✅ | **P0** |
| Aceitar/rejeitar por arquivo | ✅ | ✅ | ⚠️ | ✅ | **P1** |
| Aceitar/rejeitar por hunk | ✅ | ⚠️ | ❌ | ⚠️ v1: por arquivo | **P2** |
| Lista de arquivos alterados no turno | ✅ | ✅ | ✅ | ✅ | **P0** |
| Checkpoints com backup via git | ⚠️ (undo de turno) | ✅ | ✅ (shadow repo + restauração 1-clique) | ✅ | **P1** |
| Restaurar para checkpoint com um clique | ⚠️ | ✅ | ✅ | ✅ | **P1** |
| Integração com o Source Control nativo | ✅ | ⚠️ | ❌ | ⚠️ v1: não poluir o SCM do usuário | **P2** |

**Nota — checkpoints.** A abordagem do `claude-code-chat` (repositório git sombra, fora do `.git` do usuário) é a certa: dá restauração confiável sem interferir no histórico, no index nem nos hooks do projeto. Vale replicar o conceito. **Atenção jurídica:** aquele repositório está publicado com licença "Other / NOASSERTION", então serve como referência conceitual, não como origem de código copiado.

## 6. Sessões e histórico

| Funcionalidade | Copilot Chat | Claude Code oficial | claude-code-chat | Esta extensão (v1) | Prio |
|---|---|---|---|---|---|
| Histórico de conversas persistido | ✅ | ✅ | ✅ | ✅ (armazenamento do SDK) | **P0** |
| Lista navegável de sessões | ✅ | ✅ (abas) | ⚠️ | ✅ | **P1** |
| Retomar sessão anterior | ✅ | ✅ | ✅ | ✅ (`resume`) | **P1** |
| Fork de sessão a partir de um ponto | ✅ | ✅ | ❌ | ✅ (`forkSession` + `resumeSessionAt`) | **P2** |
| Renomear / marcar sessão | ✅ | ✅ | ❌ | ✅ (`renameSession`/`tagSession`) | **P2** |
| Sessões por workspace | ✅ | ✅ | ✅ | ✅ | **P1** |
| Compactação automática de contexto | ✅ | ✅ | ✅ | ✅ (nativa do harness) | **P0** |
| Aviso visual de compactação | ⚠️ | ✅ | ❌ | ✅ (hook `PreCompact`) | **P2** |
| Sessões na nuvem / agentes remotos | ✅ | ⚠️ | ❌ | ✖ | **✖** |

## 7. Modelos, custo e configuração

| Funcionalidade | Copilot Chat | Claude Code oficial | claude-code-chat | Esta extensão (v1) | Prio |
|---|---|---|---|---|---|
| Seletor de modelo | ✅ (multi-provider) | ✅ (modelos Claude) | ✅ + modelos de terceiros | ✅ (Claude apenas) | **P0** |
| Tokens e custo em tempo real na UI | ❌ | ⚠️ (`/cost`) | ✅ | ✅ (`total_cost_usd` do SDK) | **P1** |
| Teto de gasto por sessão | ❌ | ❌ | ❌ | ✅ (`maxBudgetUsd`) | **P2** |
| Modelos não-Claude | ✅ | ❌ | ✅ (via provedor terceiro) | ✖ v1 | **✖** v1 / **P3** depois |
| Autenticação por API key | ➖ | ✅ | ✅ | ✅ | **P0** |
| Login por assinatura (Pro/Max) | ➖ | ✅ | ⚠️ herda o login do CLI local | ✅ herda o login do CLI local ([#4](DECISIONS.md#4-autenticação)) | **P0** |
| Bedrock / Vertex / Foundry | ➖ | ✅ | ❔ | ✅ (variáveis de ambiente do SDK) | **P2** |
| Configuração lida de `.claude/` do projeto | ➖ | ✅ | ✅ | ✅ | **P0** |

## 8. Ambientes e distribuição

| Funcionalidade | Copilot Chat | Claude Code oficial | claude-code-chat | Esta extensão (v1) | Prio |
|---|---|---|---|---|---|
| Windows / macOS / Linux nativos | ✅ | ✅ | ✅ | ✅ | **P0** |
| WSL | ✅ | ⚠️ historicamente frágil | ✅ (settings dedicadas de distro/node/claude path) | ✅ | **P1** |
| Remote — SSH | ✅ | ⚠️ | ❔ | ⚠️ | **P2** |
| Dev Containers | ✅ | ⚠️ | ❔ | ⚠️ | **P2** |
| Codespaces / vscode.dev (browser) | ✅ | ❌ | ❌ | ✖ (precisa de processo local) | **✖** |
| VS Code Marketplace | ✅ | ✅ | ✅ | ❔ ver [DECISIONS #3](DECISIONS.md#3-distribuição) | **P1** decidir |
| Open VSX (VSCodium, Cursor, Windsurf) | ❌ | ❌ | ❔ | ❔ | **P2** |

**Nota — WSL.** O `claude-code-chat` expõe quatro settings para isso: `claudeCodeChat.wsl.enabled`, `.wsl.distro`, `.wsl.nodePath` e `.wsl.claudePath`. O padrão é útil como referência, mas o problema de fundo muda de natureza dependendo do modo de integração escolhido — se a extensão roda *dentro* do WSL Remote (Extension Host no Linux), não há cruzamento de sistemas de arquivos e o problema desaparece. Detalhamento em [ARCHITECTURE.md § 9](ARCHITECTURE.md#9-ambientes-remotos-e-wsl).

---

## 9. Resumo: o que definimos como must-have da v0.1

Todos os itens **P0** acima, que somados são:

1. Painel de chat em webview com streaming, tema nativo e interrupção
2. `@`-referência de arquivos + seleção do editor como contexto
3. Modo agente com as ferramentas nativas do SDK (Read/Write/Edit/Bash/Glob/Grep)
4. Aprovação interativa de ferramentas, com preview e "always allow" persistido
5. Diff inline nas mensagens + abrir no diff nativo do VS Code
6. `CLAUDE.md` e `.claude/settings.json` do projeto respeitados
7. Sessão persistida por workspace, com compactação automática
8. Seletor de modelo Claude; autenticação reutilizando o login do CLI, com API key como alternativa

## 10. O que é inalcançável por design

Registrado para não voltar como pergunta:

- **`@workspace` com embeddings** — depende de indexação no backend do GitHub.
- **Copilot Workspace, revisão de PR, `@github`** — produtos do GitHub, não APIs.
- **Autocomplete inline (ghost text)** — non-goal, ver [VISION.md](VISION.md#5-o-que-este-projeto-não-é-non-goals).
- **Chat no browser (vscode.dev / Codespaces web)** — o harness precisa de um processo Node local com acesso a disco.
- **Ser o participante padrão da view de chat nativa** — bloqueado por política da API do VS Code para terceiros.

## Fontes

- [Chat Participant API — VS Code](https://code.visualstudio.com/api/extension-guides/ai/chat)
- [Language Model Tool API — VS Code](https://code.visualstudio.com/api/extension-guides/ai/tools)
- [Agent SDK — visão geral](https://code.claude.com/docs/en/agent-sdk/overview) · [referência TypeScript](https://code.claude.com/docs/en/agent-sdk/typescript) · [permissões](https://code.claude.com/docs/en/agent-sdk/permissions) · [MCP](https://code.claude.com/docs/en/agent-sdk/mcp)
- [andrepimenta/claude-code-chat](https://github.com/andrepimenta/claude-code-chat)
