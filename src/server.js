const http = require('http');
const express = require('express');
const { PORT } = require('./config');
const websocketServer = require('./websocket');

const app = express();
const server = http.createServer(app);
websocketServer(server);

app.get('/', (req, res) => {
    res.send('WebSocket Chat Server is running');
});

server.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});