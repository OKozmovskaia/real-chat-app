const chatForm = document.getElementById('chat-form');
const msgList = document.getElementById('message-container');
const userList = document.getElementById('users');

// Get username
const { username } = Qs.parse(location.search, {
  ignoreQueryPrefix: true
});

const socket = io();

// Join user to chat
socket.emit('joinUser', { username });

// Message from server
socket.on('message', message => {
  console.log(message);
  outputMessage(message);

  // scroll down in message field
  msgList.scrollTop = msgList.scrollHeight;
});

chatForm.addEventListener('submit', (e) => {
  e.preventDefault();

  // get massage from form
  const form = e.target;
  const formData = new FormData(form);
  const msg = Object.fromEntries(formData.entries());
  const msgText = msg.text;

  // emitting massage
  socket.emit('chatMessage', msgText);

  // clear input
  e.target.elements[0].value = '';
  e.target.elements[0].focus();
});

// Output message to DOM
function outputMessage(message) {
  const liMsg = document.createElement('li');
  liMsg.innerHTML = `
  <p style="margin: 0px; font-weight: bold;">${message. username}  <span>${message.time}</span></p>
      <p style="margin: 0px;">${message.text}</p>
      <hr>
  `;
  document.getElementById('message-container').appendChild(liMsg);
};

