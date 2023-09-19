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
      socket.emit('error', "Chat id or token are not valid")
      socket.disconnect(true);
      return;
    }

    const chat = chatId.toString();

    let { result, error } = isAdmin
      ? await connectAdmin(token, chatId)
      : await connectUser(token, chatId);

    if (error) {
      socket.emit('error', error.message)
      socket.disconnect(true);
      return;
    }
    users.set(socket.id, result!);

    socket.join(chat);

    socket.on('send-message', async (message: string | undefined) => {
      if (!message) {
        socket.emit('error', "Invalid message object")
        return;
      }
      message = message.trim();
      if (message.length === 0) {
        socket.emit('error', "Empty message") //Should we emit an error on this case or just a return ?
        return;
      }
      const messageObject = await saveMessageToChat(chatId, users.get(socket.id)!, message);
      if (messageObject.error) {
        socket.emit("error", error?.message)
        return;
      }
      socket.to(chat).emit('new-message', messageObject.result);
    });

    socket.on('error', (err) => {
      console.log(err)
    })
  });
}
