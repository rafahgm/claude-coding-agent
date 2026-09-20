/**
 * ÚNICO arquivo que importa `@anthropic-ai/claude-agent-sdk` — ver
 * ARCHITECTURE.md § 5 e a regra de lint em eslint.config.js.
 *
 * O pacote é ESM-only (`"type": "module"`, `main: sdk.mjs`); a extensão é
 * CommonJS (VS Code carrega `main` via `require`). `import()` dinâmico é a
 * ponte padrão de CJS para um pacote ESM-only — os tipos continuam vindo de
 * um `import type`, que não gera `require` nenhum.
 */
import type { AgentRuntime, PermissionMode, RuntimeConfig, RuntimeEvent, RuntimeSession } from './AgentRuntime';
// prettier-ignore
import type { Options, Query, SDKMessage, SDKUserMessage, query as QueryFn } from '@anthropic-ai/claude-agent-sdk' with { 'resolution-mode': 'import' };

let queryFn: typeof QueryFn | undefined;

async function loadQuery(): Promise<typeof QueryFn> {
  if (!queryFn) {
    const sdk = await import('@anthropic-ai/claude-agent-sdk');
    queryFn = sdk.query;
  }
  return queryFn;
}

type QueueItem = { kind: 'message'; value: SDKUserMessage } | { kind: 'done' };

/**
 * Fila que alimenta o streaming input mode do SDK (`prompt: AsyncIterable<SDKUserMessage>`).
 * Streaming input é obrigatório para este produto — ver ARCHITECTURE.md § 3.
 */
class StreamingInput implements AsyncIterable<SDKUserMessage> {
  private readonly pending: QueueItem[] = [];
  private notify: (() => void) | null = null;

  send(text: string): void {
    this.enqueue({
      kind: 'message',
      value: {
        type: 'user',
        message: { role: 'user', content: text },
        parent_tool_use_id: null,
      },
    });
  }

  close(): void {
    this.enqueue({ kind: 'done' });
  }

  private enqueue(item: QueueItem): void {
    this.pending.push(item);
    const wake = this.notify;
    this.notify = null;
    wake?.();
  }

  async *[Symbol.asyncIterator](): AsyncIterator<SDKUserMessage> {
    for (;;) {
      const item = this.pending.shift();
      if (!item) {
        await new Promise<void>((resolve) => {
          this.notify = resolve;
        });
        continue;
      }
      if (item.kind === 'done') {
        return;
      }
      yield item.value;
    }
  }
}

async function* mapEvents(q: Query): AsyncGenerator<RuntimeEvent> {
  for await (const message of q as AsyncIterable<SDKMessage>) {
    switch (message.type) {
      case 'stream_event': {
        // BetaRawMessageStreamEvent — só o delta de texto interessa à UI hoje.
        const event = message.event as { type?: string; delta?: { type?: string; text?: string } };
        if (event.type === 'content_block_delta' && event.delta?.type === 'text_delta' && event.delta.text) {
          yield { type: 'text-delta', text: event.delta.text };
        }
        break;
      }
      case 'assistant': {
        for (const block of message.message.content) {
          if (block.type === 'tool_use') {
            yield { type: 'tool-use', name: block.name, input: block.input };
          }
        }
        break;
      }
      case 'result': {
        yield {
          type: 'result',
          costUsd: message.total_cost_usd,
          durationMs: message.duration_ms,
          isError: message.is_error,
        };
        break;
      }
      default:
        break;
    }
  }
}

export class SdkAgentRuntime implements AgentRuntime {
  async startup(): Promise<void> {
    // Carrega o módulo ESM antecipadamente para não pagar essa latência no
    // primeiro prompt. O subprocesso nativo em si só nasce na primeira
    // chamada a `query()`, dentro de `start()`.
    await loadQuery();
  }

  async start(config: RuntimeConfig): Promise<RuntimeSession> {
    const query = await loadQuery();
    const input = new StreamingInput();

    // `env`, quando definido, SUBSTITUI o ambiente do processo filho por
    // inteiro (não faz merge com process.env) — é aqui que o S6 chega:
    // CLAUDE_CODE_OAUTH_TOKEN precisa ir dentro deste objeto, junto do
    // resto de process.env, não só ser exportado no ambiente do Extension Host.
    const options: Options = {
      cwd: config.cwd,
      includePartialMessages: true,
      env: config.env ?? { ...process.env },
      ...(config.model ? { model: config.model } : {}),
    };

    const activeQuery: Query = query({ prompt: input, options });

    return {
      send: (text: string) => input.send(text),
      events: () => mapEvents(activeQuery),
      interrupt: async () => {
        await activeQuery.interrupt();
      },
      setPermissionMode: async (mode: PermissionMode) => {
        await activeQuery.setPermissionMode(mode);
      },
      dispose: async () => {
        input.close();
      },
    };
  }
}
