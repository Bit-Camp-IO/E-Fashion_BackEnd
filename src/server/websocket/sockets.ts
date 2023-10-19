import { connectAdmin, connectUser } from '@/core/chat';
import { Server, Socket } from 'socket.io';

export enum SocketEvent {
  ERROR = 'error',
  ACCEPT_CHAT = 'accept_chat',
  NEW_MESSAGE = 'new_message',
  CLOSE_CHAT = 'close_chat',
}

function socketError(socket: Socket, error: string) {
  socket.emit(SocketEvent.ERROR, error);
}

const users = new Map<string, string>();
export async function initSocket(io: Server) {
  io.on('connection', async socket => {
    const token = socket.handshake.auth.token;
    const chatId = socket.handshake.query.chatId?.toString();
    const isAdmin = socket.handshake.query.isAdmin || false;
    if (!chatId || !token) {
      socketError(socket, 'Chat id or token are not valid');
      socket.disconnect();
      return;
    }

    let { result, error } = isAdmin
      ? await connectAdmin(token, chatId)
      : await connectUser(token, chatId);

    if (error) {
      socketError(socket, error.message);
      socket.disconnect(true);
      return;
    }
    users.set(result!, socket.id);
    socket.on('disconnect', () => {
      users.delete(result!);
    });
  });
}

export function emitUserEvent(io: Server, userId: string, event: SocketEvent, payload?: unknown) {
  const userSocketId = users.get(userId);
  if (userSocketId) {
    io.to(userSocketId).emit(event, payload);
  }
}
export function inWebSocket(id: string) {
  return users.has(id);
}
