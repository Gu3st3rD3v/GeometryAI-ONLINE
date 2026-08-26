# Qual o objetivo do projeto?
O objetivo do meu projeto é ter uma AI (inteligência artificial) própria, na qual ela responde qualquer pergunta desde que esteja na internet. Ela funciona a partir de uma API ( Application Programming Interface), Uma API é um conjunto de regras, protocolos e ferramentas que define como diferentes sistemas ou aplicações podem interagir entre si, funcionando como uma ponte que facilita a troca de dados e o uso de funcionalidades sem precisar reconstruir tudo do zero. Ela atua como um intermediário: um software (cliente) envia uma solicitação e outro software (servidor) responde com os dados ou executa a ação solicitada. Eu uso a API do Groq Cloud para a minha inteligência artificial funcionar, (sem uma API ela não funciona). O site foi desenvolvido em HTML + CSS, Python (usando o flask para inicializar o site) e JavaScript para troca de informações entre o backend e o frontend. No site foi usado a hospedagem do Render para deixar o site ativo e esse repositório do github para carregar os arquivos do site.

# Inspirações:
Bem minhas principais inspirações foram os chats bots inteligentes, como o chat gpt, gemini, groq, claude e outras AI´s, mas também uma das minhas principais motivações foi eu mesmo, pois senti a necessidade de criar algo criativo e complexo completamente sozinho, isso foi meio que um desafio para mim mesmo, demorei 3 dias inteiros para criar um sistema completamente funcional. (Lembrando eu criei essa AI com o objetivo educacional, ou seja meu objetivo não é competir com o mercado de AI´S).

# Funções
A Geometry AI consegue te ajudar a programar, (sites, jogos, projetos com arduino e etc), ela consegue gerar texto, ela consegue te ajudar pesquisando qualquer coisa que esteja na internet, ela consegue te ajudar com coisas do seu dia a dia, ela consegue te ajudar com equações matemáticas, ela consegue te ajudar com atividades escolares e dentre outras coisas. LEMBRETE IMPORTANTE: A GEOMETRY AI NÃO É HUMANA, ELA PODE ERRAR INFORMAÇÕES, NÃO CONFIE 100% NELA.  

# Como a AI Funciona?
O funcionamento segue o fluxo "Client-Server" (Cliente-Servidor):
1. Interface (Frontend): O usuário digita uma mensagem no campo de texto do index.html.
2. Envio (JavaScript): O arquivo script.js captura esse texto e envia uma requisição assíncrona (usando fetch) para o servidor Python.
3. Processamento (Backend): O servidor Flask (app. py) recebe a pergunta, processa a lógica de resposta (que utiliza a API Groq para retornar a informação para o usuario) e devolve um objeto JSON. O JavaScript recebe esse JSON e cria dinamicamente um novo "balão de fala" no chat para exibir a resposta da assistente.

# PARA UTILIZAR BASTA VOCê CLICAR NO LINK ABAIXO:
https://geometryaiweb.onrender.com/
