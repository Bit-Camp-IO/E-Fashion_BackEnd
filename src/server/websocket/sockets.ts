import ChatModel from "@/database/models/chat";
import { Server, Socket } from "socket.io";

export async function chatSocket(io: Server) {
  io.on('connection', (socket: Socket) => {

    socket.on('admin-join', async (chatId, adminId) => {
      const chat = await ChatModel.findByIdAndUpdate(chatId, {
        $set: { admin: adminId, status: 'active' }
      }, { new: true });
      if (!chat) {
        throw new Error("Something went wrong")
      }

      socket.to(chatId).emit('admin-joined', adminId)
    })

    socket.on('send-message', async (senderId, chatId, message) => {
      await ChatModel.findByIdAndUpdate(chatId, {
        $push: {
          messages: {
            sender: senderId,
            content: message
          }
        }
      }
      )
      socket.to(chatId).emit('recieve-message', senderId, message)
    })
  })
}
