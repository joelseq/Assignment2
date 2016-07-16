const express = require('express');
const logger = require('morgan');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

app.use(logger('dev'));
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// allow CORS
app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-type,Accept,X-Access-Token,X-Key');
  if (req.method == 'OPTIONS') {
    res.status(200).end();
  } else {
    next();
  }
});

mongoose.connect("mongodb://localhost:27017/assignment2");

const ChatSchema = mongoose.Schema({
  created: Date,
  content: String,
  username: String
});

const Chat = mongoose.model('Chat', ChatSchema);

//This route is simply run only on first launch just to generate some chat history
app.post('/setup', function(req, res) {
  //Array of chat data. Each object properties must match the schema object properties
  var chatData = [{
    created: new Date(),
    content: 'Hi',
    username: 'Chris'
  }, {
    created: new Date(),
    content: 'Hello',
    username: 'Obinna'
  }, {
    created: new Date(),
    content: 'Ait',
    username: 'Bill'
  }, {
    created: new Date(),
    content: 'Amazing room',
    username: 'Patience'
  }];

  //Loop through each of the chat data and insert into the database
  for (var c = 0; c < chatData.length; c++) {
    //Create an instance of the chat model
    var newChat = new Chat(chatData[c]);
    //Call save to insert the chat
    newChat.save(function(err, savedChat) {
      console.log(savedChat);
    });
  }
  //Send a resoponse so the serve would not get stuck
  res.send('created');
});

//This route produces a list of chat as filterd by 'room' query
app.get('/msg', function(req, res) {
  //Find
  Chat.find({}, (err, messages) => {
    if(err) {
      console.error(err);
      return res.status(500).json({message: "Something went wrong"});
    }
    res.json(messages);
  });
});

//Listen for connection
io.on('connection', (socket) => {
  //Globals
  let defaultRoom = 'general';
  let rooms = ["General", "angular", "socket.io", "express", "nodejs"];

  //Emit the rooms Array
  socket.emit('setup', {
    rooms: rooms
  });

  //Listens for new user
  socket.on('new user', (data) => {
    data.room = defaultRoom;
    //New user joins the default room
    socket.join(defaultRoom);
    //Tell all those in the room that a new user joined
    io.in(defaultRoom).emit('user joined', data);
  });

  //Listens for switch room
  socket.on('switch room', (data) => {
    //Handles joining and leaving rooms
    socket.leave(data.oldRoom);
    socket.join(data.newRoom);
    io.in(data.oldRoom).emit('user left', data);
    io.in(data.newRoom).emit('user joined', data);
  });

  //Listens for a new chat message
  socket.on('new message', (data) => {
    //Create message
    var newMsg = new Chat({
      username: data.username,
      content: data.message,
      room: data.room.toLowerCase(),
      created: new Date()
    });
    //Save it to db
    newMsg.save(function(err, msg) {
      //Send message to those connected in the room
      io.in(msg.room).emit('message created', msg);
    });
  });
});

server.listen(3000, () => {
  console.log("Server started on port 3000");
});
