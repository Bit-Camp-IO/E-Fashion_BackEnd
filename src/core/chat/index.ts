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
