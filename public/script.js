let socket;
let player;
let selectedChoice;

function startGame() {
    player = document.getElementById('player-name').value.trim();
    if (player !== '') {
        document.getElementById('login-container').classList.add('hidden');
        document.getElementById('game-container').classList.remove('hidden');
        connectWebSocket();
    } else {
        alert('Por favor, digite seu nome.');
    }
}

function connectWebSocket() {
    socket = new WebSocket(`ws://${window.location.host}`);

    socket.addEventListener('open', () => {
        console.log('Conectado ao servidor WebSocket');
        socket.send(JSON.stringify({ type: 'login', data: player }));
    });

    socket.addEventListener('message', (event) => {
        const message = JSON.parse(event.data);
        handleServerMessage(message);
    });

    socket.addEventListener('close', () => {
        console.log('Conexão com o servidor WebSocket fechada');
    });

    socket.addEventListener('error', (error) => {
        console.error('Erro no WebSocket:', error);
    });
}

function handleServerMessage(message) {
    if (message.type === 'question') {
        displayQuestion(message.data);
    } else if (message.type === 'correct' || message.type === 'incorrect') {
        alert(message.data);
    } else if (message.type === 'score') {
        displayScore(message.data);
    } else if (message.type === 'leaderboard') {
        displayLeaderboard(message.data);
    } else if (message.type === 'end') {
        alert(message.data);
        endGame();
    }
}

function displayQuestion(question) {
    const questionContainer = document.getElementById('question-container');
    const choicesContainer = document.getElementById('choices-container');

    questionContainer.innerHTML = `<div class="question"><strong>Pergunta:</strong> ${question.question}</div>`;
    choicesContainer.innerHTML = '';

    question.choices.forEach((choice, index) => {
        const choiceElement = document.createElement('div');
        const choiceId = `choice${index}`;
        choiceElement.innerHTML = `<input type="radio" name="choices" id="${choiceId}" value="${choice}">
                                   <label for="${choiceId}">${choice}</label>`;
        choicesContainer.appendChild(choiceElement);
    });
}

function sendAnswer() {
    const selectedRadio = document.querySelector('input[name="choices"]:checked');
    if (selectedRadio) {
        questions = selectedRadio.value;
        socket.send(JSON.stringify({ type: 'answer', data: questions }));
    } else {
        alert('Por favor, selecione uma resposta.');
    }
}

function displayScore(score) {
    const scoreContainer = document.getElementById('score-container');
    scoreContainer.innerHTML = `<div class="score"><strong>Sua Pontuação:</strong> ${score}</div>`;
}

function displayLeaderboard(leaderboard) {
    const leaderboardContainer = document.getElementById('leaderboard');
    leaderboardContainer.innerHTML = '';
    leaderboard.forEach(player => {
        const playerElement = document.createElement('div');
        playerElement.innerHTML = `<strong>${player.name}:</strong> ${player.score}`;
        leaderboardContainer.appendChild(playerElement);
    });
}

function endGame() {
    document.getElementById('game-container').classList.add('hidden');
    document.getElementById('login-container').classList.remove('hidden');
}
