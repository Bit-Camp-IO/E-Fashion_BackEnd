import ChatModel, { ChatDB } from "@/database/models/chat";
import { ChatData } from "./interfaces";
import { AsyncSafeResult } from "@type/common";
import { NotFoundError } from "../errors";

export async function createChat(userId: string): AsyncSafeResult<ChatData> {
  try {
    const chat = await ChatModel.create({
      user: userId,
      status: "waiting"
    });
    const result: ChatData = {
      user: chat.user._id,
      id: chat._id,
      status: chat.status
    }

    return { result, error: null }
  } catch (err) {
    return { error: err, result: null }
  }
}

export async function saveMessageToChat(chatID: string, senderId: string, content: string): AsyncSafeResult<any> {
  try {
    const chat = await ChatModel.findOneAndUpdate({ id: chatID }, {
      $push: {
        messages: {
          sender: senderId,
          content: content,
        }
      }
    })

    if (!chat) {
      throw new NotFoundError('Chat with id' + chatID);
    }

    return { result: chat, error: null }

  } catch (err) {
    return { error: err, result: null }
  }
}

export async function getChats(status: string): AsyncSafeResult<any> {
  try {
    const chats = await ChatModel.find({ status });
    if (!chats) {
      throw new NotFoundError('No chats specefied with status: ' + status)
    }
    return { result: chats, error: null }
  } catch (err) {
    return { error: err, result: null }
  }
}

export async function getChatById(id: string): AsyncSafeResult<ChatDB> {
  try {
    const chat = await ChatModel.findOne({ id });

    if (!chat) {
      throw new NotFoundError("Chat with id " + id);
    }
    return { result: chat, error: null }
  } catch (err) {
    return { error: err, result: null }
  }
}

export async function changeStatus(id: string, stuatus: string): Promise<Error | null> {
  try {
    const chat = await ChatModel.findByIdAndUpdate(id, { $set: { status: stuatus } })
    if (!chat) {
      throw new NotFoundError("Chat wit id" + id)
    }
    return null
  } catch (err) {
    return err;
  }
}

export async function acceptChat(adminId: string, chatId: string): Promise<Error | null> {
   try {
    const chat = await ChatModel.findByIdAndUpdate(chatId, { $set: { status: 'active', admin: adminId } })
    if (!chat) {
      throw new NotFoundError("Chat wit id" + chatId)
    }
    return null
  } catch (err) {
    return err;
  }
}