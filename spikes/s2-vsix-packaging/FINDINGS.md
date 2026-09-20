# S2 — resultado

> Pergunta original ([ROADMAP.md](../../docs/ROADMAP.md#v00--spikes-de-validação)): um `.vsix` com o binário nativo do SDK instala e roda em Windows, macOS e Linux? Roda junto o S6: autentica com a credencial do CLI do usuário?

**Validado em Linux (x64, glibc, WSL2) em 2026-09-20. Windows e macOS continuam sem validação — sem máquina disponível neste ambiente.**

## O que foi testado

O scaffold real do projeto (`package.json`, `esbuild.js`, `.vscodeignore` na raiz) já incorpora a estratégia validada aqui — isto não é código descartável separado, ao contrário do S1.

1. `npm run compile` + `npx tsc --noEmit` + `npx eslint src` — scaffold compila, tipa e a regra de lint que isola o import do SDK em `SdkAgentRuntime.ts` pega violação de verdade (testado inserindo uma linha e revertendo).
2. `npm run package:linux-x64` (`scripts/prune-native-platform.js` + `vsce package --target linux-x64`) — gera um `.vsix` de ~106MB.
3. O `.vsix` foi extraído para fora da árvore do projeto (`/tmp`, filesystem sem qualquer relação com `node_modules` daqui) e um script mínimo rodou `query()` a partir de `dist/`, exatamente como a extensão instalada faria.
4. O mesmo teste rodou de novo com `HOME` isolado (sem `~/.claude/.credentials.json`) e só `CLAUDE_CODE_OAUTH_TOKEN` no ambiente passado a `options.env`.

## Achados

- **O binário nativo resolve corretamente fora da árvore original.** O SDK localiza `node_modules/@anthropic-ai/claude-agent-sdk-<plataforma>/claude` a partir da posição do próprio `sdk.mjs` no pacote instalado — não depende de nada específico do projeto de desenvolvimento. Confirma a premissa da ARCHITECTURE.md § 10.
- **`esbuild` não pode bundlar o SDK.** Faz bundle da lógica de resolução de binário para dentro de `dist/extension.js`, o que muda a base de resolução relativa e quebraria a busca do pacote nativo irmão. Solução adotada: `external: ['@anthropic-ai/claude-agent-sdk', ...peer deps]` no `esbuild.js` — o SDK viaja como dependência de produção normal dentro do `.vsix`, não bundlado.
- **`vsce package --target <plataforma>` filtra por `os`/`cpu`, mas não por `libc`.** Empacotar com `--target linux-x64` manteve `claude-agent-sdk-linux-x64` (glibc) **e** `claude-agent-sdk-linux-x64-musl` juntos — ~450MB de binários nativos em vez de ~220MB. Corrigido com `scripts/prune-native-platform.js`, que remove manualmente a variante de libc que não corresponde ao alvo antes de empacotar. Reduziu o `.vsix` de 201MB para 106MB. Achado não documentado nas fontes consultadas em ARCHITECTURE.md — é novo.
- **A permissão de execução do binário sobrevive no zip do `.vsix`.** `external_attr` do `.vsix` preserva `rwxr-xr-x` corretamente. (Uma tentativa inicial de extrair o `.vsix` com `zipfile` do Python para testar deu falso-positivo de "binário não executa" — `zipfile.extract()` do Python não restaura permissões Unix; não é um problema do pacote em si, e a extração real do VS Code/`vsce` não tem esse problema.)
- **S6 resolvido: `options.env` de `query()` controla o ambiente do processo filho.** Substitui o ambiente inteiro (não faz merge com `process.env` — precisa espalhar `process.env` manualmente, como o `SdkAgentRuntime.ts` já faz). Com `HOME` apontando para um diretório sem `~/.claude/.credentials.json` e só `CLAUDE_CODE_OAUTH_TOKEN` setado nesse `env`, um turno completo (incluindo chamada de ferramenta `Bash`) funcionou. Fecha a pendência registrada em [DECISIONS.md #4](../../docs/DECISIONS.md#4-autenticação) e [ARCHITECTURE.md § 8](../../docs/ARCHITECTURE.md#8-sdk-como-biblioteca-ou-wrapping-do-cli) sobre qual opção do `query` controla esse ambiente.

## O que fica pendente

- **Windows e macOS não testados.** O mecanismo (SDK + optional dependencies + `vsce --target`) é o mesmo documentado publicamente para as três plataformas, e nada no achado acima é Linux-específico — mas isso é inferência, não evidência reproduzida. Precisa de uma máquina Windows e uma macOS reais para fechar o critério de saída da v0.0 por completo.
- **Instalação via `.vsix` num VS Code de verdade** (Electron completo, não só o processo Node isolado) não foi feita — o `code` CLI disponível neste ambiente é o wrapper de interop do WSL para o VS Code Windows do autor, que ignora `--user-data-dir`/`--extensions-dir` (só existem no `code` nativo rodando fora do WSL). O teste acima isola a variável que importa (resolução do binário + auth fora da árvore do projeto), mas não substitui um `code --install-extension` real seguido de um turno na UI.
