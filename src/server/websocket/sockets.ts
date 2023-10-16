import { connectAdmin, connectUser, saveMessageToChat } from '@/core/chat';
import Notification, { NotificationType } from '@/core/notification';
import { Server, Socket } from 'socket.io';

/**
 *
 * io.connection("http://localhost:8080")
 *
 * io.emit("send-message", "message content") // send message
 *
 * io.emit("close") // close
 *
 */

export async function chatSocket(io: Server) {
  const users = new Map<string, string>();
  const activeUsers = new Set<string>();

  io.on('connection', async (socket: Socket) => {
    const token = socket.handshake.auth.token;
    const chatId = socket.handshake.query.chatId?.toString();
    const isAdmin = socket.handshake.query.isAdmin || false;

    if (!chatId || !token) {
      socket.emit('error', 'Chat id or token are not valid');
      socket.disconnect(true);
      return;
    }

    const chat = chatId.toString();

    let { result, error } = isAdmin
      ? await connectAdmin(token, chatId)
      : await connectUser(token, chatId);

    if (error) {
      socket.emit('error', error.message);
      socket.disconnect(true);
      return;
    }
    users.set(socket.id, result!);
    activeUsers.add(result!);
    socket.join(chat);

    socket.on('send-message', async (message: string | undefined) => {
      if (!message) {
        socket.emit('error', 'Invalid message object');
        return;
      }
      message = message.trim();
      if (message.length === 0) {
        socket.emit('error', 'Empty message'); // Should we emit an error on this case or just a return ?
        return;
      }
      const messageObject = await saveMessageToChat(chatId, users.get(socket.id)!, message);
      if (messageObject.error) {
        socket.emit('error', error?.message);
        return;
      }
      socket.to(chat).emit('new-message', messageObject.result.message);
      const resiver =
        messageObject.result.chat.user === users.get(socket.id)
          ? messageObject.result.chat.user
          : messageObject.result.chat.admin;
      if (!Array.from(users.values()).includes(resiver)) {
        await new Notification(NotificationType.NEW_MESSAGE, resiver).push({
          title: 'New Message',
          body: message,
        });
      }
    });

    socket.on('close', () => {
      socket.emit('chat-closed');
      users.delete(socket.id);
      socket.disconnect(true);
    });

    socket.on('disconnect', () => {
      users.delete(socket.id);
    });
  });
}
