import { isChatActiveWithId, saveMessageToChat } from "@/core/chat";
import { Server, Socket } from "socket.io";

export async function chatSocket(io: Server) {
  const usersInChats = new Map();

  io.on('connection', (socket: Socket) => {
    socket.on('send-message', async (senderId, chatId, message) => {
      try {
        if (usersInChats.get(senderId) === chatId) {
          await saveMessageToChat(chatId, senderId, message);
          io.to(chatId).emit('receive-message', message);
        } else {
          socket.emit('error', 'You are not part of this chat');
        }
      } catch (err) {
        socket.emit('error', err);
      }
    });

    socket.on('join', async (userId, chatId) => {
      try {
        const chat = await isChatActiveWithId(userId, chatId);
        if (chat) {
          usersInChats.set(userId, chatId);
          socket.join(chatId);
        } else {
          socket.emit('error', 'Chat not found or not active');
        }
      } catch (err) {
        socket.emit('error', err);
      }
    });

    socket.on('disconnect', () => {
      const userId = getUserIdBySocketId(socket.id);
      if (userId) {
        usersInChats.delete(userId);
      }
    });

    function getUserIdBySocketId(socketId: string) {
      for (const [userId, chatId] of usersInChats.entries()) {
        if (io.sockets.sockets.get(socketId)?.rooms.has(chatId)) {
          return userId;
        }
      }
      return null;
    }
  });
}
