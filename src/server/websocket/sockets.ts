// import { isChatActiveWithId, saveMessageToChat } from '@/core/chat';
// import { randomUUID } from 'crypto';
import { connectAdmin, connectUser, saveMessageToChat } from '@/core/chat';
import { Server, Socket } from 'socket.io';

export async function chatSocket(io: Server) {
  const users = new Map<string, string>();

  io.on('connection', async (socket: Socket) => {
    const token = socket.handshake.auth.token;
    const chatId = socket.handshake.query.chatId?.toString();
    const isAdmin = socket.handshake.query.isAdmin || false;

    if (!chatId || !token) {
      // TODO: ERROR
      socket.disconnect(true);
      return;
    }

    const chat = chatId.toString();

    let { result, error } = isAdmin
      ? await connectAdmin(token, chatId)
      : await connectUser(token, chatId);

    if (error) {
      // TODO: ERROR
      socket.disconnect(true);
      return;
    }
    users.set(socket.id, result!);

    socket.join(chat);

    socket.on('send-message', async (message: string | undefined) => {
      // TODO: Error
      if (!message) return;
      message = message.trim();
      if (message.length === 0) {
        // TODO: Error
        return;
      }
      const messageObject = await saveMessageToChat(chatId, users.get(socket.id)!, message);
      // TODO: Errors
      if (messageObject.error) {
        return;
      }
      socket.to(chat).except(socket.id).emit('new-message', messageObject.result);
    });

    // TODO: ERROR EVENT
  });
}
