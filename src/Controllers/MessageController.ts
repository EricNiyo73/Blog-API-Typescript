import { Router, Request, Response } from "express";
import Message, { MessageDocument } from "../Models/messageModel";
import { validateMessage } from "../Models/messageModel";

export default class MessageController {
  // ===================================================
  static async sendMessage(req: Request, res: Response) {
    try {
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
    } catch (error) {
      return res.status(500).json(error);
    }
  }

  //DELETE message
  static async deleteM(req: Request, res: Response) {
    try {
      const id = req.params.id;

      const message = await Message.findById(id);
      if (!message) {
        return res.status(400).json({
          status: "failed",
          message: "Id of a message not found",
        });
      } else {
        await Message.findByIdAndDelete(id);
        return res.status(204).json({
          status: "success",
          message: "message deleted ............",
        });
      }
    } catch (err) {
      return res.status(500).json(err);
    }
  }

  //GET message
  static async findOneMessage(req: Request, res: Response) {
    try {
      const message = await Message.findById(req.params.id);
      if (message) {
        return res.status(200).json(message);
      } else {
        return res.status(404).json({ message: "message not found" });
      }
    } catch (err) {
      return res.status(500).json(err);
    }
  }

  //GET ALL messages
  static async findAllMessage(req: Request, res: Response) {
    try {
      const messages = await Message.find();
      if (messages) {
        return res.status(200).json({
          data: messages,
        });
      } else {
        return res.status(404).json({ message: "No messages found" });
      }
    } catch (err) {
      return res.status(500).json(err);
    }
  }
}
