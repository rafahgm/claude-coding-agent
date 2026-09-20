import * as vscode from 'vscode';
import { SdkAgentRuntime } from './runtime/SdkAgentRuntime';

export function activate(context: vscode.ExtensionContext): void {
  const runtime = new SdkAgentRuntime();

  context.subscriptions.push(
    vscode.commands.registerCommand('claudeCodingAgent.openChat', () => {
      const panel = vscode.window.createWebviewPanel(
        'claudeCodingAgentChat',
        'Claude Coding Agent',
        vscode.ViewColumn.Beside,
        { enableScripts: true },
      );
      panel.webview.html = renderPlaceholder();
    }),
  );

  void runtime.startup();
}

export function deactivate(): void {
  // Nada a limpar ainda: sessões vivem em ChatController, que ainda não existe.
}

function renderPlaceholder(): string {
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="UTF-8"></head>
<body>
  <h1>Claude Coding Agent</h1>
  <p>Scaffold inicial — o painel de chat real chega no ChatController (ROADMAP v0.1).</p>
</body>
</html>`;
}
