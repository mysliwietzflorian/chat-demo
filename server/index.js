let express = require('express');
let app = express();
let server = require('http').Server(app);
let io = require('socket.io')(server);

const PORT = 8080;

let usersTyping = [];

server.listen(PORT, () => {
	console.log(`[INFO]  Server listening on ${PORT}`);
});

app.use(express.static(`${__dirname}/../client/public`));

io.on('connection', socket => {
	socket.data = [];
	socket.data['isAuthenticated'] = false;

	console.log(`[INFO]  User connected`);

	socket.on('disconnect', () => {
		onUserStopsTyping();

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
		let username = socket.data['username'];
		if (username === undefined) {
			return;
		}

		usersTyping.push(username);
		socket.broadcast.emit('user__typing-start', username);
	});

	socket.on('user__typing-stop', onUserStopsTyping);

	socket.on('chat-message', message => {
		let username = socket.data['username'];

		console.log(`[INFO]  User ${username} sent message`);

		socket.broadcast.emit('chat-message', {
			'username': username,
			'message': message,
			'timestamp': new Date().toLocaleString("en-US")
		});
	});

	function onUserStopsTyping() {
		let username = socket.data['username'];
		if (usersTyping.includes(username)) {
			usersTyping.splice(
				usersTyping.indexOf(username), 1
			);
		}

		if (usersTyping.length === 0) {
			io.emit('user__typing-stop');
		}
	}
});
