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



const UserSchema = mongoose.Schema({
  username: String
});

const User = mongoose.model('User', UserSchema);

const ChatSchema = mongoose.Schema({
  created: Date,
  content: String,
  username: String
});

const Chat = mongoose.model('Chat', ChatSchema);

//This route is to get all the users that are currently on the server
app.get('/users', (req,res) => {
  //Find users
  User.find({}, (err, users) => {
    if(err) {
      console.log(err);
      return res.status(500).json({message: "Something went wrong"});
    }
    res.json(users);
  });
});

//This route produces a list of chat as filterd by 'room' query
app.get('/msg', function(req, res) {
  //Find messages
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

  console.log('User has connected via socket.io!');

  //Listens for a new chat message
  socket.on('new message', (data) => {
    //Create message
    var newMsg = new Chat({
      username: data.username,
      content: data.message,
      created: new Date()
    });

    console.log('New message created: ' + data.message);
    //Save it to db
    newMsg.save(function(err, msg) {
      //Send message to those connected in the room
      socket.emit('message created', msg);
    });
  });

  //Log when user is disconnected
  socket.on('disconnect', () => {
    console.log('User disconnected!');
  });

  //Add new user when joins
  socket.on('new user', (data) => {
    User.create({username: data.username}, (err, insertedUser) => {
      if(err) {
        console.err(err);
        return res.status(500).json({message: "Something went wrong"});
      }
      console.log("User successfully inserted: " + insertedUser);
    });
  });

});

server.listen(3000, () => {
  console.log("Server started on port 3000");
});
