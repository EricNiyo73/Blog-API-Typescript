import mongoose, { Document, Schema } from "mongoose";
import Joi from "joi";
const myDate = new Date();
const dates = myDate.toUTCString();
export interface Blog {
  author: string;
  title: string;
  description: string;
  image: string;
  date: string;
}
const blogSchema = Joi.object({
  author: Joi.string().required(),
  title: Joi.string().required(),
  description: Joi.string().required(),
  image: Joi.string().required(),
  date: Joi.string().default(new Date().toUTCString()),
});

export const validateBlog = (data: Blog) => {
  return blogSchema.validate(data);
};

export interface BlogDocument extends Blog, Document {}

const blogMongooseSchema = new Schema<BlogDocument>({
  author: {
    type: String,
    // required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    default: `${dates}`,
  },
});

export default mongoose.model<BlogDocument>("Blog", blogMongooseSchema);
