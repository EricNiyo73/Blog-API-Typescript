import { Router, Request, Response } from "express";
import Message, { MessageDocument } from "../Models/messageModel";
import { validateMessage } from "../Models/messageModel";

export default class MessageController {
  // ===================================================
  static async sendMessage(req: Request, res: Response) {
    const { error } = validateMessage(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }

    const newmessage = new Message({
      fullName: req.body.fullName,
      email: req.body.email,
      messageContent: req.body.messageContent,
    });

    const savemessage = await newmessage.save();
    return res.status(201).json({
      message: savemessage,
      statusbar: "message successfully sent",
    });
  }

  //DELETE message
  static async deleteM(req: Request, res: Response) {
    const id = req.params.id;

    const message = await Message.findById(id);
    if (!message) {
      return res.status(400).json({
        message: "Id of a message not found",
      });
    } else {
      await Message.findByIdAndDelete(id);
      return res.status(204).json({
        message: "message deleted ............",
      });
    }
  }

  //GET message
  static async findOneMessage(req: Request, res: Response) {
    const message = await Message.findById(req.params.id);
    if (message) {
      return res.status(200).json(message);
    } else {
      return res.status(400).json({ message: "message not found" });
    }
  }

  //GET ALL messages
  static async findAllMessage(req: Request, res: Response) {
    const messages = await Message.find();

    return res.status(200).json({
      data: messages,
    });
  }
}
