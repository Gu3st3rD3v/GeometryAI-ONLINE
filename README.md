# Qual o objetivo do projeto?
O objetivo do meu projeto é ter uma AI (inteligência artificial) própria, na qual ela responde qualquer pergunta desde que esteja na internet. Ela funciona a partir de uma API ( Application Programming Interface), Uma API é um conjunto de regras, protocolos e ferramentas que define como diferentes sistemas ou aplicações podem interagir entre si, funcionando como uma ponte que facilita a troca de dados e o uso de funcionalidades sem precisar reconstruir tudo do zero. Ela atua como um intermediário: um software (cliente) envia uma solicitação e outro software (servidor) responde com os dados ou executa a ação solicitada. Eu uso a API do Groq Cloud para a minha inteligência artificial funcionar, (sem uma API ela não funciona). O site foi desenvolvido em HTML + CSS, Python (usando o flask para inicializar o site) e JavaScript para troca de informações entre o backend e o frontend. No site foi usado a hospedagem do Render para deixar o site ativo e esse repositório do github para carregar os arquivos do site.

# Como a AI Funciona?

O funcionamento segue o fluxo "Client-Server" (Cliente-Servidor):

1. Interface (Frontend): O usuário digita uma mensagem no campo de texto do index.html.

2. Envio (JavaScript): O arquivo script. js captura esse texto e envia uma requisição assíncrona (usando fetch) para o servidor Python.

3. Processamento (Backend): O servidor Flask (app. py) recebe a pergunta, processa a lógica de resposta (que utiliza a API Groq para retornar a informação para o usuario) e devolve um objeto JSON. O JavaScript recebe esse JSON e cria dinamicamente um novo "balão de fala" no chat para exibir a resposta da assistente.

Para você utilizar basta acessar o site fixado.
