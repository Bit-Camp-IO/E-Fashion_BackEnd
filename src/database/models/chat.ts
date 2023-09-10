import mongoose from "mongoose";
import { UserDB } from "./user";
import { ObjectId, Relation } from "@type/database";
import { AdminDB } from "./admin";

export interface ChatDB extends mongoose.Document {
  user: Relation<UserDB>,
  admin: Relation<AdminDB>,
  messages: [{
    sender: string,
    content: string,
    createdAt: Date,
  }],
  status: string
}

const chatSchema = new mongoose.Schema<ChatDB>({
  user: { 
    type: ObjectId,
    ref: 'User' 
  },
  admin: {
    type: ObjectId,
    ref: 'Admin'
  },
  messages: [{
    sender: { type: String, required: true },
    content: { type: String, required: true },
    createdAt: { type: Date, required: true, default: Date.now() },
  }],
  status: { type: String, enum: ['active', 'waiting', 'closed'], required: true }
}, { timestamps: true });

const ChatModel = mongoose.model('Chat', chatSchema);
export default ChatModel;
