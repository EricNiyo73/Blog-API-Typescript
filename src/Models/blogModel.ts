import mongoose, { Document, Schema } from "mongoose";
import Joi from "joi";
const myDate = new Date();
const dates = myDate.toUTCString();
export interface Blog {
  title: string;
  description: string;
  image: string;
  comments: Comment[];
  likes: number;
  likedBy: string[];
  date: string;
}

export interface Comment {
  fullName: string;
  comment: string;
}

const blogSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  image: Joi.string(),
  likes: Joi.number().default(0),
  date: Joi.date().default(new Date()),
});

export const validateBlog = (data: Blog) => {
  return blogSchema.validate(data);
};
// const comments = Joi.array().items(
//   Joi.object().keys({
//     fullName: Joi.string().required(),
//     comment: Joi.string().required(),
//     cdate: Joi.string(),
//   })
// );
const commentSchema = Joi.object({
  comments: Joi.array().items({
    fullName: Joi.string().required(),
    comment: Joi.string().required(),
    date: Joi.string(),
  }),
});
export const validateComment = (data: Comment) => {
  return commentSchema.validate(data);
};
export interface BlogDocument extends Blog, Comment, Document {}

const blogMongooseSchema = new Schema<BlogDocument>({
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
  comments: [
    {
      fullName: {
        type: String,
        required: true,
      },
      comment: {
        type: String,
        required: true,
      },
      date: {
        type: String,
        default: `${dates}`,
      },
    },
  ],
  likes: {
    type: Number,
    default: 0,
  },
  likedBy: [{ type: Schema.Types.ObjectId, ref: "User" }],
  date: {
    type: String,
    default: `${dates}`,
  },
});

export default mongoose.model<BlogDocument>("Blog", blogMongooseSchema);
