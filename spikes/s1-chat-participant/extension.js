// Spike descartável — ver README.md nesta pasta e ROADMAP.md § v0.0, S1.
// Sem build: CommonJS puro, carregado direto pelo Extension Host.
const vscode = require('vscode');

/** @param {vscode.ExtensionContext} context */
function activate(context) {
  const handler = async (request, _chatContext, stream) => {
    stream.markdown(
      `Spike S1 respondeu. Isso confirma que o participante ativou e recebeu o prompt: "${request.prompt}".`,
    );
  };

  const participant = vscode.chat.createChatParticipant('s1Spike.agent', handler);
  context.subscriptions.push(participant);
}

function deactivate() {}

module.exports = { activate, deactivate };
