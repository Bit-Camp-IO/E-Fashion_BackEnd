import ChatModel, { ChatDB, ChatStatus } from '@/database/models/chat';
import { ChatData } from './interfaces';
import { AsyncSafeResult } from '@type/common';
import { NotFoundError, UnauthorizedError } from '../errors';
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
      throw new Error('You have an active or waiting to respond chat');
    }
    const chat = await ChatModel.create({
      user: userId,
      status: 'waiting',
    });
    const result: ChatData = {
      user: chat.user._id,
      id: chat._id,
      status: chat.status,
    };

    return { result, error: null };
  } catch (err) {
    return { error: err, result: null };
  }
}

export async function saveMessageToChat(
  chatID: string,
  senderId: string,
  content: string,
): AsyncSafeResult<any> {
  try {
    const chat = await ChatModel.findByIdAndUpdate(
      chatID,
      {
        $push: {
          messages: {
            sender: senderId,
            content: content,
          },
        },
      },
      { new: true },
    );

    if (!chat) {
      throw new NotFoundError('Chat with id' + chatID);
    }
    const lastMessage = chat.messages[chat.messages.length - 1];
    const result = {
      content: lastMessage.content,
      date: lastMessage.createdAt,
    };
    return { result, error: null };
  } catch (err) {
    return { error: err, result: null };
  }
}

export async function getChats(): AsyncSafeResult<any> {
  try {
    const chats = await ChatModel.find();
    if (!chats) {
      throw new NotFoundError('No chats specefied with status: ' + status);
    }
    return { result: chats, error: null };
  } catch (err) {
    return { error: err, result: null };
  }
}

export async function getChatById(id: string): AsyncSafeResult<ChatDB> {
  try {
    const chat = await ChatModel.findOne({ id });

    if (!chat) {
      throw new NotFoundError('Chat with id ' + id);
    }
    return { result: chat, error: null };
  } catch (err) {
    return { error: err, result: null };
  }
}

export async function getUserChat(id: string): AsyncSafeResult<ChatDB> {
  try {
    const chat = await ChatModel.findOne({ user: id, status: ['active', 'waiting'] })
    if (!chat) {
      throw new NotFoundError('Chats ')
    }
    return { result: chat, error: null }
  } catch (err) { 
    return { error: err, result: null}
  }
}

export async function changeStatus(id: string, stuatus: string): Promise<Error | null> {
  try {
    const chat = await ChatModel.findByIdAndUpdate(id, { $set: { status: stuatus } });
    if (!chat) {
      throw new NotFoundError('Chat wit id' + id);
    }
    return null;
  } catch (err) {
    return err;
  }
}

export async function acceptChat(adminId: string, chatId: string): Promise<Error | null> {
  try {
    const chat = await ChatModel.findByIdAndUpdate(chatId, {
      $set: { status: 'active', admin: adminId },
    });
    if (!chat) {
      throw new NotFoundError('Chat wit id' + chatId);
    }
    return null;
  } catch (err) {
    return err;
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
