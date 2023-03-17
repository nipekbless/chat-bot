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

const snacks = [
  { name: "Meatpie", price: 1200, tag: "2", qty: 0 },
  { name: "Doughnut", price: 1000, tag: "4", qty: 0 },
  { name: "Sausage", price: 1500, tag: "6", qty: 0 },
  { name: "Bread", price: 500, tag: "8", qty: 0 },
];

const orderHistory = [];

//listen on the 'connection'/'disconnection' events for incoming sockets and log it to the console
io.on("connection", (socket) => {
  console.log(`a user connected: ${socket.id}`);
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
    clientResponse(msg);
  });

  const clientResponse = async (msg) => {
    try {
      switch (msg) {
        case "1":
          // create a list a menu
          const menuList = snacks
            .map((food) => `<b>${food.name}</b> =><b>${food.tag}</b><br>`)
            .join("\n");
          customer.cart = [];
          await botResponse(
            `Available snacks and their respective tags: <br>${menuList} Please select one by typing its corresponding tag.`
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
          customer.cart = [];
          if (item1InCart === -1) {
            item1Requested.qty = 1;
            customer.cart.push(item1Requested);
          }

          await botResponse(
            `<b>${item1Requested.name}</b> has been added to cart. <br> Type <b>1</b> to place more orders.<br> Type <b>97</b> to view cart. <br> Type <b>99</b> to checkout. <br> type<b>98</b> to view checked out order(s).`
          );
          break;

        case "4":
          check();
          // search for item requested from the array of snacks
          let item2Requested = snacks.find((val) => val.tag === "4");
          // look through the cart if item is there
          const item2InCart = customer.cart.findIndex((val) => val.tag === "4");
          // if item is not there, add it to cartand increase the quantity by 1
          customer.cart = [];
          if (item2InCart === -1) {
            item2Requested.qty = 1;
            customer.cart.push(item2Requested);
          }
          await botResponse(
            `<b>${item2Requested.name}</b> has been added to cart. <br> Type <b>1</b> to place more orders.<br> Type <b>97</b> to view cart. <br> Type <b>99</b> to checkout. <br> type<b>98</b> to view checked out order(s).`
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
            item3Requested.qty = 1;
            customer.cart.push(item3Requested);
          }
          await botResponse(
            `<b>${item3Requested.name}</b> has been added to cart. <br> Type <b>1</b> to place more orders.<br> Type <b>97</b> to view cart. <br> Type <b>99</b> to checkout. <br> type<b>98</b> to view checked out order(s).`
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
            console.log(item4Requested)
            item4Requested.qty = 1;
            customer.cart.push(item4Requested);
          }
          await botResponse(
            `<b>${item4Requested.name}</b> has been added to cart. <br> Type <b>1</b> to place more orders.<br> Type <b>97</b> to view cart. <br> Type <b>99</b> to checkout. <br> type<b>98</b> to view checked out order(s).`
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
              "Order placed succesfully! <br> Type <b>1</b> to place more order(s) <br> Type <b>98</b> to view cheched out orders(s). "
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
              `Here is a list of item(s) in your cart :<br>${currentOrder}Total cost:${price} <br> Type <b>1</b> to place more order(s) <br> Type <b>99</b> to checkout `
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
              "Order cancelled. type <b>1</b> to view list of options"
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
