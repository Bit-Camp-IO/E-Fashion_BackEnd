import messageModel from "@/database/models/message";
import { Server, Socket } from "socket.io";
import { MessageData } from "./interfaces";

class SocketHandler {
  private io: Server;

  constructor(io: Server) {
    this.io = io;
    this.setupSocket();
  }

  private setupSocket() {
    this.io.on('connection', (socket: Socket) => {
      console.log('A user connected');

      socket.on('join', (room: string) => {
        socket.join(room);
      });

      socket.on('chat', async (message: MessageData) => {
        const newMessage = await messageModel.create(message);
        this.io.to(message.sender).emit('chat', newMessage);
        this.io.to(message.receiver).emit('chat', newMessage);
      });

      socket.on('disconnect', () => {
        console.log('A user disconnected');
      });
    });
  }
}

export default SocketHandler;