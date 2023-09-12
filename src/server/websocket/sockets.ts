import { isChatActiveWithId, saveMessageToChat } from "@/core/chat";
import { Server, Socket } from "socket.io";

export async function chatSocket(io: Server) {
  const chats = new Map();
  io.on('connection', (socket: Socket) => {
    socket.on('send-message', async (senderId, chatId, message) => {
      await saveMessageToChat(chatId, senderId, message)
      socket.to(chatId).emit('recieve-message', message)
    }
    )

    socket.on('join', async (userId, chatId) => {
      try {
        const chat = await isChatActiveWithId(userId, chatId);
        if (chat) {
          chats.set(userId, chatId)
          socket.join(chatId)  
        }
      } catch (err) {
        socket.emit('error', err)
      }
    })

    socket.on('disconnect', async () => {
      
    });
  })
}
