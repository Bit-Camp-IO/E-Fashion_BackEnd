import ChatModel, { ChatDB, ChatStatus } from '@/database/models/chat';
import { ChatData, MessageResult } from './interfaces';
import { AsyncSafeResult } from '@type/common';
import { DuplicateError, NotFoundError, UnauthorizedError } from '../errors';
import AdminModel from '@/database/models/admin';
import { verifyToken } from '../auth/token';
import Config from '@/config';
import UserModel from '@/database/models/user';

export async function createChat(userId: string): AsyncSafeResult<ChatData> {
  try {
    const chatExists = await ChatModel.findOne({
      status: { $in: [ChatStatus.ACTIVE, ChatStatus.WAITING] },
      user: userId,
    });

    if (chatExists) {
      throw new DuplicateError('An Active or Waiting chat ');
    }
    const chat = await ChatModel.create({
      user: userId,
      status: 'waiting',
    });

    return { result: _formatChat(chat), error: null };
  } catch (err) {
    return { error: err, result: null };
  }
}

// export interface MessageResult {
//   message: {
//     content: string;
//     sender: string;
//     date: Date;
//   };
//   to: string;
// }

export async function saveMessageToChat(
  chatID: string,
  senderId: string,
  content: string,
): AsyncSafeResult<{ message: MessageResult; to: string }> {
  try {
    const chat = await ChatModel.findById(chatID);

    if (!chat) {
      throw new NotFoundError('Chat with id' + chatID);
    }
    let to: string = '';
    if (senderId === chat.user.toString()) {
      to = chat.admin?.toString() || '';
    } else if (senderId === chat.admin?.toString()) {
      to = chat.user.toString();
    } else {
      throw new UnauthorizedError();
    }
    // const chat = await ChatModel.findByIdAndUpdate(
    //   chatID,
    //   {
    //     $push: {
    //       messages: {
    //         sender: senderId,
    //         content: content,
    //       },
    //     },
    //   },
    //   { new: true },
    // );
    const mesobj = {
      sender: senderId,
      content,
      createdAt: new Date(),
    };
    chat.messages.push(mesobj);
    await chat.save();
    const lastMessage = chat.messages[chat.messages.length - 1];
    const result = {
      content: lastMessage.content,
      sender: lastMessage.sender.toString(),
      date: lastMessage.createdAt,
      me: true,
    };
    return { result: { message: result, to }, error: null };
  } catch (err) {
    return { error: err, result: null };
  }
}

export async function getChats(): AsyncSafeResult<ChatData[]> {
  try {
    const chats = await ChatModel.find();
    // if (!chats) {
    //   throw new NotFoundError('No chats specefied with status: ');
    // }
    return { result: chats.map(chat => _formatChat(chat)), error: null };
  } catch (err) {
    return { error: err, result: null };
  }
}

export async function getChatById(id: string): AsyncSafeResult<ChatData> {
  try {
    const chat = await ChatModel.findOne({ id });

    if (!chat) {
      throw new NotFoundError('Chat with id ' + id);
    }
    return { result: _formatChat(chat), error: null };
  } catch (err) {
    return { error: err, result: null };
  }
}

export async function getUserChat(id: string): AsyncSafeResult<ChatData> {
  try {
    const chat = await ChatModel.findOne({ user: id, status: ['active', 'waiting'] });
    if (!chat) {
      throw new NotFoundError('chat');
    }
    return { result: _formatChat(chat), error: null };
  } catch (err) {
    return { error: err, result: null };
  }
}

export async function getChatMessages(
  id: string,
  userId: string,
): AsyncSafeResult<MessageResult[]> {
  try {
    const chat = await ChatModel.findById(id);
    if (!chat) {
      throw new NotFoundError('chat');
    }
    if (userId !== chat.user.toString() && userId !== chat.admin?.toString()) {
      throw new UnauthorizedError();
    }
    return { result: _formatMessages(chat, userId), error: null };
  } catch (error) {
    return { error, result: null };
  }
}

export async function changeStatus(id: string, stuatus: string): AsyncSafeResult<ChatData> {
  try {
    const chat = await ChatModel.findByIdAndUpdate(id, { $set: { status: stuatus } });
    if (!chat) {
      throw new NotFoundError('Chat wit id' + id);
    }
    return { result: _formatChat(chat), error: null };
  } catch (error) {
    return { result: null, error };
  }
}

export async function acceptChat(adminId: string, chatId: string): AsyncSafeResult<ChatData> {
  try {
    const chat = await ChatModel.findByIdAndUpdate(chatId, {
      $set: { status: 'active', admin: adminId },
    });
    if (!chat) {
      throw new NotFoundError('Chat wit id' + chatId);
    }
    return { result: _formatChat(chat), error: null };
  } catch (error) {
    return { error, result: null };
  }
}

export async function isChatActiveWithId(userId: string, chatId: string): Promise<Boolean | Error> {
  try {
    const chat = await ChatModel.findById(chatId);
    if (!chat) {
      throw new NotFoundError('Chat ');
    }
    if (chat.user.toString() !== userId || chat.admin?.toString() !== userId) {
      throw new UnauthorizedError();
    }
    return chat.status === ChatStatus.ACTIVE;
  } catch (err) {
    return err;
  }
}

export async function connectUser(token: string, chatId: string): AsyncSafeResult<string> {
  try {
    const chat = await ChatModel.findById(chatId);
    if (!chat) {
      throw new NotFoundError('Chat ');
    }
    const userID = verifyToken(token, Config.ACCESS_TOKEN_PUBLIC_KEY).id;
    const user = await UserModel.findById(userID);
    if (!user) {
      throw new UnauthorizedError();
    }
    if (chat.user!.toString() !== userID) {
      throw new UnauthorizedError();
    }
    return { result: userID, error: null };
  } catch (error) {
    return { result: null, error };
  }
}

export async function connectAdmin(token: string, chatId: string): AsyncSafeResult<string> {
  try {
    const chat = await ChatModel.findById(chatId);
    if (!chat) {
      throw new NotFoundError('Chat ');
    }
    const adminId = verifyToken(token, Config.ACCESS_TOKEN_PUBLIC_KEY).id;
    const admin = await AdminModel.findById(adminId);
    if (!admin) {
      throw new UnauthorizedError();
    }
    if (chat.admin!.toString() !== adminId) {
      throw new UnauthorizedError();
    }
    return { result: adminId, error: null };
  } catch (error) {
    return { result: null, error };
  }
}

function _formatChat(chat: ChatDB): ChatData {
  return {
    id: chat._id.toString(),
    status: chat.status,
    user: chat.user._id.toString(),
    // admin: chat.admin?._id?.toString() || '',
  };
  // messages:
  //   chat.messages?.map(msg => ({
  //     content: msg.content,
  //     sender: msg.sender,
  //     date: msg.createdAt,
  //     me: msg.
  //   })) || [],
}

function _formatMessages(chat: ChatDB, id: string): MessageResult[] {
  // messages:
  return chat.messages.map(m => ({
    content: m.content,
    date: m.createdAt,
    me: m.sender === id,
  }));
  //   })) || [],
}
