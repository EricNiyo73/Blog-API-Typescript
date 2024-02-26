import mongoose, { Schema, Document } from "mongoose";
import Joi from "joi";
const myDate = new Date();
const dates = myDate.toUTCString();
export interface UserDocument extends Document {
  fullName: string;
  email: string;
  password: string;
  userRole: string;
  date: string;
}
const userSchema = Joi.object({
  fullName: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  userRole: Joi.string(),
  date: Joi.string().default(new Date().toUTCString()),
});

export const validateUser = (data: UserDocument) => {
  return userSchema.validate(data);
};

const userMongooseSchema: Schema = new Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  userRole: { type: String, enum: ["admin", "user"], default: "user" },
  date: { type: String, default: `${dates}` },
});

const User = mongoose.model<UserDocument>("User", userMongooseSchema);

export default User;
