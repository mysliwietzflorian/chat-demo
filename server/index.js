let express = require('express');
let app = express();
let server = require('http').Server(app);
let io = require('socket.io')(server);

const PORT = 8080;

server.listen(PORT, () => {
	console.log(`[INFO]  Server listening on ${PORT}`);
});

app.use(express.static(`${__dirname}/../client/public`));

io.on('connection', socket => {
	console.log(`[INFO]  User connected`);

	socket.on('disconnect', () => {
		console.log(`[INFO]  User disconnected`);
	});
});
