# Geometry AI.
Uma AI que usa da API Groq para ele funcionar, sem essa API ele não funciona. (USO LIVRE)

Este é um projeto de uma AI básica desenvolvida para rodar na web. Essa aplicação utiliza Python (Flask) no backend e uma interface moderna construída com HTML5, CSS3 e JavaScript (ES6), juntamente com a API Groq.

# Como a AI Funciona?

O funcionamento segue o fluxo "Client-Server" (Cliente-Servidor):

1. Interface (Frontend): O usuário digita uma mensagem no campo de texto do index.html.

2. Envio (JavaScript): O arquivo script. js captura esse texto e envia uma requisição assíncrona (usando fetch) para o servidor Python.

3. Processamento (Backend): O servidor Flask (app. py) recebe a pergunta, processa a lógica de resposta (que utiliza a API Groq para retornar a informação para o usuario) e devolve um objeto JSON. O JavaScript recebe esse JSON e cria dinamicamente um novo "balão de fala" no chat para exibir a resposta da assistente.

Para você utilizar basta acessar o site fixado.
