# Decisões

Log das nove decisões estruturais do projeto. Este documento se chamava `OPEN-QUESTIONS.md` enquanto essas decisões estavam pendentes; renomeado para `DECISIONS.md` em 2026-09-19, quando a última foi fechada. Cada item preserva o contexto apurado na pesquisa e as opções descartadas — não como curiosidade histórica, mas porque é aí que ficam registradas as condições sob as quais vale reabrir uma decisão (ex.: "se o spike S2 falhar...", "se aparecer demanda real...").

Última revisão: 2026-09-19.

## Registro

| # | Decisão | Escolha | Bloqueava | Data |
|---|---|---|---|---|
| [8](#8-sdk-como-biblioteca-ou-wrapping-do-cli) | SDK × wrapping do CLI | **Claude Agent SDK como biblioteca** | Scaffold inteiro | 2026-09-19 |
| [9](#9-superfície-de-ui-webview-própria-ou-chat-participant-api) | Superfície de UI | **Webview própria**, superfície única | Scaffold da UI | 2026-09-19 |
| [4](#4-autenticação) | Autenticação | **Reutilizar o login do CLI** via token OAuth no ambiente | Onboarding, público endereçável | 2026-09-19 |
| [1](#1-nome-do-projeto) | Nome do projeto | **"Claude Coding Agent"** — direção B, descritivo | `package.json`, IDs de comando, publisher | 2026-09-19 |
| [2](#2-licença-e-modelo-de-abertura) | Licença | **Apache 2.0, aberto desde o primeiro commit** | Primeiro commit público | 2026-09-19 |
| [6](#6-remote-development-no-mvp) | Remote Development | **Opção A** — `extensionKind: workspace` + detectar e orientar | Escopo da v0.1 | 2026-09-19 |
| [3](#3-distribuição) | Distribuição | **Marketplace + Open VSX + GitHub Releases**, papéis distintos | Release da v0.1 | 2026-09-19 |
| [5](#5-telemetria) | Telemetria | **A + D** — zero telemetria de rede, log de diagnóstico local exportável | Política de privacidade, release | 2026-09-19 |
| [7](#7-só-claude-ou-multi-provider) | Multi-provider | **Opção B** — Claude-only na v1, `AgentRuntime` não desenhada para isso | Nada — só depois da v1 | 2026-09-19 |

**Todas as nove decisões estão fechadas.** Nada trava mais nenhuma fase do roadmap.

---

## 1. Nome do projeto

> ✅ **Decidida em 2026-09-19 — "Claude Coding Agent", direção B.** Contexto e opções ficam registrados abaixo pelo motivo de sempre: a restrição de marca que gerou as opções continua valendo para qualquer nome derivado.

### Contexto

Duas restrições de marca, das duas pontas:

- **Anthropic** ([branding guidelines](https://code.claude.com/docs/en/agent-sdk/overview)) — **não permitido:** "Claude Code", "Claude Code Agent", ASCII art ou elementos visuais que imitem o Claude Code. **Permitido:** "Claude Agent", "Claude" dentro de um menu já rotulado "Agents", e "*{SeuNome}* Powered by Claude". O produto deve manter identidade própria e não parecer um produto da Anthropic.
- **Microsoft/GitHub** — "Copilot" e "GitHub" são marcas registradas. O Marketplace tem uma "GitHub Copilot extensibility acceptable development and use policy" para extensões que se integram ao Copilot; não se aplica diretamente a nós, mas usar "Copilot" no nome é caminho certo para rejeição.

Note que o codinome atual, `vscode-claude`, embora não viole as regras listadas, também não é um nome de produto — não tem identidade própria, que é justamente o que as diretrizes pedem.

### Opções

| Direção | Exemplos | Prós | Contras |
|---|---|---|---|
| **A. Nome próprio + tagline** | "Anvil — Powered by Claude", "Lodestone" | Sem risco de marca, espaço para identidade própria, alinhado com o que a Anthropic pede | Zero descoberta orgânica; ninguém busca por "Anvil" |
| **B. Descritivo com "Claude Agent"** | "Claude Agent for VS Code" | Descoberta imediata no Marketplace, usa forma explicitamente permitida | Risco de parecer oficial da Anthropic; o `for VS Code` pode esbarrar em política de nomes do Marketplace |
| **C. Híbrido** | "Anvil: Claude Agent for VS Code" | Identidade própria + descoberta; display name e `name` do pacote podem diferir | Nome longo |
| **D. Funcional e neutro** | "Agent Panel", "Coding Agent Chat" | Zero risco, sobrevive a uma troca de provider | Genérico, indistinguível |

### Decisão — 2026-09-19: opção B, "Claude Coding Agent"

**Decidido:** o nome do projeto é **Claude Coding Agent**. Direção B, sem nome próprio — decisão explícita de não investir em uma marca autônoma.

**Por que essa forma e não "Claude Agent for VS Code":** "Claude Agent" sozinho colide de fato — existe uma extensão publicada chamada **"Claude Agent SDK"** (`ms-vscode.vscode-claude-sdk`, expõe o pacote npm para outras extensões; não é concorrente de produto, mas compartilha a frase). "Claude Coding Agent" verificado sem colisão no Marketplace. Descartar o sufixo "for VS Code"/"in VS Code" também evita a questão de convenção que a Microsoft recomenda ("‹ação› in VS Code") — é redundante de qualquer forma, já que o Marketplace onde a extensão é listada já é de VS Code.

**Risco que a direção B carrega e que não desaparece com a escolha do nome:** parecer produto oficial da Anthropic. Mitigação já existe no [README](../README.md) — a nota "Este projeto não é afiliado, patrocinado ou endossado pela Anthropic" — e precisa continuar visível na descrição do Marketplace, não só no repositório.

**Consequências práticas:**

- `displayName`: "Claude Coding Agent"
- `name` (slug do pacote): `claude-coding-agent`
- Prefixo de comandos e configuração: `claudeCodingAgent.*` (ex.: `claudeCodingAgent.openChat`, `claudeCodingAgent.model`)
- `publisher`: id da conta do autor no Marketplace — não deriva do nome do produto, porque não há nome próprio separado (era o papel que a direção C reservava para ele)
- O codinome de repositório `vscode-claude` **não foi renomeado** — é só o nome da pasta/repositório local, sem efeito no pacote publicado. Renomear o diretório é uma ação separada, a fazer quando (e se) o autor quiser, sem urgência.

**Se um dia entrar um segundo provider ([questão 7](#7-só-claude-ou-multi-provider)):** um nome com "Claude" embutido no `name`/`displayName` não sobrevive a essa mudança sem novo ciclo de rename — diferente do que a direção C teria oferecido. Aceito conscientemente: a decisão da questão 7 já é "Claude-only na v1", e o nome pode ser revisitado se e quando essa questão mudar.

---

## 2. Licença e modelo de abertura

> ✅ **Decidida em 2026-09-19 — Apache 2.0, aberto desde o primeiro commit.** Contexto e opções ficam registrados abaixo.

### Contexto

Três camadas independentes: a licença do nosso código, os termos do SDK e a licença dos projetos de referência.

- **SDK:** *"Use of the Claude Agent SDK is governed by Anthropic's Commercial Terms of Service, including when you use it to power products and services that you make available to your own customers and end users"* ([overview](https://code.claude.com/docs/en/agent-sdk/overview)). Isso governa o **uso**, não impede licenciar nosso código como quisermos — mas precisa ser dito na documentação, porque afeta quem redistribuir.
- **Referências:** o `claude-code-chat` está publicado como "Other / NOASSERTION". Na prática: não copiar código de lá. Conceitos e abordagens, sim.

### Opções

| Licença | Prós | Contras |
|---|---|---|
| **MIT** | Máxima adoção, zero atrito para contribuir, padrão de fato em extensões VS Code | Nada impede um fork comercial fechado |
| **Apache 2.0** | Igual a MIT + concessão explícita de patentes + exigência de `NOTICE` | Levemente mais verboso; algumas empresas preferem MIT |
| **GPLv3 / AGPLv3** | Forks precisam permanecer abertos | Hostil a uso corporativo; atrito real em extensões de editor |
| **Fonte fechada** | Controle total | Contradiz o posicionamento; ninguém confia credencial de API a uma extensão fechada de autor individual |

**Aberto desde o início ou depois?** Abrir só após a v1 permite iterar sem plateia, mas perde contribuições, revisão de segurança independente e — o mais relevante aqui — a confiança necessária para alguém colar uma API key.

### Decisão — 2026-09-19: Apache 2.0, aberto desde o primeiro commit

**Decidido:** Apache 2.0. A cláusula de patentes importa num espaço onde há fornecedores grandes; e o argumento de confiança é decisivo para uma extensão que lida com credenciais e executa comandos de shell. Repositório aberto **desde o primeiro commit** — não depois da v1.

**Interação com a questão 4 (autenticação) — a única pendência real que essa decisão deixa.** A licença Apache 2.0 é permissiva por design e não impede, nem deveria impedir, um fork comercial do código. O que ela não cobre é a condição sob a qual a Anthropic autorizou a reutilização do login do CLI: **sem fins comerciais**. Isso não é uma cláusula de licença — é uma condição de uso de uma funcionalidade específica, e não é herdada automaticamente por quem faz fork. **Ação decorrente, a executar no primeiro commit:** um aviso explícito perto da licença (`NOTICE` ou seção dedicada no `README`) dizendo que (a) o código é Apache 2.0 e pode ser forkado livremente, mas (b) o mecanismo de login-via-CLI foi autorizado nominalmente para este projeto sem fins comerciais, e um fork que passe a monetizar precisa da própria autorização da Anthropic antes de manter esse caminho. Ver [questão 4](#4-autenticação).

**Arquivos criados:** [`LICENSE`](../LICENSE) (texto padrão Apache 2.0, copyright "Rafael", 2026) e [`NOTICE`](../NOTICE) (atribuição + a ressalva acima, por extenso). Prontos para o primeiro commit.

---

## 3. Distribuição

> ✅ **Decidida em 2026-09-19 — os três canais.** Contexto e opções ficam registrados abaixo.

### Contexto

- **VS Code Marketplace** — alcance quase total, mas é da Microsoft e só aceita `.vsix` compatíveis com as regras dela (sem APIs propostas, entre outras).
- **Open VSX** — registro aberto usado por VSCodium, Cursor, Windsurf, Gitpod e Theia. Instalação de uma linha no `vsce`/`ovsx`.
- **VSIX direto no GitHub Releases** — sem intermediário. É o único caminho se alguma API proposta virar dependência (questão 9).

### Opções

| Canal | Prós | Contras |
|---|---|---|
| **Só Marketplace** | Onde os usuários estão; updates automáticos | Dependência de uma política que pode mudar; deixa de fora VSCodium e forks |
| **Marketplace + Open VSX** | Cobertura completa, custo marginal ~zero no CI | Duas contas, dois tokens, dois fluxos de publicação |
| **+ VSIX no GitHub Releases** | Canal de escape para pré-lançamentos e builds com API proposta | Sem update automático; usuário reinstala na mão |

### Decisão — 2026-09-19: os três canais, com papéis distintos

**Decidido:** Marketplace e Open VSX publicados pelo mesmo job de CI para releases estáveis; GitHub Releases para builds de desenvolvimento e pré-lançamento.

**Atualização em relação ao motivo original:** o doc original listava "o cenário em que uma API proposta seja necessária" como justificativa para manter GitHub Releases como canal de escape. Isso deixou de se aplicar — a decisão da [questão 9](#9-superfície-de-ui-webview-própria-ou-chat-participant-api) (webview própria, sem Chat Participant) já evita as únicas três APIs propostas listadas em [ARCHITECTURE § 4.1](ARCHITECTURE.md#41-apis-relevantes-e-seu-status). GitHub Releases continua fazendo parte da decisão, mas por um motivo mais simples: builds de desenvolvimento/pré-lançamento sem esperar review de nenhum dos dois registros.

**Consequência de CI a não esquecer:** VSIX por plataforma (ver [ARCHITECTURE § 10](ARCHITECTURE.md#10-empacotamento-e-distribuição-do-binário)) multiplica os artefatos por canal — três canais × três plataformas são nove artefatos por release. O pipeline de CI precisa ser desenhado pensando nisso desde o início, não como reforma depois.

**Pendências que essa decisão abre, sem urgência:** criar contas/tokens de publisher no Marketplace e na Open VSX (dependem do nome já decidido — `claude-coding-agent` — e de uma conta pessoal ou de organização a escolher), e desenhar o job de CI que publica nos três em paralelo a partir da mesma tag de release.

---

## 4. Autenticação

> ✅ **Decidida em 2026-09-19 — opção B: reutilizar o login do CLI.** Ver [Decisão](#decisão--2026-09-19-opção-b-reutilizar-o-login-do-cli) no fim da seção. O contexto e as opções ficam registrados porque a decisão depende de uma condição — o projeto ser sem fins comerciais — que precisa continuar valendo.

**Esta era a questão com maior impacto sobre o tamanho do público endereçável.**

### Contexto — a restrição é explícita

> *"Unless previously approved, Anthropic does not allow third party developers to offer claude.ai login or rate limits for their products, including agents built on the Claude Agent SDK. Please use the API key authentication methods described in this document instead."*
> — [Agent SDK Quickstart](https://code.claude.com/docs/en/agent-sdk/quickstart), repetido na [visão geral](https://code.claude.com/docs/en/agent-sdk/overview)

Métodos suportados e documentados:

| Método | Variáveis |
|---|---|
| API key da Anthropic | `ANTHROPIC_API_KEY` |
| Amazon Bedrock | `CLAUDE_CODE_USE_BEDROCK=1` + credenciais AWS |
| Claude Platform on AWS | `CLAUDE_CODE_USE_ANTHROPIC_AWS=1` + `ANTHROPIC_AWS_WORKSPACE_ID` |
| Google Cloud | `CLAUDE_CODE_USE_VERTEX=1` + credenciais GCP |
| Microsoft Foundry | `CLAUDE_CODE_USE_FOUNDRY=1` + credenciais Azure |

### A zona cinzenta que precisa de decisão consciente

Existe um cenário intermediário que a regra acima não endereça de forma inequívoca: **o usuário já tem o Claude Code CLI instalado e autenticado na própria máquina, com a própria assinatura.** Se a extensão simplesmente aponta `pathToClaudeCodeExecutable` para esse binário e ele usa as credenciais que já estão lá, estamos "oferecendo login claude.ai" ou apenas orquestrando a instalação local do próprio usuário?

Argumentos dos dois lados:

- **Provavelmente aceitável:** a extensão não implementa fluxo de login, não armazena nem transmite credenciais, e não faz proxy de nada. É a leitura que sustenta o `claude-code-chat`, que faz isso hoje.
- **Provavelmente problemático:** o efeito prático para o usuário final é um produto de terceiro operando sob os limites de taxa da assinatura Claude — exatamente o que a cláusula descreve.

**Isso não deve ser resolvido por interpretação.** Se o caminho importar para o produto, vale um contato com a Anthropic pedindo esclarecimento ou aprovação prévia — a própria redação ("unless previously approved") pressupõe que existe um processo.

> **Resolvido.** O esclarecimento veio: Thariq (Anthropic) confirmou que, para um projeto **sem fins comerciais**, esse uso não é problema. Isso fecha a zona cinzenta — nas condições descritas na decisão abaixo, e só nelas.

### Opções

| Opção | Prós | Contras |
|---|---|---|
| **A. Só API key** | Inequivocamente conforme; simples; funciona sem CLI instalado | Exclui quem só tem Pro/Max; usuário precisa entender billing por token; a barreira de onboarding cresce muito |
| **B. API key + reutilizar credencial do CLI local** | Cobre assinantes Pro/Max sem implementar login; atende quem já usa o CLI | Zona cinzenta de termos; depende de CLI instalado e autenticado; comportamento opaco para o usuário |
| **C. API key + provedores de nuvem** | Cobre times corporativos com Bedrock/Vertex/Foundry; zero ambiguidade | Não ajuda o usuário individual, que é o público primário |
| **D. Pedir aprovação prévia à Anthropic** | Se sair, é o melhor produto possível | Prazo indeterminado; pode não sair |

### Decisão — 2026-09-19: opção B, reutilizar o login do CLI

**Decidido:** a extensão reutiliza a credencial do Claude Code CLI já presente na máquina, passando o token OAuth ao processo do agente pelo ambiente. A API key continua sendo um caminho aceito, para quem não tem o CLI instalado.

**Base:** o projeto não tem fins comerciais, e Thariq (Anthropic) esclareceu que nesse cenário não há problema.

**Duas consequências que viram restrições permanentes do projeto:**

1. **Não comercializar.** A dispensa vale porque o projeto é sem fins lucrativos. Licença paga, versão pro, patrocínio vinculado ao produto ou qualquer outra monetização reabre a questão e exige nova conversa com a Anthropic. Isso não conflita com licenciar o código de forma aberta (questão 2) — mas **precisa estar escrito no README**, porque quem fizer um fork comercial não herda a dispensa.
2. **Guardar o registro do esclarecimento.** Foi um esclarecimento pontual, não a política escrita — a redação pública continua dizendo "unless previously approved". Vale arquivar data, canal e teor no repositório e reconfirmar antes de qualquer release público amplo.

**Variável de ambiente:** **`CLAUDE_CODE_OAUTH_TOKEN`**, gerada por `claude setup-token`.

> ✅ **Verificado em Linux, 2026-09-20 (spike S6).** É a opção `env` de `Options` (parâmetro de `query()`): substitui o ambiente do processo filho **por inteiro** — não faz merge com `process.env`, então quem chama precisa espalhar `process.env` manualmente e acrescentar `CLAUDE_CODE_OAUTH_TOKEN`. Testado com `HOME` isolado (sem `~/.claude/.credentials.json`) e só essa variável setada: um turno completo, incluindo chamada de ferramenta, autenticou e funcionou. `SdkAgentRuntime.ts` já implementa isso. Windows e macOS não testados — ver [spikes/s2-vsix-packaging/FINDINGS.md](../spikes/s2-vsix-packaging/FINDINGS.md).

**Sub-decisões que a decisão abre e continuam pendentes** (nenhuma bloqueia o scaffold; todas bloqueiam a tela de onboarding):

| Ponto | Opções | Nota |
|---|---|---|
| Como obter o token | `claude setup-token` (exige o CLI instalado) × ler `~/.claude/.credentials.json` × o usuário cola manualmente | Ler o arquivo de credenciais dispensa passos do usuário, mas é formato interno da Anthropic, sem contrato de estabilidade — quebra sem aviso |
| Onde guardar | `vscode.SecretStorage` × não guardar e reler do ambiente a cada sessão | `SecretStorage` é o padrão da plataforma e o que o usuário espera |
| Expiração | O que a extensão faz quando o token expira no meio de um turno | Precisa de caminho de erro explícito — ver [ARCHITECTURE § 12](ARCHITECTURE.md#12-erros-e-degradação) |
| Precedência | Token do CLI × `ANTHROPIC_API_KEY` do ambiente × configuração da extensão | Definir antes de escrever o onboarding, e mostrar na UI qual está em uso |

**Consequência de onboarding:** a primeira experiência passa a ser *"detectamos seu login do Claude Code — usar?"* em vez de *"cole uma API key"*. É bem melhor do que o cenário assumido antes. O caminho da API key continua existindo e ainda precisa ser bom, porque é o único para quem não usa o CLI.

Bedrock, Vertex e Foundry (opção C) seguem previstos para a v0.2, sem mudança.

---

## 5. Telemetria

> ✅ **Decidida em 2026-09-19 — opção A + D.** Contexto e opções ficam registrados abaixo.

### Contexto

O produto executa comandos de shell e lê todo o código do usuário. Qualquer telemetria carrega um ônus de confiança desproporcional ao seu valor. Em contrapartida, sem nenhum dado é difícil saber onde o produto quebra.

VS Code oferece `vscode.env.createTelemetryLogger()`, que respeita automaticamente a setting global `telemetry.telemetryLevel` do usuário.

### Opções

| Opção | Prós | Contras |
|---|---|---|
| **A. Zero telemetria** | Argumento de confiança forte e simples de comunicar; nada a explicar numa política de privacidade | Voando às cegas; bugs só aparecem se alguém abrir issue |
| **B. Opt-in, agregado e anônimo** | Dados de quem escolheu dar; honesto | Taxa de adesão baixa, amostra enviesada |
| **C. Opt-out, só erros e contadores** | Cobertura real de crashes | "Opt-out" é sinal vermelho para o público-alvo deste produto |
| **D. Só local** — log de diagnóstico na máquina, anexável a uma issue | Zero dados saindo; ótimo para depurar quando alguém reporta | Só funciona com usuário cooperativo |

### Decisão — 2026-09-19: A + D

**Decidido:** zero telemetria de rede (A) + comando "Exportar log de diagnóstico" que gera um arquivo **local**, redigido, que o usuário anexa numa issue se quiser (D). Nada sai da máquina por conta própria da extensão.

**B (opt-in agregado) fica registrado como caminho futuro**, não descartado — só entra se surgir necessidade real de dados, e com opt-in explícito, nunca por padrão.

**Regra permanente, válida em qualquer cenário futuro:** nunca coletar conteúdo de prompt, trecho de código, nome de arquivo ou caminho — nem no log local, nem em qualquer telemetria que vier a existir. Essa regra já era um non-goal declarado em [VISION.md § 5](VISION.md#5-o-que-este-projeto-não-é-non-goals); a decisão aqui é a única combinação de opções que não contradiz o que o projeto já tinha se comprometido a não fazer.

**Consequência de implementação, sem urgência:** o log de diagnóstico precisa de uma lista explícita de campos permitidos (versão da extensão, do VS Code, do SO, códigos de erro, timings agregados) em vez de dump livre de estado — é fácil um log "de depuração" acabar carregando um caminho de arquivo ou um trecho de prompt por descuido. Definir essa lista quando o log for implementado, não antes.

---

## 6. Remote Development no MVP

> ✅ **Decidida em 2026-09-19 — opção A.** Contexto e opções ficam registrados abaixo.

### Contexto

A análise técnica ([ARCHITECTURE § 9](ARCHITECTURE.md#9-ambientes-remotos-e-wsl)) mostra que a pergunta se divide em duas, com custos muito diferentes:

- **Rodar no Extension Host remoto** (WSL Remote, Remote-SSH, Dev Containers): custa declarar `extensionKind: ["workspace"]` e testar. **Baixo custo.**
- **Cruzar a fronteira** (VS Code no Windows, projeto no WSL, invocando via `wsl.exe`): tradução de caminhos, descoberta de binário e credenciais em outro sistema de arquivos. **Alto custo e alta fragilidade** — é notoriamente frágil até em extensões oficiais.

### Opções

| Opção | Prós | Contras |
|---|---|---|
| **A. `extensionKind: workspace` + detectar e orientar** | Cobre WSL/SSH/containers de verdade, com pouco código; o usuário resolve com um comando | Não atende quem se recusa a usar WSL Remote |
| **B. + travessia de fronteira estilo `claude-code-chat`** | Funciona sem mudar o hábito do usuário | Quatro settings novas, tradução de caminhos, categoria inteira de bugs difíceis |
| **C. Adiar tudo** | MVP menor | WSL não é nicho; num ambiente WSL2 como o seu, seria a primeira coisa a quebrar |

### Decisão — 2026-09-19: opção A

**Decidido:** `extensionKind: ["workspace"]` no `package.json` — cobre WSL Remote, Remote-SSH e Dev Containers de verdade, transparente, sem código de travessia. Para o caso ruim (VS Code no Windows + projeto dentro do WSL sem "Reopen in WSL"), a extensão detecta a situação e orienta o usuário a reabrir a pasta em WSL Remote — um comando, resolve de verdade, e resolve também o problema conhecido de credenciais do Claude Code presas dentro do WSL.

**B (travessia de fronteira estilo `claude-code-chat`) fica registrado como não-objetivo** até que haja demanda concreta — não descartado para sempre, só fora do escopo enquanto não houver sinal real de que o caso ruim é comum o suficiente para justificar quatro settings novas e uma categoria de bugs frágeis.

**Nota para o próprio autor:** ambiente de desenvolvimento é WSL2 — a opção A cobre o uso diário via "Reopen in WSL" sem ressalva; só caindo no caso ruim (VS Code Windows + pasta WSL sem reabrir) é que a extensão vai pedir para reabrir, em vez de funcionar direto.

---

## 7. Só Claude ou multi-provider

> ✅ **Decidida em 2026-09-19 — opção B.** Contexto e opções ficam registrados abaixo.

### Contexto

O `claude-code-chat` foi por esse caminho: expõe botões para GPT, Gemini, DeepSeek, Kimi, GLM e MiniMax através de um provedor terceiro agregador, além dos modelos Claude direto na Anthropic.

O ponto que costuma passar despercebido: **suportar outros modelos significa abandonar o harness Claude.** O loop do agente, as ferramentas, o modo Plan, os hooks e os subagentes são do Claude Code — não existe "trocar o modelo" mantendo o resto. Outro provider exige um segundo runtime completo. É um produto diferente dentro do mesmo pacote.

### Opções

| Opção | Prós | Contras |
|---|---|---|
| **A. Claude-only, permanentemente** | Foco; arquitetura simples; a proposta de valor fica nítida | Perde quem quer um único painel para tudo |
| **B. Claude-only na v1, arquitetura preparada** | Foco agora sem fechar a porta; a interface `AgentRuntime` já é o ponto de extensão | Risco de over-engineering por um futuro que talvez não venha |
| **C. Multi-provider desde cedo** | Endereça mercado maior | Dobra o escopo; abandona o diferencial declarado em [VISION](VISION.md); vira mais um Cline |

### Decisão — 2026-09-19: opção B, Claude-only na v1

**Decidido:** Claude-only na v1, com a porta entreaberta — não Claude-only permanente (A), não multi-provider desde cedo (C).

**A ressalva que faz essa decisão funcionar na prática, e que se aplica direto à `AgentRuntime` já criada pela [questão 8](#8-sdk-como-biblioteca-ou-wrapping-do-cli):** a interface **não deve ser desenhada pensando em multi-provider**. Ela existe pelo motivo já registrado lá — isolar o SDK, ser testável, permitir uma eventual `CliAgentRuntime` — não para antecipar um segundo provider hipotético. Se um dia esse segundo provider aparecer de verdade, a interface provavelmente vai precisar mudar, e tudo bem: projetar hoje para um caso hipotético produz uma abstração ruim tanto para o caso real quanto para o hipotético.

**O que essa decisão não muda:** nada da arquitetura atual. `SdkAgentRuntime` continua sendo a única implementação, sem nenhum código, flag ou abstração extra dedicada a "um segundo provider". A diferença entre B e A é inteiramente de intenção declarada — B deixa escrito que a porta não está trancada por princípio, não que algo precisa ser construído para ela agora.

---

## 8. SDK como biblioteca ou wrapping do CLI

> ✅ **Decidida em 2026-09-19 — Claude Agent SDK como biblioteca.** O trade-off fica registrado abaixo porque existe um sinal que pode fazer reavaliar.

**A decisão arquitetural central.** A postura assumida em [ARCHITECTURE.md](ARCHITECTURE.md) é o SDK como padrão — e o registro do trade-off fica aqui, com um dado da pesquisa que muda o enquadramento.

### O dado que reenquadra a pergunta

> *"Both the TypeScript and Python SDKs bundle a native Claude Code binary (…) The TypeScript SDK installs its binary through npm optional dependencies"*
> — [Agent SDK Quickstart](https://code.claude.com/docs/en/agent-sdk/quickstart)

**O SDK TypeScript já orquestra o binário do Claude Code como processo filho.** Ele empacota o binário, faz o spawn e expõe um protocolo estruturado por cima — e `pathToClaudeCodeExecutable` permite apontar para outra instalação.

Portanto não são duas arquiteturas opostas. São duas formas de falar com **o mesmo processo**: por um protocolo tipado e versionado, ou por parsing de stdout.

### Comparação

| Critério | SDK como biblioteca | Wrapping manual do CLI |
|---|---|---|
| Recursos do Claude Code (skills, plugins, MCP, `CLAUDE.md`) | ✅ Mesmo binário; `settingSources` controla o carregamento | ✅ Mesmo binário |
| Tipagem e autocompletar | ✅ Tipos exportados | ❌ Parsing e tipos escritos à mão |
| Streaming incremental | ✅ `includePartialMessages` | ⚠️ Parsing de JSON lines |
| Permissões programáticas | ✅ `canUseTool` + hooks tipados | ⚠️ Servidor MCP de permissão como intermediário — abordagem do `claude-code-chat` |
| Hooks em TypeScript | ✅ Callbacks no nosso processo | ❌ Scripts de shell + IPC próprio |
| Sessões, fork, rename, tag | ✅ Funções dedicadas | ⚠️ Manipulação direta de arquivos de sessão |
| Custo e tokens | ✅ `total_cost_usd` estruturado | ⚠️ Depende do formato de saída |
| Slash commands interativos | ⚠️ Subconjunto exposto programaticamente | ✅ Todos, se replicar a UX do terminal |
| Estabilidade do contrato | ⚠️ Versionado em npm, com CHANGELOG | ❌ Formato de saída do CLI pode mudar sem aviso |
| Overhead de processo | Igual | Igual |
| Instalação | Binário embutido; sem pré-requisito | Exige o CLI instalado pelo usuário |
| Código a manter | Menos | Mais |

### O que se perde de fato com o SDK

Pouco, e o que se perde é específico: a UI de marketplace de MCP e skills (que é do terminal, não do harness) e a execução de alguns slash commands que só fazem sentido interativamente. Nenhum dos dois está no MVP.

### O que se ganha de fato com o wrapping

Um único cenário real: se aparecer uma capacidade exclusiva do CLI, sem equivalente no SDK, e que seja crítica para o produto. Nada do que foi levantado na pesquisa se encaixa nisso hoje.

### Decisão — 2026-09-19: SDK como biblioteca

**Decidido:** `@anthropic-ai/claude-agent-sdk` como biblioteca, com a interface `AgentRuntime` isolando o contato. A interface não é hedge teórico: ela torna o runtime mockável nos testes e barateia uma eventual `CliAgentRuntime`.

**Sinal para reavaliar:** se o spike S2 (empacotar o binário nativo num `.vsix` nas três plataformas) se mostrar inviável, exigir o CLI instalado pelo usuário passa a ser aceitável — e aí a distância entre os dois caminhos diminui bastante. A decisão da questão 4 reduz o custo desse cenário: quem reutiliza o login do CLI já tem o CLI instalado.

**Interação com a questão 4.** O SDK faz spawn do binário embutido; o `CLAUDE_CODE_OAUTH_TOKEN` precisa chegar a **esse processo filho**, não ao Extension Host. Isso acrescenta uma verificação ao spike S2: além de instalar e rodar nas três plataformas, o binário empacotado tem que autenticar com a credencial do CLI do usuário. Confirmar na referência TypeScript do SDK qual opção do `query` controla o ambiente do processo filho antes de assumir que basta exportar a variável.

---

## 9. Superfície de UI: webview própria ou Chat Participant API

> ✅ **Decidida em 2026-09-19 — webview própria, superfície única.** Questão adicionada durante a pesquisa; bloqueava o scaffold tanto quanto a #8.

### Contexto

A pesquisa levantou uma incerteza que não foi possível resolver na documentação: **não ficou confirmado se a view de chat nativa do VS Code é utilizável sem um plano GitHub Copilot.** As fontes divergem — detalhamento em [ARCHITECTURE § 4.2](ARCHITECTURE.md#42-chat-participant-api--a-questão-não-resolvida). Como "zero dependência do Copilot" é o requisito número um do projeto, isso não pode ser assumido.

Limitações confirmadas para um chat participant de terceiro, independentemente disso: precisa ser @-mencionado e não pode ser o participante padrão.

### Opções

| Opção | Prós | Contras |
|---|---|---|
| **A. Webview própria** | Controle total da UX; caminho comprovado por `claude-code-chat`, Cline e Roo Code; sem dependência de política da Microsoft | Reimplementar histórico, seletor de modelo, gerenciamento de sessões; manter paridade de tema e acessibilidade por conta própria |
| **B. Chat Participant API** | UI nativa de graça, acessibilidade e tema resolvidos, integração com o resto do chat | Depende da resposta do spike S1; usuário precisa @-mencionar; sem controle sobre a UI |
| **C. Webview primária + participant opcional** | Independência garantida, com bônus se o spike for favorável; a mesma `ChatController` atende as duas | Duas superfícies para testar |
| **D. Esperar o spike S1 antes de decidir** | Decide com dado em vez de suposição | Atrasa o scaffold em ~2 dias |

### Decisão — 2026-09-19: webview própria

**Decidido: opção A.** A webview é a superfície do produto, e a única. Não se espera o spike S1 — a decisão deixa de depender da resposta dele.

**O que isso compra:** independência completa de uma política da Microsoft sobre a qual não temos controle, controle total da UX, e uma única superfície para testar e manter.

**O que isso custa, e que precisa entrar no escopo da v0.1 sem descontos:** histórico, seletor de modelo, gerenciamento de sessões, paridade de tema e acessibilidade viram implementação nossa. Acessibilidade em webview — navegação por teclado, leitores de tela, contraste — é trabalho real, não acabamento; está listada na v0.4 do roadmap, e é o item com maior risco de ser empurrado indefinidamente.

**Chat participant como superfície adicional:** fora de escopo. Não está descartado para sempre, mas deixa de ser objetivo. Se um dia entrar, a `ChatController` é o ponto de extensão — `ChatResponseStream` é um subconjunto do que a webview já renderiza.

**O que acontece com o spike S1:** deixa de ser bloqueante. Continua tendo algum valor como informação (saber se a porta está aberta), mas com prioridade baixa e sem decidir nada. Ver [ROADMAP § v0.0](ROADMAP.md#v00--spikes-de-validação).

---

## Notas de pesquisa e informações não confirmadas

Registrado conforme solicitado, para não virar suposição depois:

- **Data do rename "Claude Code SDK" → "Claude Agent SDK".** A documentação atual referencia um guia de migração a partir dos pacotes antigos, mas **não foi encontrada confirmação da data**. A premissa de março de 2026 não pôde ser verificada. Irrelevante para as decisões acima, mas anotado para não ser citado como fato.
- **Disponibilidade da view de chat sem plano Copilot.** Fontes conflitantes, ver questão 9. **Não assumir nenhuma das leituras.** Deixou de bloquear com a decisão pela webview própria, mas continua sem resposta.
- **`vscode.lm.invokeTool` fora de contexto de chat.** Não confirmado. Spike S3.
- **Notas da 1.104 sobre modelos contribuídos por extensão** (*"only available to users on individual GitHub Copilot plans"*) são de setembro de 2025 e podem estar desatualizadas, já que o BYOK evoluiu desde então.
- **Licença do `claude-code-chat`:** "Other / NOASSERTION" no GitHub. Na prática, **não copiar código** de lá; usar como referência conceitual apenas.
- **Como passar o token ao processo filho.** A variável é `CLAUDE_CODE_OAUTH_TOKEN` (confirmada). O que **não** está confirmado é qual opção do `query` controla o ambiente do subprocesso que o SDK faz spawn — verificar na referência TypeScript antes de escrever o `SdkAgentRuntime`.
- **Esclarecimento da Anthropic sobre reutilizar o login do CLI.** Verbal, de Thariq, para uso sem fins comerciais. Não é a política escrita. Arquivar o registro e reconfirmar antes de release público amplo.
