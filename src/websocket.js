const WebSocket = require('ws');
const fs = require('fs');
const path = require('path');

const questionsFilePath = path.join(__dirname, '../config/questions.json');
const questions = JSON.parse(fs.readFileSync(questionsFilePath, 'utf8')).questions;

let players = {};

function setupWebSocket(server) {
  const wss = new WebSocket.Server({ server });

  wss.on('connection', (ws) => {
    console.log('Novo cliente conectado!');

    ws.on('message', (message) => {
      const parsedMessage = JSON.parse(message);

      if (parsedMessage.type === 'login') {
        handleLogin(ws, parsedMessage.data);
      } else {
        const playerId = ws.playerId;
        handleClientMessage(playerId, parsedMessage);
      }
    });

    ws.on('close', () => {
      console.log('Cliente desconectado');
      const playerId = ws.playerId;
      if (playerId) {
        delete players[playerId];
        broadcastLeaderboard();
      }
    });
  });
}

function handleLogin(ws, playerName) {
  const playerId = Date.now();
  ws.playerId = playerId;
  players[playerId] = { name: playerName, score: 0, ws: ws, currentQuestionIndex: 0 };

  sendQuestion(playerId);

  broadcastLeaderboard();
}

function sendQuestion(playerId) {
  const player = players[playerId];
  const questionIndex = player.currentQuestionIndex;

  if (questionIndex < questions.length) {
    const question = questions[questionIndex];
    player.ws.send(JSON.stringify({ type: 'question', data: question }));
  } else {
    player.ws.send(JSON.stringify({ type: 'end', data: 'Você completou o quiz!' }));
    broadcastLeaderboard();
  }
}

function handleClientMessage(playerId, message) {
  if (message.type === 'answer') {
    const player = players[playerId];
    const currentQuestion = questions[player.currentQuestionIndex];

    // Verifica se a resposta está correta
    if (message.data.trim().toLowerCase() === currentQuestion.answer.trim().toLowerCase()) {
      player.score += 1;
      player.ws.send(JSON.stringify({ type: 'correct', data: 'Resposta correta!' }));
    } else {
      player.ws.send(JSON.stringify({ type: 'incorrect', data: 'Resposta incorreta!' }));
    }

    // Atualiza a pontuação
    player.ws.send(JSON.stringify({ type: 'score', data: player.score }));

    // Atualiza o índice da pergunta
    player.currentQuestionIndex += 1;

    // Envia a próxima pergunta ou finaliza o quiz
    if (player.currentQuestionIndex < questions.length) {
      sendQuestion(playerId);
    } else {
      player.ws.send(JSON.stringify({ type: 'end', data: 'Você completou o quiz!' }));
      broadcastLeaderboard();
    }
  }
}

function broadcastLeaderboard() {
  const leaderboard = Object.values(players)
    .map(player => ({ name: player.name, score: player.score }))
    .sort((a, b) => b.score - a.score);

  Object.values(players).forEach(player => {
    player.ws.send(JSON.stringify({ type: 'leaderboard', data: leaderboard }));
  });
}

module.exports = { setupWebSocket };
