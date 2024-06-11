# Quiz com WebSocket

Este é um projeto de quiz que utiliza WebSocket e Express para fornecer um jogo de perguntas e respostas em tempo real. O jogo permite que jogadores entrem, respondam a perguntas de múltipla escolha e vejam suas pontuações em um leaderboard. 


## Configuração

### Pré-requisitos

- Node.js instalado (versão 14 ou superior)


git clone https://github.com/MariaCiciliti/p2.git
cd p2

### Instale as dependecias 
npm install express ws
npm install
## Inicia o servidor na porta 3000
npm start

## Uso
'Abra seu navegador e acesse http://localhost:3000.

Digite seu nome e clique em "Iniciar Quiz" para começar a jogar.

Responda as perguntas de múltipla escolha que aparecerão na tela.

Após responder todas as perguntas, sua pontuação será exibida.

A pontuação dos jogadores será exibida na seção "Pontuação dos Jogadores".

### Estrutura dos Arquivos
'public/index.html1
Este arquivo contém o código HTML para a interface do usuário.'

public/script.js
Este arquivo contém o código JavaScript que lida com a comunicação WebSocket e a lógica do cliente.

public/styles.css
Este arquivo contém os estilos CSS para a interface do usuário.

config/questions.json
Este arquivo contém as perguntas de múltipla escolha usadas no quiz.

server.js
Este arquivo contém o código do servidor que utiliza Express e WebSocket para fornecer as funcionalidades do quiz.

package.json
Este arquivo contém as dependências do projeto e informações sobre o projeto.'
