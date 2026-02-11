const WebSocket = require('ws');
const PORT = process.env.PORT || 8081;

const ws = new WebSocket("wss://apocalypse-broswer.onrender.com");


wss.on('connection', ws => {
    console.log('Player connected');
    ws.on('message', msg => {
        console.log('Received:', msg);
        // Broadcast to all
        wss.clients.forEach(client => {
            if(client !== ws && client.readyState === WebSocket.OPEN) client.send(msg);
        });
    });
    ws.on('close', () => console.log('Player disconnected'));
});

console.log(`WebSocket server running on port ${PORT}`);


