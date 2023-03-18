const express = require("express");
const path = require("path");
const http = require("http");
const app = express();
const { Server } = require("socket.io");
const session = require("express-session");

//initialising a new instance of socket.io by pasing server(HTTP) object
const server = http.createServer(app);
const io = new Server(server);

//use express session
const sessionMiddleware = session({
  secret: "chatbot",
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true },
});
app.use(sessionMiddleware);
io.engine.use(sessionMiddleware);




//listen on the 'connection'/'disconnection' events for incoming sockets and log it to the console
io.on("connection", (socket) => {
  console.log(`a user connected: ${socket.id}`);

  const orderHistory = [];
  let customer = {
    name: "",
    cart: [],
  };
  socket.on("disconnect", () => {
    console.log(`user disconnected: ${socket.id} `);
  });
  // Allow bot to send a welcome message to user
  socket.on("welcome-message", (username) => {
    socket.emit(
      "welcome-message",
      `Hello ${username}. Welcome to FaxFood. we will be assisting you with your order <br> Please type <b>1</b> to view list of available items in the menu`
    );
  });

  //Bot auto Response to the client function
  const botResponse = async (msg) => {
    socket.emit("bot-response", msg);
  };

  //resend to client if no order was placed
  const check = async () => {
    if (customer.cart === null) {
      await botResponse(`Please type <b>1</b> to view list of available menu.`);
    }
  };

  //listen to chat-messgae event from client
  socket.on("chat message", (msg) => {
    io.emit('chat message', msg)
    clientResponse(msg);
  });

  const clientResponse = async (msg) => {
    try {
      
      const snacks = [
  { name: "Meatpie", price: 1200, tag: "2", qty: 1 },
  { name: "Doughnut", price: 1000, tag: "4", qty: 1 },
  { name: "Sausage", price: 1500, tag: "6", qty: 1},
  { name: "Bread", price: 500, tag: "8", qty: 1 },
];
      switch (msg) {
        case "1":
          // create a list a menu
          const menuList = snacks
            .map((food) => `Type <b>${food.tag}</b> to add <b> ${food.name}</b> to cart <br>`)
            .join("\n");
          customer.cart = [];
          await botResponse(
            `Available snacks: <br>${menuList}`
            
          );
          break;

        // add item 2 to the order list
        case "2":
          check();
          // search for item requested from the array of snacks
          let item1Requested = snacks.find((val) => val.tag === "2");
          // look through the cart if item is there
          const item1InCart = customer.cart.findIndex((val) => val.tag === "2");
          // if item is not there, add it to cartand increase the quantity by 1

          if (item1InCart === -1) {
            //if itemRequested is not in cart, push into an array of customer.cart 
            customer.cart.push(item1Requested);
          }else {
            customer.cart[item1InCart].qty += 1}

          await botResponse(
            `<b>${item1Requested.name}</b> has been added to cart. <br>
            Type <b>2</b> to add more <b>${item1Requested.name} </b> to cart <br>
            Type <b>4</b> to add <b>Doughnut</b> to cart <br>
            Type <b>6</b> to add <b>Sausage</b> to cart <br>
            Type <b>8</b> to add <b>Bread</b> to cart <br>
            Type <b>97</b> to view cart. <br> Type <b>99</b> to checkout. <br> 
            Type<b>98</b> to view checked out order(s).<br>
            Type <b>0</b> to cancel order`
          );
          break;

        case "4":
          check();
          // search for item requested from the array of snacks
          let item2Requested = snacks.find((val) => val.tag === "4");
          // look through the cart if item is there
          const item2InCart = customer.cart.findIndex((val) => val.tag === "4");
          // if item is not there, add it to cartand increase the quantity by 1
          
          if (item2InCart === -1) {

            customer.cart.push(item2Requested);
          }else {
            customer.cart[item2InCart].qty += 1}
          await botResponse(
            `<b>${item2Requested.name}</b> has been added to cart. <br>
            Type <b>4</b> to add more <b>${item2Requested.name} </b> to cart <br>
            Type <b>2</b> to add <b>Meatpie</b> to cart <br>
            Type <b>6</b> to add <b>Sausage</b> to cart <br>
            Type <b>8</b> to add <b>Bread</b> to cart <br>
            Type <b>97</b> to view cart. <br> Type <b>99</b> to checkout. <br> 
            Type<b>98</b> to view checked out order(s).<br>
            Type <b>0</b> to cancel order`
          );
          break;

        case "6":
          check();
          // search for item requested from the array of snacks
          let item3Requested = snacks.find((val) => val.tag === "6");
          // look through the cart if item is there
          const item3InCart = customer.cart.findIndex((val) => val.tag === "6");
          // if item is not there, add it to cartand increase the quantity by 1
          
          if (item3InCart === -1) {
            customer.cart.push(item3Requested);
          }else {
            customer.cart[item3InCart].qty++}
          await botResponse(
            `<b>${item3Requested.name}</b> has been added to cart. <br>
            Type <b>6</b> to add more <b>${item3Requested.name} </b> to cart <br>
            Type <b>2</b> to add <b>Meatpie</b> to cart <br>
            Type <b>4</b> to add <b>Doughnut</b> to cart <br>
            Type <b>8</b> to add <b>Bread</b> to cart <br>
            Type <b>97</b> to view cart. <br> Type <b>99</b> to checkout. <br> 
            Type<b>98</b> to view checked out order(s).<br>
            Type <b>0</b> to cancel order`
          );
          break;

        case "8":
          check();
          // search for item requested from the array of snacks
          let item4Requested = snacks.find((val) => val.tag === "8");
          // look through the cart if item is there
          const item4InCart = customer.cart.findIndex((val) => val.tag === "8");
          // if item is not there, add it to cartand increase the quantity by 1
          
          if (item4InCart === -1) {
            
            customer.cart.push(item4Requested);
          }else {
            customer.cart[item4InCart].qty++}
          await botResponse(
            `<b>${item4Requested.name}</b> has been added to cart. <br>
            Type <b>8</b> to add more <b>${item4Requested.name} </b> to cart <br>
            Type <b>2</b> to add <b>Meatpie</b> to cart <br>
            Type <b>4</b> to add <b>Doughnut</b> to cart <br>
            Type <b>6</b> to add <b>Sausage</b> to cart <br>
            Type <b>97</b> to view cart. <br> Type <b>99</b> to checkout. <br> 
            Type<b>98</b> to view checked out order(s).<br>
            Type <b>0</b> to cancel order`
          );
          break;
        //  checkout
        case "99":
          if (customer.cart.length === 0) {
            await botResponse(
              "No order in the cart to check out. Please type <b>1</b> to place order "
            );
          } else {
            customer.cart.map((prod) => orderHistory.push(prod));
            await botResponse(
              `Order placed succesfully! <br> 
              Type <b>1</b> to place more order(s) <br> 
              Type <b>98</b> to view cheched out orders(s). `
            );
            customer.cart = [];
          }
          break;

        //  to view cart
        case "97":
          if (customer.cart.length === 0 || customer.cart.length === null) {
            await botResponse(
              "No item in the cart! Please type <b>1</b> to place order"
            );
          } else {
            const price = customer.cart.reduce((acc, val) => {
              return acc + val.price * val.qty;
            }, 0);
            const currentOrder = customer.cart
              .map(
                (order) =>
                  `<b>${order.name} Qty:${order.qty} Price:${order.price}</b>each<br>`
              )
              .join("\n");

            await botResponse(
              `Here is a list of item(s) in your cart :<br>
              ${currentOrder}Total cost:${price} <br> 
              Type <b>0</b> to cance order(s) <br> 
              Type <b>99</b> to checkout `
            );
          }
          break;

        // view checked out orders
        case "98":
          if (orderHistory.length === 0) {
            await botResponse(
              "No previous checked out orders. Please type <b>1</b> to place order."
            );
          } else if (customer.cart.length === null) {
            await botResponse(`Input <b>1</b> to view list of options`);
          } else {
            const price = orderHistory.reduce((acc, val) => {
              return acc + val.price * val.qty;
            }, 0);

            const orderHistoryString = orderHistory
              .map(
                (order) =>
                  `<b>${order.name} Qty:${order.qty} Price:${order.price} </b>each<br>`
              )
              .join("\n");
            await botResponse(
              `Here are your previous checked out orders:<br>${orderHistoryString}Total cost:${price}`
            );
          }
          break;
        //  to cancel order
        case "0":
          if (customer.cart.length === 0) {
            await botResponse(
              "You have no plced order to cancel. Please type <b>1</b> to place orders."
            );
          } else if (customer.cart.length === null) {
            await botResponse(`Type <b>1</b> to view list of items`);
          } else {
            customer.cart = [];
            await botResponse(
              "Order cancelled. type <b>1</b> to place new order"
            );
          }
          break;
        default:
          await botResponse(
            "Invalid input <br>Please input <b>1</b> to view list of options"
          );
      }
    } catch (err) {
      console.log(err.message);
    }
  };
});

//homepage route handler '/' to render the html file
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

//make http listening on PORT :4000
server.listen(4000, () => {
  console.log("Server is running");
});

//get response from server
app.get("/", (req, res) => {
  res.send("<h1>Hello world</h1>");
});
