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
socket.on('message', data => {
  console.log(data);
  msgList.scrollTop = msgList.scrollHeight;
});

// fetch data from database

fetch('/chats')
  .then(data => {
    return data.json();
  })
  .then(json => {
    console.log(json);
    json.map(data => {
      const liMsg = document.createElement('li');
      const stringTime = data.date;
      const objectTime = new Date(stringTime);
      const timeFormat = objectTime.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });

      liMsg.innerHTML = `
      <p style="margin: 0px; font-weight: bold;">${data.sender}  <span>${timeFormat}</span></p>
          <p style="margin: 0px;">${data.message}</p>
          <hr>
      `;
      document.getElementById('message-container').appendChild(liMsg);
    })
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

