# S1 — chat participant de terceiro funciona sem conta GitHub?

> Não bloqueia mais nada — a webview própria já é a superfície única, por decisão
> registrada em `docs/DECISIONS.md` #9 (na raiz do repo).
> Este spike ficou como informação de prioridade baixa. Código descartável, como o
> `docs/ROADMAP.md` (v0.0 — spikes de validação) pede.

Extensão mínima (`package.json` + `extension.js`, sem build) que registra um
chat participant (`@s1spike`) só para observar se ele ativa e responde num
VS Code sem conta GitHub nem plano Copilot.

## O que já foi verificado nesta sessão

- O manifesto empacota sem erro: `npx @vscode/vsce package --allow-missing-repository`.
- **O `code` CLI deste ambiente não serve para testar isso automaticamente.** É
  o wrapper de interop do WSL para o VS Code do Windows do autor — ele ignora
  silenciosamente `--user-data-dir` e `--extensions-dir` ("Ignoring option...
  not supported for code") e instala direto no perfil real do usuário. Uma
  tentativa de instalar aqui acabou instalando o spike no VS Code de uso diário
  do autor; foi desinstalado (`code --uninstall-extension
  spike-local.s1-chat-participant-spike`) assim que percebido.

## Como testar de verdade (requer janela gráfica interativa)

Isso só dá para fechar com o autor olhando a UI — não é automatizável por CLI
neste ambiente.

1. `cd spikes/s1-chat-participant && npx @vscode/vsce package --allow-missing-repository`
2. Um perfil realmente limpo precisa de um `code` nativo (não o wrapper WSL) —
   rodar isso de dentro do Windows (PowerShell) ou de uma instalação Linux
   nativa do VS Code, não via interop:
   ```
   code --user-data-dir /tmp/vscode-clean-profile --extensions-dir /tmp/vscode-clean-extensions \
     --install-extension ./s1-chat-participant-spike-0.0.1.vsix
   code --user-data-dir /tmp/vscode-clean-profile --extensions-dir /tmp/vscode-clean-extensions .
   ```
3. Sem estar logado em nenhuma conta (GitHub, Microsoft) nesse perfil, abrir a
   view de chat nativa e digitar `@s1spike olá`.
4. Observar: (a) o participante aparece na lista de `@`-menções; (b) responde
   sem pedir login de nenhuma conta; (c) alguma mensagem menciona exigência de
   plano Copilot.

## Resultado

Não fechado — depende do passo manual acima. Como a decisão #9 já tirou isso
do caminho crítico, não há urgência.
