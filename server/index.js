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
	socket.data = [];
	socket.data['isAuthenticated'] = false;

	console.log(`[INFO]  User connected`);

	socket.on('disconnect', () => {
		console.log(`[INFO]  User disconnected`);
		socket.broadcast.emit('user__disconnect', socket.data['username']);
	});

	socket.on('user__connect', username => {
		if (socket.data['isAuthenticated']) {
			return;
		}

		socket.data['isAuthenticated'] = true;
		socket.data['username'] = username;
		console.log(`[INFO]  User authenticated with ${username}`);
		socket.broadcast.emit('user__connect', username);
	});

	socket.on('user__typing-start', () => {
		socket.broadcast.emit('user__typing-start', socket.data['username']);
	});

	socket.on('user__typing-stop', () => {
		socket.broadcast.emit('user__typing-stop', socket.data['username']);
	});

	socket.on('chat-message', message => {
		console.log(`[INFO]  User ${socket.data['username']} sent message`);

		socket.broadcast.emit('chat-message', {
			'username': socket.data['username'],
			'message': message,
			'timestamp': new Date().toLocaleString("en-US")
		});
	});
});
