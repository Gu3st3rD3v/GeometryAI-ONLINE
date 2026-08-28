const chatContainer = document.getElementById('chat-container');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
const reasoningToggle = document.getElementById('reasoning-toggle');

function escapeHtml(str) {
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function formatarMarkdown(texto) {
    if (!texto) return '';

    let blocosCodigo = [];

    texto = texto.replace(/```(\w*)\n?([\s\S]*?)```/g, function(match, lang, code) {
        const linguagem = lang ? lang.toUpperCase() : 'CÓDIGO';
        const codigoEscapado = escapeHtml(code.trim());
        const placeholder = `___CODE_BLOCK_${blocosCodigo.length}___`;
        
        blocosCodigo.push(`
            <div class="code-container">
                <div class="code-header">
                    <span class="code-lang">${linguagem}</span>
                    <button class="copy-btn" onclick="copiarCodigo(this)">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                        Copiar
                    </button>
                </div>
                <pre><code>${codigoEscapado}</code></pre>
            </div>
        `);
        return placeholder;
    });

    texto = texto.replace(/`([^`]+)`/g, function(match, code) {
        return `<code class="inline-code">${escapeHtml(code)}</code>`;
    });

    texto = texto.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    texto = texto.replace(/\*(.*?)\*/g, '<em>$1</em>');

    texto = texto.replace(/\n/g, '<br>');

    blocosCodigo.forEach((bloco, index) => {
        texto = texto.replace(`___CODE_BLOCK_${index}___`, bloco);
    });

    return texto;
}

window.copiarCodigo = function(btn) {
    const container = btn.closest('.code-container');
    const codeText = container.querySelector('code').innerText;

    navigator.clipboard.writeText(codeText).then(() => {
        const originalHTML = btn.innerHTML;
        btn.innerHTML = '✔ Copiado!';
        btn.classList.add('copied');
        
        setTimeout(() => {
            btn.innerHTML = originalHTML;
            btn.classList.remove('copied');
        }, 2000);
    }).catch(err => {
        console.error('Erro ao copiar código: ', err);
    });
};

async function enviarMensagem() {
    const texto = userInput.value.trim();
    if (!texto) return;

    const modoRaciocinio = reasoningToggle.checked;

    adicionarMensagem(texto, 'user');
    userInput.value = '';

    let statusTexto = modoRaciocinio ? "Calculando matriz de dados... Pensando..." : "Digitando...";
    const botMsgDiv = adicionarMensagem(statusTexto, 'bot');

    try {
        const response = await fetch('/perguntar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                pergunta: texto,
                raciocinio: modoRaciocinio 
            })
        });

        const data = await response.json();
        const respostaFormatada = formatarMarkdown(data.resposta);

        if (modoRaciocinio) {
            botMsgDiv.innerHTML = `<div class="thinking-meta">⚡ Resposta Analítica Gerada:</div>${respostaFormatada}`;
        } else {
            botMsgDiv.innerHTML = respostaFormatada;
        }

    } catch (error) {
        botMsgDiv.innerText = "Ops, tive um problema para me conectar ao servidor.";
        console.error("Erro:", error);
    }
}

function adicionarMensagem(texto, tipo) {
    const div = document.createElement('div');
    div.classList.add('message', tipo);
    div.innerText = texto;
    chatContainer.appendChild(div);
    
    chatContainer.scrollTop = chatContainer.scrollHeight;
    return div;
}

sendBtn.addEventListener('click', enviarMensagem);
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') enviarMensagem();
});
