const esbuild = require('esbuild');

const production = process.argv.includes('--production');
const watch = process.argv.includes('--watch');

async function main() {
  const ctx = await esbuild.context({
    entryPoints: ['src/extension.ts'],
    bundle: true,
    format: 'cjs',
    minify: production,
    sourcemap: !production,
    sourcesContent: false,
    platform: 'node',
    outfile: 'dist/extension.js',
    // O SDK traz o binário nativo por optional dependencies (ARCHITECTURE.md
    // § 10) — empacotar via esbuild quebraria a resolução do binário, que
    // depende da estrutura real de node_modules. Ele viaja no .vsix como
    // dependência de produção normal, não bundlado.
    external: [
      'vscode',
      '@anthropic-ai/claude-agent-sdk',
      '@anthropic-ai/sdk',
      '@modelcontextprotocol/sdk',
      'zod',
    ],
    logLevel: 'info',
  });

  if (watch) {
    await ctx.watch();
  } else {
    await ctx.rebuild();
    await ctx.dispose();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
