let socket = io();

function sendMessage() {
	console.info('Implement send-message');
}

function addPost(name, message) {
	let chat = document.getElementById('chat');

	let post = document.createElement('div');
	post.className = "chat__post d-flex";

	let img = document.createElement('img');
	img.className = 'chat__avatar';
	img.src = 'http://placehold.jp/50x50.png';
	post.appendChild(img);

	let chatBody = document.createElement('div');
	chatBody.className = 'chat__body';
	post.appendChild(chatBody);

	let row = document.createElement('div');
	row.className = 'd-flex';
	chatBody.appendChild(row);

	let chatUsername = document.createElement('div');
	chatUsername.className = 'chat__username';
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
