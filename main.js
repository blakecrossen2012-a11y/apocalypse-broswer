const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const ws = new WebSocket(`wss://${window.location.host}`); // Use secure WS on Render

const chatDiv = document.getElementById('chat');
const input = document.getElementById('input');

ws.onopen = () => log('Connected to server!');
ws.onmessage = e => log(`Received: ${e.data}`);
ws.onclose = () => log('Disconnected from server');

input.addEventListener('keydown', e => {
    if (e.key === 'Enter' && input.value.trim() !== '') {
        const msg = input.value;
        ws.send(msg);
        input.value = '';
    }
});

function log(msg) {
    const div = document.createElement('div');
    div.textContent = msg;
    chatDiv.appendChild(div);
    chatDiv.scrollTop = chatDiv.scrollHeight;
}

// Simple test render loop
function gameLoop() {
    ctx.fillStyle = '#7ec850';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    requestAnimationFrame(gameLoop);
}

gameLoop();





