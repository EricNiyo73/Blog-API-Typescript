import mongoose, { Document, Schema } from "mongoose";
import Joi from "joi";
const myDate = new Date();
const dates = myDate.toUTCString();
export interface subscriber {
  email: string;
  date: string;
}

export interface subscriberDocument extends subscriber, Document {}
const subscriberSchemaa = Joi.object({
  email: Joi.string().email().lowercase().required(),
  date: Joi.string().default(new Date().toUTCString()),
});

export const validatesubscriber = (data: subscriber) => {
  return subscriberSchemaa.validate(data);
};
const subscriberSchema = new Schema<subscriberDocument>({
  email: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    default: `${dates}`,
  },
});

export default mongoose.model<subscriberDocument>(
  "Subscriber",
  subscriberSchema
);
