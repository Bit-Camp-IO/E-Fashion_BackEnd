import ChatModel from "@/database/models/chat";
import { ChatData } from "./interfaces";
import { AsyncSafeResult } from "@type/common";
import { NotFoundError } from "../errors";

export async function createChat(chatData: ChatData): AsyncSafeResult<ChatData> {
  try {
    const chat = await ChatModel.create({
      ...chatData,
      status: "waiting"
    });

    const result: ChatData = {
      admin: chat.admin?.id,
      user: chat.user?.id,
      id: chat._id,
      messages: chat.messages,
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
    const chats = await ChatModel.find({ $where: status });
    if (!chats) {
      throw new NotFoundError('No chats specefied with status: ' + status)
    }
    return { result: chats, error: null }
  } catch (err) {
    return { error: err, result: null }
  }
}

export async function getChatById(id: string): AsyncSafeResult<ChatData> {
  try {
    const chat = await ChatModel.findOne({ id });

    if (!chat) {
      throw new NotFoundError("Chat with id " + id);
    }

    const result: ChatData = {
      admin: chat.admin?.id,
      user: chat.user?.id,
      id: chat._id,
      messages: chat.messages,
      status: chat.status
    }

    return { result, error: null }
  } catch (err) {
    return { error: err, result: null }
  }
}
