// server.js
const http = require('http');
const WebSocket = require('ws');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 8081;

// Serve static files
const server = http.createServer((req, res) => {
    let filePath = '.' + req.url;
    if (filePath === './') filePath = './index.html';

    const extname = String(path.extname(filePath)).toLowerCase();
    const mimeTypes = {
        '.html': 'text/html',
        '.js': 'application/javascript',
        '.css': 'text/css',
        '.ico': 'image/x-icon',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
    };

    const contentType = mimeTypes[extname] || 'application/octet-stream';

    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code === 'ENOENT') res.writeHead(404), res.end('Not found');
            else res.writeHead(500), res.end('Server Error: ' + error.code);
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

// WebSocket server
const wss = new WebSocket.Server({ server });
const players = new Map(); // track players

wss.on('connection', ws => {
    console.log('Player connected');
    ws.id = Math.random().toString(36).substr(2, 9);
    players.set(ws.id, { x:0, y:0, z:0, name:`Player_${ws.id}` });

    // Send initial player ID
    ws.send(JSON.stringify({ type:'init', id: ws.id, players: Array.from(players) }));

    ws.on('message', msg => {
        try {
            const data = JSON.parse(msg);

            // Update player position or action
            if(data.type === 'update') players.set(ws.id, data.player);

            // Broadcast to all other players
            wss.clients.forEach(client => {
                if(client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({ type:'update', id: ws.id, player: players.get(ws.id) }));
                }
            });

        } catch(e) {
            console.error('Invalid message', e);
        }
    });

    ws.on('close', () => {
        console.log('Player disconnected');
        players.delete(ws.id);
        // Notify others
        wss.clients.forEach(client => {
            if(client.readyState === WebSocket.OPEN) client.send(JSON.stringify({ type:'remove', id: ws.id }));
        });
    });
});

server.listen(PORT, ()=>console.log(`Server running on port ${PORT}`));

