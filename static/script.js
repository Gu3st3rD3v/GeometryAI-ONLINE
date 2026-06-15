const chatContainer = document.getElementById('chat-container');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
const reasoningToggle = document.getElementById('reasoning-toggle');

async function enviarMensagem() {
    const texto = userInput.value.trim();
    if (!texto) return;

    // Captura o estado em tempo real do Modo Raciocínio (true ou false)
    const modoRaciocinio = reasoningToggle.checked;

    // 1. Adiciona sua mensagem na tela
    adicionarMensagem(texto, 'user');
    userInput.value = '';

    // 2. Cria um balão dinâmico com base no estado selecionado
    let statusTexto = modoRaciocinio ? "Calculando matriz de dados... Pensando..." : "Digitando...";
    const botMsgDiv = adicionarMensagem(statusTexto, 'bot');

    try {
        // 3. Faz a chamada para o seu servidor enviando ambos os dados estruturados
        const response = await fetch('/perguntar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                pergunta: texto,
                raciocinio: modoRaciocinio // repassando o booleano ao backend
            })
        });

        const data = await response.json();
        
        // 4. Substitui o estado de carregamento e aplica rótulo especial se o modo complexo estiver on
        if (modoRaciocinio) {
            botMsgDiv.innerHTML = `<div class="thinking-meta">⚡ Resposta Analítica Gerada:</div>${data.resposta}`;
        } else {
            botMsgDiv.innerText = data.resposta;
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
    
    // Rola para o final do chat
    chatContainer.scrollTop = chatContainer.scrollHeight;
    return div;
}

// Ouvintes de eventos originais preservados
sendBtn.addEventListener('click', enviarMensagem);
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') enviarMensagem();
});
