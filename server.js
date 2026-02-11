const express = require("express");
const http = require("http");
const WebSocket = require("ws");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const PORT = process.env.PORT || 8080;

// Serve project files
app.use(express.static(__dirname));

// Serve node_modules so Three.js loads
app.use("/node_modules", express.static("node_modules"));

wss.on("connection", (ws) => {
  console.log("Player connected");
});

server.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
