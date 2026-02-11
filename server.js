const PORT = process.env.PORT || 8081;
const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: PORT });
let players = [];

wss.on('connection', ws => {
    console.log("New player connected");

    ws.on('message', message => {
        // Broadcast message to all clients
        players.forEach(p => {
            if (p !== ws && p.readyState === WebSocket.OPEN) {
                p.send(message);
            }
        });
    });

    ws.on('close', () => {
        console.log("Player disconnected");
        players = players.filter(p => p !== ws);
    });

    players.push(ws);
});

console.log(`Server running on port ${PORT}`);
