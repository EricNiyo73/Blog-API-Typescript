import { Router, Request, Response } from "express";
import Subscriber, { subscriberDocument } from "../Models/subscribersModel";
import { validatesubscriber } from "../Models/subscribersModel";

export default class subscriberController {
  // ===================================================
  static async sendsubscriber(req: Request, res: Response) {
    const { error } = validatesubscriber(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }
    const subscribe = await Subscriber.findOne({ email: req.body.email });
    if (subscribe) {
      return res.status(409).json({ message: " you have already subscribed" });
    }
    const newsubscriber = new Subscriber({
      email: req.body.email,
    });

    const savesubscriber = await newsubscriber.save();
    return res.status(201).json({
      subscriber: savesubscriber,
      statusbar: "subscriber successfully sent",
    });
  }

  static async deleteSub(req: Request, res: Response) {
    const id = req.params.id;

    const subscriber = await Subscriber.findById(id);
    if (!subscriber) {
      return res.status(400).json({
        message: "Id of a subscriber not found",
      });
    } else {
      await Subscriber.findByIdAndDelete(id);
      return res.status(204).json({
        message: "subscriber deleted ............",
      });
    }
  }

  static async findAllsubscriber(req: Request, res: Response) {
    const subscribers = await Subscriber.find();
    return res.status(200).json({
      data: subscribers,
    });
  }
}
