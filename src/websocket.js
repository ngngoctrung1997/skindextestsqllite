const WebSocket = require('ws');
const db = require('./messageModel');

function websocketServer(server) {
    const wss = new WebSocket.Server({ server });

    wss.on('connection', function connection(ws) {
        console.log('Client connected');

        try {
            const stmt = db.prepare('SELECT username, content, timestamp FROM messages ORDER BY timestamp DESC LIMIT 50');
            const messages = stmt.all().reverse(); // send in chronological order
            ws.send(JSON.stringify({ type: 'history', data: messages }));
        } catch (err) {
            console.error('Failed to load message history:', err.message);
        }

        ws.on('message', function incoming(message) {
            try {
                const { username, content } = JSON.parse(message);

                // Save message to SQLite
                console.log(`Received message from ${username}: ${content}`);
                
                const insert = db.prepare('INSERT INTO messages (username, content) VALUES (?, ?)');
                insert.run(username, content);

                const broadcast = JSON.stringify({ type: 'new_message', data: { username, message: content } });

                wss.clients.forEach(function each(client) {
                    if (client.readyState === WebSocket.OPEN) {
                        client.send(broadcast);
                    }
                });
            } catch (err) {
                console.error('Invalid message format:', err.message);
            }
        });

        ws.on('close', () => {
            console.log('Client disconnected');
        });
    });

    return wss;
}

module.exports = websocketServer;