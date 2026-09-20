# S1 — resultado

> Pergunta original ([ROADMAP.md](../../docs/ROADMAP.md#v00--spikes-de-validação)): um chat participant de terceiro funciona em VS Code limpo, sem conta GitHub?

**Validado em Windows em 2026-09-20.** Não bloqueava mais nada — a [questão 9](../../docs/DECISIONS.md#9-superfície-de-ui-webview-própria-ou-chat-participant-api) já havia decidido a webview própria como superfície única antes deste teste. Rodado por completude, prioridade baixa.

## O que foi testado

Extensão mínima (`package.json` + `extension.js`, sem build) registrando um chat participant (`@s1spike`), empacotada com `vsce package` e instalada com:

```powershell
code --user-data-dir "$env:TEMP\vscode-clean-profile" --extensions-dir "$env:TEMP\vscode-clean-extensions" --install-extension .\s1-chat-participant-spike-0.0.1.vsix
```

## Achados

- **Um chat participant de terceiro ativa e responde num VS Code limpo, sem conta GitHub nem plano Copilot.** Depois de marcar a pasta de trabalho como confiável (Workspace Trust), `@s1spike` apareceu normalmente na caixa de chat.
- **Marcar a pasta como confiável foi um passo necessário e não documentado antes deste teste.** Sem isso, o participant não aparece na UI de chat — não é suficiente instalar a extensão com `--extensions-dir` isolado; o perfil precisa também confiar no workspace aberto.

## O que fica pendente

- Não testado em macOS/Linux nem em conjunto com uma conta GitHub real (só o caminho "sem conta"). Como o S1 não é critério de saída da v0.0 e a decisão de superfície já está tomada, não há necessidade de fechar essas lacunas.
