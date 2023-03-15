//connect to the socket
const socket = io();

//get the elements from the DOM
//const clientMessage = document.getElementById('client-msg');
const robotMessage = document.getElementById("robot-msg");
const chatForm= document.getElementById("chat-form")
const clientInput = document.getElementById("client-input")
const messageView = document.getElementById("message-view")
const username = propt("Please type your Username")

//listen for the chat message event from the server
socket.on("chat message", (message) => {
    //output the message to the DOM
    Message(message);
  });


//create an event listener for the form
chatForm.addEventListener("submit", (e)=> {
    e.preventDefault();

    // Get message text
  let msg = e.target.element["client-input"].value
  
  msg = msg.trim();

  if (!msg) {
    return false;
  }

  //call the addMesssage function
  addMessage(msg)

  // Emit message to server
  socket.emit('chatMessage', msg);

  // Clear input
  e.target.elements.msg.value = '';
  e.target.elements.msg.focus()
});

function addMessage(message) {
    const li = document.createElement("li");
    li.classList.add("message");
    li.innerText = message
  //append the li to the chat-view div
  messageView.appendChild(li);

}