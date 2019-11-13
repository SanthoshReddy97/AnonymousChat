var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var bodyparser = require('body-parser');
var ejs = require('ejs');

app.use(bodyparser.urlencoded({extended: true}));

app.use(bodyparser.json());

app.set('view engine', ejs);


app.get('/', function(req, res){
  res.render('home.ejs')
});

var connected = 0
var chat = io.on('connection', (socket) => {
  connected++
  console.log("connected", connected)


  socket.on('join', (data) => {
    socket.name = data.username
    console.log("join data", data);
    socket.room = data.phonenumber
    socket.join(socket.room)
  });

  socket.on('send message', (data) => {
    console.log(data)
    // io.sockets.emit('new message', {msg: data});
    socket.broadcast.to(socket.room).emit('new message', { msg: data })
  });

  socket.on('disconnect', (data) => {
    console.log("data is ==>", data);
  });

  socket.emit("time", new Date());
  
});

http.listen(4000 , function(){
  console.log('listening on port: 4000');
});

module.exports = app;