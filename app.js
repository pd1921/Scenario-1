var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var app = express();
const http = require('http');
var fs = require('fs');

var https = require('https');
var privateKey  = fs.readFileSync('server.key', 'utf8');
var certificate = fs.readFileSync('server.crt', 'utf8');
var credentials = {key: privateKey, cert: certificate};

const server = require('https').Server(credentials,app)
const io = require('socket.io')(server)

// const server = http.createServer(app);
// const { Server } = require("socket.io");
// const io = new Server(server);
// const { ExpressPeerServer } = require("peer");
// const peerServer = ExpressPeerServer(server, {debug: true,});

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var scenario1Router = require('./routes/scenario1');
var scenario2Router = require('./routes/scenario2');
var scenario3Router = require('./routes/scenario3');



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/scenario1', express.static(__dirname + '/public'));
app.use('/scenario2', express.static(__dirname + '/public'));

app.use('/', indexRouter);
app.use('/scenario1', scenario1Router);
// app.use('/scenario1_v2', scenario1Router);
app.use('/scenario2', scenario2Router);
app.use('/scenario3', scenario3Router);
app.use('/users', usersRouter);
// app.use("/peerjs", peerServer);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
//
io.of("/video").on("connection", (socket) => {
  socket.on('join-room', (roomId, userId, username, location) => {
    socket.join(roomId)
    console.log("!!",userId)
    socket.to(roomId).emit('user-connected', userId, username, location)

    socket.on('disconnect', () => {
        socket.to(roomId).emit('user-disconnected', userId)
    })
  });

});
var r1count = 0;
var r2count = 0;
var r3count = 0;
io.of("/command").on('connection', (socket) => {
  socket.join(socket.handshake.auth.token);
  socket.join(socket.handshake.auth.id);
  console.log(socket.handshake.auth.token);
  console.log('a user connected');
  socket.on('disconnect', (msg) => {
    console.log('user disconnected');
    console.log(msg);
  });
  
  socket.on('1', (count) => {
    if(count > 0 ){
      console.log("[log]  server get room1 user ready Msg");
    }else{
      console.log("[log]  server get room1 user leave Msg");
    }
    if(r1count < 0){
      r1count = 0;
    }
    // console.log(count);
    r1count+=count;
    console.log("[log]  room1 has %d user ready",r1count);
    if(r1count == 2){
      console.log("fire")
      io.of("/command").to('1').emit("start");
    }
    
  });
  socket.on('2', (count) => {
    if(count > 0 ){
      console.log("[log]  server get room2 user ready Msg");
    }else{
      console.log("[log]  server get room2 user leave Msg");
    }
    if(r2count < 0){
      console.log("[log]  server send start Msg to room2 user ");
      r2count = 0;
    }
    r2count+=count;
    console.log("[log]  room2 has %d user ready",r2count);
    if(r2count == 2){
      console.log("[log]  server send start Msg to room2 user ");
      io.of("/command").to("2").emit("start");
    }
  });
  socket.on('3', (count) => {
    if(count > 0 ){
      console.log("[log]  server get room3 user ready Msg");
    }else{
      console.log("[log]  server get room3 user leave Msg");
    }
    if(r3count < 0){
      console.log("[log]  server send start Msg to room3 user ");
      r3count = 0;
    }
    // console.log(count);
    r3count+=count;
    console.log("[log]  room3 has %d user ready",r3count);
    if(r3count == 2){
      console.log("[log]  server send start Msg to room3 user ");
      io.of("/command").to("3").emit("start");
    }
  });
  // socket interact with room.ejs to calculate rtt between server & client
  socket.on('ping', (userId,timeStamp) => {
    io.of("/command").to(userId).emit("pong",timeStamp);
  });
  
});

server.listen(443, () => {
  console.log('listening on *:443');
});
module.exports = app;
