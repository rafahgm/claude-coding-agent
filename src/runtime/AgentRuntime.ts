/**
 * Fronteira entre o resto da extensão e o harness do agente. Nenhum outro
 * arquivo fora de `SdkAgentRuntime.ts` importa `@anthropic-ai/claude-agent-sdk`
 * — ver ARCHITECTURE.md § 2 e a regra de lint em eslint.config.js.
 *
 * Por não importar o SDK, este arquivo não redefine os tipos que ele exporta
 * (SDKUserMessage, SDKAssistantMessage, ...). RuntimeEvent expõe só os poucos
 * campos que a UI hoje consome — não é uma cópia da união de eventos do SDK.
 */

export type PermissionMode = 'default' | 'acceptEdits' | 'plan' | 'bypassPermissions';

export interface RuntimeConfig {
  cwd: string;
  model?: string;
  /** Substitui o ambiente do processo filho inteiro; ver nota em SdkAgentRuntime.ts. */
  env?: NodeJS.ProcessEnv;
}

export type RuntimeEvent =
  | { type: 'text-delta'; text: string }
  | { type: 'tool-use'; name: string; input: unknown }
  | { type: 'result'; costUsd: number; durationMs: number; isError: boolean }
  | { type: 'error'; message: string };

export interface RuntimeSession {
  send(text: string): void;
  events(): AsyncIterable<RuntimeEvent>;
  interrupt(): Promise<void>;
  setPermissionMode(mode: PermissionMode): Promise<void>;
  dispose(): Promise<void>;
}

export interface AgentRuntime {
  /** Pré-aquece o subprocesso do harness antes do primeiro prompt do usuário. */
  startup(): Promise<void>;
  start(config: RuntimeConfig): Promise<RuntimeSession>;
}
