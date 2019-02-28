document.addEventListener("DOMContentLoaded", (event) => {
	const socket = io();

	const username = '#' + Math.floor(Math.random()*16777215)
		.toString(16);

	socket.emit('user-connect', username);

	socket.on('user-connect', username => {
		console.log(`[INFO]  User connected with ${username}`);
	});

	let button = document.getElementById('typing-area__submit');
	button.addEventListener('click', () => {
		let textarea = document.getElementById('typing-area__input');
		let message = textarea.value;

		if (/\S/.test(message)) {
			textarea.value = '';
			addChatMessage(username, message, true);
			socket.emit('chat-message', message);
		}
	});

	function addChatMessage(name, message, isSending = false) {
		let chat = document.getElementById('chat');

		let post = document.createElement('div');
		post.className = "chat__post d-flex";

		let img = document.createElement('img');
		img.className = 'chat__avatar';
		img.src = 'http://placehold.jp/50x50.png';
		if (isSending) {
			img.className += ' chat__avatar--sending';
		} else {
			post.appendChild(img);
		}

		let chatBody = document.createElement('div');
		chatBody.className = 'chat__body';
		post.appendChild(chatBody);

		if (isSending) {
			post.appendChild(img);
		}

		let row = document.createElement('div');
		row.className = 'd-flex';
		chatBody.appendChild(row);

		let chatUsername = document.createElement('div');
		chatUsername.className = 'chat__username';
		if (isSending) {
			chatUsername.className += ' chat__username--sending';
		}
		chatUsername.innerHTML = name || 'Username';
		row.appendChild(chatUsername);

		let chatTimestamp = document.createElement('div');
		chatTimestamp.className = 'chat__timestamp';
		chatTimestamp.innerHTML = '08:49 AM';
		row.appendChild(chatTimestamp);

		let chatMessage = document.createElement('div');
		chatMessage.className = 'chat__message';
		chatMessage.innerHTML = message || 'This is a short message.';
		chatBody.appendChild(chatMessage);

		chat.appendChild(post);
	}
});
