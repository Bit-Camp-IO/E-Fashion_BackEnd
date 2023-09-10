import { saveMessageToChat } from "@/core/chat";
import { Server, Socket } from "socket.io";

export async function chatSocket(io: Server) {
  const chats = new Map();
  io.on('connection', (socket: Socket) => {
    socket.on('accept-chat', async (adminId, chatId) => {
      chats.set(adminId, chatId)
      socket.join(chatId)
    })

    socket.on('send-message', async (senderId, chatId, message) => {
      await saveMessageToChat(chatId, senderId, message)
      socket.to(chatId).emit('recieve-message', message)
    }
    )

    socket.on('join', async (userId, chatId) => {
      chats.set(userId, chatId)
      socket.join(chatId)
    })

    socket.on('disconnect', async () => {
      
    });
  })
}
