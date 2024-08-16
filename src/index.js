const express = require("express");
const connectDb = require("./db/mongodb");
const socketio = require("socket.io");
const path = require("path");
const cors = require("cors");
const { rateLimit } = require("express-rate-limit");
const cookieParser = require("cookie-parser");

connectDb();
const app = express();
const port = process.env.PORT || 3001;
const userRouter = require("./routers/user");
const userRoleRouter = require("./routers/userRole");
const productServer = require("./routers/product");
const requistionServer = require("./routers/requistion");
const productCategoryServer = require("./routers/productCategory");
const productLogServer = require("./routers/productLog");
const productSaleServer = require("./routers/productSale");
const patientServer = require("./routers/patient");
const outOfStockServer = require("./routers/outOfStock");
const dtpServer = require("./routers/drugTherapyProblem");
const wardServer = require("./routers/ward");
const receiptServer = require("./routers/receipt");
const chatServer = require("./routers/chat");
const messageServer = require("./routers/message");
const supplierServer = require("./routers/supplier");
const supplyServer = require("./routers/supply");
const institutionServer = require("./routers/institution");
const departmentServer = require("./routers/department");
const locationServer = require("./routers/location");
const unitServer = require("./routers/unit");
const transferServer = require("./routers/transfer");
const pharmacovigilanceServer = require("./routers/pharmacovigilance");
const feedbackServer = require("./routers/feedback");
const notificationServer = require("./routers/notification");
app.use(cors());
app.use(cookieParser());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(
  rateLimit({
    windowMs: 10 * 60 * 1000,
    limit: 200,
    message: "You have excceeded 100 requests",
    standardHeaders: true,
    legacyHeaders: false,
  })
);
app.use(express.json());
app.use(userRouter);
app.use(productServer);
app.use(requistionServer);
app.use(productCategoryServer);
app.use(productLogServer);
app.use(productSaleServer);
app.use(patientServer);
app.use(outOfStockServer);
app.use(dtpServer);
app.use(wardServer);
app.use(receiptServer);
app.use(chatServer);
app.use(messageServer);
app.use(supplierServer);
app.use(supplyServer);
app.use(institutionServer);
app.use(departmentServer);
app.use(locationServer);
app.use(unitServer);
app.use(userRoleRouter);
app.use(transferServer);
app.use(pharmacovigilanceServer);
app.use(feedbackServer);
app.use(notificationServer);

// ---------------------DEPLOYMENT----------------
const __dirname1 = path.resolve();
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname1, "/client/build")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname1, "client", "build", "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("Api is running Successfully");
  });
}

const server = app.listen(port, () => {
  console.log("Server is live " + port);
});
const io = socketio(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
  transports: ["websocket"],
  allowEIO3: true,
});

io.on("connection", (socket) => {
  console.log("connected to socket.io " + socket.id);

  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
  });
  socket.on("requistion", (message) => {
    io.emit("requistion_message", message);
  });
  socket.on("notification", (message) => {
    io.emit("notification_message", message);
  });

  socket.on("typing", (room) => socket.in(room).emit("typing"));

  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("new message", (messageReceived) => {
    const chat = messageReceived.chat;
    if (!chat.users) {
      return console.log("chat.users not defined");
    }
    chat.users.forEach((user) => {
      if (user._id !== messageReceived.sender._id) {
        socket.in(user._id).emit("message received", messageReceived);
      }
    });
  });

  socket.off("setup", (userData) => {
    socket.leave(userData._id);
  });

  socket.on("disconnect", () => {});
});
