// define modules for app
const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const { userJoin, getCurrentUser, userLeave } = require('./utils/users');
const  Chat  = require("./db/chatSchema");
const  connect  = require("./db/dbconnection");
const  chatRouter  = require("./db/chatRoutes");

// init app
const app = express();
// init server
const server = http.createServer(app);
const io = socketio(server);

//routes
app.use("/chats", chatRouter);

// client connects
io.on('connection', socket => {
  // get user
  socket.on('joinUser', ({username}) => {
      const user = userJoin(socket.id, username);
      
      // Welcome user
      socket.emit('message', formatMessage('Admin', 'Welcome to Chat!'));

      // broadcast when user connects
      socket.broadcast.emit('message', formatMessage('Admin', `${user.username} has joined the chat`));

      // listen for chatMessage
      socket.on('chatMessage', msg => {
        const user = getCurrentUser(socket.id);
        io.emit('message', formatMessage(user.username, msg));

        // save chat to the database
        connect.then(db => {
          console.log("connected correctly to the DataBase");

          let chatMessageForDB = new Chat({message: msg, sender: user.username});
          chatMessageForDB.save();
        })
      });

      // client disconnect
      socket.on('disconnect', () => {
        const user = userLeave(socket.id);

        if (user) {
          io.emit('message', formatMessage('Admin', `${user.username} has left the chat`));
        };
      });

  })

});



// customization for server
app.use(express.static(path.join(__dirname, 'public')));
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
