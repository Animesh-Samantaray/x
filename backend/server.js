import "dotenv/config";
import http from "http";
import app from "./app.js";
import connectDB from "./configs/db.js";
import { initSocket } from "./configs/socket.js";

const PORT = process.env.PORT || 5000;

connectDB();

const server = http.createServer(app);

const io = initSocket(server);
app.set("io", io);



server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});