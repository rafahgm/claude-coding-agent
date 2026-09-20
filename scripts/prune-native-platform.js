// `vsce package --target <t>` remove os pacotes nativos de outro os/cpu
// automaticamente, mas NÃO distingue libc — glibc e musl convivem em
// node_modules para o mesmo os/cpu (achado do spike S2, ver
// spikes/s2-vsix-packaging/FINDINGS.md). Sem isso, um .vsix "linux-x64"
// carrega os dois binários nativos (~450MB) em vez de um (~220MB).
//
// Uso: node scripts/prune-native-platform.js <vsce-target>
const fs = require('node:fs');
const path = require('node:path');

const TARGET_TO_PACKAGE = {
  'win32-x64': 'win32-x64',
  'win32-arm64': 'win32-arm64',
  'darwin-x64': 'darwin-x64',
  'darwin-arm64': 'darwin-arm64',
  'linux-x64': 'linux-x64',
  'linux-arm64': 'linux-arm64',
  'alpine-x64': 'linux-x64-musl',
  'alpine-arm64': 'linux-arm64-musl',
};

const target = process.argv[2];
const keepSuffix = TARGET_TO_PACKAGE[target];
if (!keepSuffix) {
  console.error(`Alvo desconhecido: ${target}. Use um de: ${Object.keys(TARGET_TO_PACKAGE).join(', ')}`);
  process.exit(1);
}

const scopeDir = path.join(__dirname, '..', 'node_modules', '@anthropic-ai');
const keepDir = `claude-agent-sdk-${keepSuffix}`;

for (const entry of fs.readdirSync(scopeDir)) {
  const isNativePkg = entry.startsWith('claude-agent-sdk-');
  if (isNativePkg && entry !== keepDir) {
    fs.rmSync(path.join(scopeDir, entry), { recursive: true, force: true });
    console.log(`Removido (plataforma não usada): ${entry}`);
  }
}

if (!fs.existsSync(path.join(scopeDir, keepDir))) {
  console.error(`${keepDir} não está instalado — rode 'npm install' num host ${target} antes de empacotar.`);
  process.exit(1);
}
console.log(`Mantido: ${keepDir}`);
