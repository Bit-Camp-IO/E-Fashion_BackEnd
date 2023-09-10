import { saveMessageToChat } from "@/core/chat";
import { Server, Socket } from "socket.io";

export async function chatSocket(io: Server) {
  const chats = new Map();
  io.on('connection', (socket: Socket) => {
    socket.on('join-chat', async (id, chatId) => {
      chats.set(id, chatId)
      socket.join(chatId)
    })

    socket.on('send-message', async (senderId, chatId, message) => {
      await saveMessageToChat(chatId, senderId, message)
      socket.to(chatId).emit('recieve-message', message)
    }
    )

    socket.on('disconnect', async () => {

    });
  })
}
