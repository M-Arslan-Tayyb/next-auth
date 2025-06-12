import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const port = parseInt(process.env.PORT ?? "3000", 10);
const hostname = "localhost";

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

async function startServer() {
  await app.prepare(); 

  const server = createServer((req, res) => {
    handle(req, res);
  });

  const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", 
    methods: ["GET", "POST"],
  },
});


  io.on("connection", (socket) => {
    console.log(`New client connected ${socket.id}`);

    socket.on("join-room",({roomId, username})=>{
      console.log(`User ${username} joined room ${roomId}`);
      socket.join(roomId);
      socket.to(roomId).emit("user-joined", { username, roomId });
    } )
    socket.on("send-message", ({ roomId, message, sender }) => {
  io.to(roomId).emit("receive-message", { message, sender });
});


    socket.on("disconnect", () => {
      console.log(" Client disconnected");
    });
  });

  server.listen(port, hostname, () => {
    console.log(`Server is running at http://${hostname}:${port}`);
  });
}

startServer();
