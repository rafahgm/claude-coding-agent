const tsParser = require('@typescript-eslint/parser');
const tsPlugin = require('@typescript-eslint/eslint-plugin');

// Regra de arquitetura (ARCHITECTURE.md § 5): nenhum componente fora do
// AgentRuntime importa o SDK diretamente. Mantém a troca de runtime barata.
module.exports = [
  {
    files: ['src/**/*.ts'],
    ignores: ['src/runtime/SdkAgentRuntime.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: { sourceType: 'module' },
    },
    plugins: { '@typescript-eslint': tsPlugin },
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: '@anthropic-ai/claude-agent-sdk',
              message: 'Só SdkAgentRuntime.ts pode importar o SDK — ver ARCHITECTURE.md § 5.',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['src/runtime/SdkAgentRuntime.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: { sourceType: 'module' },
    },
    plugins: { '@typescript-eslint': tsPlugin },
    rules: {},
  },
];
