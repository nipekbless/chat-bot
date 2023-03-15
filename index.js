const express = require("express");
const path = require("path");
const http = require("http");
const app = express();
const { Server } = require("socket.io");


//initialising a new instance of socket.io by pasing server(HTTP) object
const server = http.createServer(app);
const io = new Server(server);




//listen on the 'connection'/'disconnection' events for incoming sockets and log it to the console
io.on("connection", (socket) => {
    console.log(`a user connected: ${socket.id}`);
    socket.on('disconnect', () => {
        console.log(`user disconnected: ${socket.id} `);
      });   
  // Allow bot to send a welcome message to user  
socket.on('welcome-message',(username)=>{
    socket.emit('welcome-message',
        `BOT: Hello, ${username} Welcome to our chatbot`
    )
} )
})

// Print out chat message event from the client and send back response from server
io.on('connection', (socket) => {
    socket.on('chat message', (msg) => {
      console.log(msg);
      io.emit('chat message',msg);
      io.emit('chat message', `BOT: we will be  assisting your with you order. please select from the list below`)
      io.emit('chat message', 
        `Select 1 to place order <br>
        Select 99 to checkout order <br>
        Select 98 to see order history <br>
        Select 97 to see current order <br>
        Select 0 to cancel order`
      )
    });

    socket.on("bot-response", (msg)=>{

        if(msg === "1"){
            io.emit("bot-response", "Bot")
        }
    })

  });

 
 


//homepage route handler '/' to render the html file 
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
  });

//make http listening on PORT :4000
server.listen(4000, () => {
    console.log("Server is running");
});

//get response from server
app.get('/', (req, res) => {
    res.send('<h1>Hello world</h1>');
  });