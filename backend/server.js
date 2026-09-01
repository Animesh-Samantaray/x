import "dotenv/config";

import app from "./app.js";
import connectDB from "./configs/db.js";
import { Server } from "socket.io";
import http from "http";
const PORT = process.env.PORT || 5000;


connectDB();

const server = http.createServer(app);

const io = new Server(server , {
  cors:{
     origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  }
})

io.on("connection",(socket)=>{
    console.log(`User connected : ${socket.id}`);

    socket.on("disconnect",()=>{
      console.log("User Disconnected : ",socket.id);
    })
    io.emit("Welcome")
})

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});