import mongoose from "mongoose";

export interface MessageDB {
  sender: string,
  receiver: string,
  content: string,
}

const messageSchema = new mongoose.Schema<MessageDB>({
  sender: [{ type: String, required: true }],
  receiver: [{ type: String, required: true }],
  content: [{ type: String, required: true }],
}, { timestamps: true });

const messageModel = mongoose.model('Message', messageSchema);
export default messageModel;