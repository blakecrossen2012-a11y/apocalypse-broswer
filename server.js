const http = require("http");
const fs = require("fs");
const path = require("path");
const WebSocket = require("ws");

const PORT = process.env.PORT || 8080;

// Serve static files
const server = http.createServer((req, res) => {
  let filePath = "." + req.url;
  if (filePath === "./") filePath = "./index.html";

  const ext = path.extname(filePath);
  const contentType =
    ext === ".html" ? "text/html" :
    ext === ".js" ? "application/javascript" :
    ext === ".css" ? "text/css" :
    ext === ".png" ? "image/png" :
    ext === ".jpg" ? "image/jpeg" :
    "text/plain";

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(404);
      res.end("Not found");
    } else {
      res.writeHead(200, { "Content-Type": contentType });
      res.end(content);
    }
  });
});

// Attach WebSocket to same server
const wss = new WebSocket.Server({ server });

wss.on("connection", (ws) => {
  console.log("Player connected");

  ws.on("message", (message) => {
    // Broadcast to all players
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message.toString());
      }
    });
  });

  ws.on("close", () => {
    console.log("Player disconnected");
  });
});

server.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
