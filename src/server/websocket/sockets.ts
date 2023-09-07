import ChatModel from "@/database/models/chat";
import { Server, Socket } from "socket.io";

export async function chatSocket(io: Server) {
  io.on('connection', (socket: Socket) => {

    socket.on('adminJoin', async (chatId, adminId) => {
      const chat = await ChatModel.findByIdAndUpdate(chatId, {
        $set: { admin: adminId, status: 'active' }
      });
      if (!chat) {
        throw new Error("Something went wrong")
      }
      socket.emit('adminJoined', chatId);
    })
  })
}