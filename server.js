const PORT = process.env.PORT || 8081;
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: PORT });

console.log(`Server running on port ${PORT}`);

let players = {};

wss.on('connection', ws => {
  const id = Date.now();
  players[id] = {id, x:0, y:0, z:0, ws};
  console.log("Player connected:", id);

  ws.on('message', msg=>{
    // Broadcast to all
    for(let pid in players){
      if(players[pid].ws.readyState === WebSocket.OPEN) players[pid].ws.send(msg.toString());
    }
  });

  ws.on('close', ()=>{
    console.log("Player disconnected:", id);
    delete players[id];
  });

  ws.send(JSON.stringify({type:'welcome',id}));
});
