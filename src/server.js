const express = require('express');
const http = require('http');
const path = require('path');
const fs = require('fs');
const { setupWebSocket } = require('./websocket');
const config = require('../config/config.json');

// Inicializa o aplicativo Express
const app = express();

// Configura o servidor HTTP
const server = http.createServer(app);

// Inicializa o WebSocket Server
setupWebSocket(server);

// Serve o arquivo HTML estático
app.use(express.static(path.join(__dirname, '../public')));

app.get('/questions', (req, res) => {
  fs.readFile(path.join(__dirname, '../config/questions.json'), 'utf8', (err, data) => {
    if (err) {
      console.error('Erro ao ler o arquivo questions.json:', err);
      res.status(500).send('Erro ao ler o arquivo de perguntas');
      return;
    }

    const questions = JSON.parse(data);
    res.json(questions);
  });
});

// Define a porta do servidor
const PORT = config.server.port || 3000;

// Inicia o servidor
server.listen(PORT, () => {
  console.log(`Servidor está rodando na porta ${PORT}`);
});
