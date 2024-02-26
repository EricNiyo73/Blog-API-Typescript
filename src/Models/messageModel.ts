import mongoose, { Document, Schema } from "mongoose";
import Joi from "joi";
const myDate = new Date();
const dates = myDate.toUTCString();
export interface Message {
  fullName: string;
  email: string;
  messageContent: string;
  date: string;
}

export interface MessageDocument extends Message, Document {}
const messageSchema = Joi.object({
  fullName: Joi.string().required(),
  email: Joi.string().email().required(),
  messageContent: Joi.string().min(200).required(),
  date: Joi.string().default(new Date().toUTCString()),
});

export const validateMessage = (data: Message) => {
  return messageSchema.validate(data);
};
const MessageSchema = new Schema<MessageDocument>({
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  messageContent: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    default: `${dates}`,
  },
});

export default mongoose.model<MessageDocument>("Message", MessageSchema);
