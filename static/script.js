const chatContainer = document.getElementById('chat-container');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
const reasoningToggle = document.getElementById('reasoning-toggle');
const auroraInteractive = document.getElementById('aurora-interactive');

/* ==================================================
   1. SEGUNDA AURORA (CONTROLE POR MOUSE OU DEDO)
   ================================================== */
function atualizarAuroraInterativa(x, y) {
    if (!auroraInteractive) return;
    auroraInteractive.style.left = `${x}px`;
    auroraInteractive.style.top = `${y}px`;
    auroraInteractive.classList.add('active');
}

window.addEventListener('pointermove', (e) => {
    atualizarAuroraInterativa(e.clientX, e.clientY);
});

window.addEventListener('touchmove', (e) => {
    if (e.touches.length > 0) {
        atualizarAuroraInterativa(e.touches[0].clientX, e.touches[0].clientY);
    }
}, { passive: true });

/* ==================================================
   2. TOUCH SLIDE NAS LETRAS (MOBILE)
   ================================================== */
document.addEventListener('touchmove', (e) => {
    const touch = e.touches[0];
    const target = document.elementFromPoint(touch.clientX, touch.clientY);
    if (target && target.classList.contains('interactive-char')) {
        target.classList.add('touch-active');
        setTimeout(() => target.classList.remove('touch-active'), 400);
    }
}, { passive: true });

/* ==================================================
   3. ENVOLVER TEXTO EM LETRAS INTERATIVAS
   ================================================== */
function envolverLetrasEmSpans(container, ocultarIniciais = false) {
    const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT, null, false);
    const nosDeTexto = [];
    let no;

    while (no = walker.nextNode()) {
        if (no.parentElement.closest('svg, button, .code-header')) continue;
        nosDeTexto.push(no);
    }

    nosDeTexto.forEach(textNode => {
        const texto = textNode.nodeValue;
        if (!texto) return;

        const fragment = document.createDocumentFragment();
        for (let char of texto) {
            const span = document.createElement('span');
            span.className = 'interactive-char';
            if (ocultarIniciais) {
                span.classList.add('char-hidden');
            }
            span.textContent = char;
            fragment.appendChild(span);
        }
        textNode.parentNode.replaceChild(fragment, textNode);
    });
}

/* ==================================================
   4. EFEITO DIGITAÇÃO ULTRA-RÁPIDO (8X MAIS RÁPIDO)
   ================================================== */
function digitarMensagem(container, velocidade = 2) {
    const letras = container.querySelectorAll('.interactive-char.char-hidden');
    let i = 0;
    const lote = 4; // Processa 4 letras por ciclo para atingir velocidade 8x sem trava do navegador

    function proximaLetra() {
        if (i < letras.length) {
            for (let j = 0; j < lote && i < letras.length; j++, i++) {
                letras[i].classList.remove('char-hidden');
                letras[i].classList.add('char-appear');
            }

            const distancerDoFim = chatContainer.scrollHeight - chatContainer.scrollTop - chatContainer.clientHeight;
            if (distancerDoFim < 100) {
                chatContainer.scrollTop = chatContainer.scrollHeight;
            }

            setTimeout(proximaLetra, velocidade);
        }
    }
    proximaLetra();
}

/* ==================================================
   5. ESCAPAR HTML & FORMATAR MARKDOWN
   ================================================== */
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

/* ==================================================
   6. ENVIO E GERENCIAMENTO DE MENSAGENS
   ================================================== */
async function enviarMensagem() {
    const texto = userInput.value.trim();
    if (!texto) return;

    const modoRaciocinio = reasoningToggle.checked;

    adicionarMensagem(texto, 'user');
    userInput.value = '';

    let statusTexto = modoRaciocinio ? "Calculando matriz de dados... Pensando..." : "Digitando...";
    const botMsgDiv = adicionarMensagem(statusTexto, 'bot', true);

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

        envolverLetrasEmSpans(botMsgDiv, true);
        digitarMensagem(botMsgDiv);

    } catch (error) {
        botMsgDiv.innerText = "Ops, tive um problema para me conectar ao servidor.";
        envolverLetrasEmSpans(botMsgDiv, false);
        console.error("Erro:", error);
    }
}

function adicionarMensagem(texto, tipo, animarDigitacao = false) {
    const div = document.createElement('div');
    div.classList.add('message', tipo);
    div.innerText = texto;
    chatContainer.appendChild(div);
    
    envolverLetrasEmSpans(div, animarDigitacao);
    
    if (animarDigitacao) {
        digitarMensagem(div);
    } else {
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }

    return div;
}

document.addEventListener('DOMContentLoaded', () => {
    const primeiraMensagem = document.querySelector('.message.bot');
    if (primeiraMensagem) {
        envolverLetrasEmSpans(primeiraMensagem, false);
    }
});

sendBtn.addEventListener('click', enviarMensagem);
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') enviarMensagem();
});
