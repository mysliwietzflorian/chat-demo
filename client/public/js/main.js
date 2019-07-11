document.addEventListener("DOMContentLoaded", () => {
	const socket = io();

	const username = '#' + Math.floor(Math.random()*16777215)
		.toString(16);

	const TYPING_UPDATE_INTERVAL = 2000; // ms
	let isTyping = false;
	let lastTypingTime;

	let isTypingMessage = document.getElementById('is-typing-message');
	let textarea = document.getElementById('typing-area__input');
	textarea.value = '';

	socket.emit('user__connect', username);

	socket.on('user__connect', username => {
		console.log(`[INFO]  User connected with ${username}`);
	});

	socket.on('user__disconnect', username => {
		console.log(`[INFO]  User disconnected with ${username}`);
	});

	socket.on('user__typing-start', username => {
		isTypingMessage.innerHTML = `${username} is typing...`;
		isTypingMessage.classList.remove('hidden');
	});

	socket.on('user__typing-stop', () => {
		isTypingMessage.innerHTML = '';
		isTypingMessage.classList.add('hidden');
	});

	socket.on('chat-message', data => {
		addChatMessage(data.username, data.message, data.timestamp);
	});

	textarea.addEventListener('input', () => {
		if (!isTyping) {
			socket.emit('user__typing-start');
			isTyping = true;
		}
		lastTypingTime = (new Date()).getTime();

		setTimeout(() => {
			let currentTime = (new Date()).getTime();
			let diff = currentTime - lastTypingTime;
			if (diff >= TYPING_UPDATE_INTERVAL && isTyping) {
				socket.emit('user__typing-stop');
				isTyping = false;
			}
		}, TYPING_UPDATE_INTERVAL);
	});

	document.addEventListener('keypress', (event) => {
		if (!(event.ctrlKey || event.metaKey || event.altKey)) {
			textarea.focus();
		}

		if (event.keyCode === 13 && !(event.shiftKey || event.ctrlKey)) {
			event.preventDefault();
			submitMessage();
		}
	});

	let button = document.getElementById('typing-area__submit');
	button.addEventListener('click', submitMessage);

	function submitMessage() {
		socket.emit('user__typing-stop');
		isTyping = false;

		let message = textarea.value;
		textarea.value = '';

		dateTime = new Date();
		if (/\S/.test(message)) {
			addChatMessage(
				username,
				message,
				`${dateTime.getHours()}:${dateTime.getMinutes()}`,
				true
			);
			socket.emit('chat-message', message);
		}
	}

	function addChatMessage(name, message, timestamp, isSending = false) {
		let chat = document.getElementById('chat');

		let chatPostHtml = `
			<div class="chat__post d-flex">
		`;

		if (!isSending) {
			chatPostHtml += `
				<img class="chat__avatar chat__avatar"
					src="http://placehold.jp/50x50.png">
			`
		}

		chatPostHtml += `
				<div class="chat__body">
				<div class="d-flex">
				<div class="chat__username chat__username${isSending ? '--sending' : ''}">
					${name}
				</div>

				<div class="chat__timestamp">${timestamp}</div>

				</div>
					<div class="chat__message">${message}</div>
				</div>
		`;

		if (isSending)
		chatPostHtml += `
				<img class="chat__avatar chat__avatar--sending"
					src="http://placehold.jp/50x50.png">
		`;

		chatPostHtml += `
			</div>
		`;

		chat.innerHTML += chatPostHtml;
	}
});
