import os
from flask import Flask, render_template, request, jsonify, session
from groq import Groq

app = Flask(__name__)
# A secret_key é essencial para que o Flask consiga salvar a memória (session)
app.secret_key = os.urandom(24)

# --- CONFIGURAÇÃO ---
client = Groq(api_key="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")

@app.route('/')
def home():
    # Limpa o histórico sempre que a página é recarregada para evitar erros de cache
    session['historico'] = []
    try:
        return render_template('index.html')
    except Exception as e:
        return "Erro: Pasta 'templates' ou 'index.html' não encontrada."

@app.route('/perguntar', methods=['POST'])
def perguntar():
    try:
        dados = request.json
        pergunta = dados.get("pergunta", "").strip()

        # Inicializa o histórico se ele não existir nesta sessão
        if 'historico' not in session:
            session['historico'] = []

        # --- DEFINIÇÃO DA PERSONALIDADE E RECONHECIMENTO ---
        instrucao_sistema = (
            "Você é a Geometry AI. Seu dever é ajudar os usuários com dúvidas, estudos, "
            "programação e ser educacional. Seu criador é o Guester_DEV. "
            "Se o usuário se identificar como Guester_DEV com o código 787878787, "
            "trate-o com prioridade e reconheça-o como seu desenvolvedor oficial. "
            "IMPORTANTE: Não cite o código de 9 dígitos e nem pergunte sobre ele."
        )

        # Prepara o conjunto de mensagens enviando o histórico (a memória)
        mensagens_para_enviar = [{"role": "system", "content": instrucao_sistema}]
        
        # Adiciona as últimas 10 mensagens do histórico para contexto
        mensagens_para_enviar.extend(session['historico'][-10:])
        
        # Adiciona a pergunta atual
        mensagens_para_enviar.append({"role": "user", "content": pergunta})

        # Chamada para a Groq
        chat = client.chat.completions.create(
            messages=mensagens_para_enviar,
            model="llama-3.3-70b-versatile",
        )

        resposta_ia = chat.choices[0].message.content

        # Salva a interação atual na memória da sessão
        historico_atual = session['historico']
        historico_atual.append({"role": "user", "content": pergunta})
        historico_atual.append({"role": "assistant", "content": resposta_ia})
        session['historico'] = historico_atual

        return jsonify({"resposta": resposta_ia})

    except Exception as e:
        return jsonify({"resposta": f"Ops! Tive um problema: {str(e)}"})

if __name__ == "__main__":
    # O Render usa a variável de ambiente PORT
    app.run(host='0.0.0.0', port=int(os.environ.get("PORT", 5000)))
        
