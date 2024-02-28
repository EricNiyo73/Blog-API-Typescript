import { Router, Request, Response } from "express";
import User, { UserDocument } from "../Models/userModel";
import { validateUser, validatelogin } from "../Models/userModel";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// LOGIN
export default class UserController {
  static async login(req: Request, res: Response) {
    try {
      const { error } = validatelogin(req.body);
      if (error) {
        return res.status(400).send(error.details[0].message);
      }
      const user = await User.findOne({
        email: req.body.email,
      });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const validated: boolean = await bcrypt.compare(
        req.body.password,
        user.password
      );

      if (!validated) {
        return res.status(401).json({ message: "Wrong credentials" });
      } else {
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "", {
          expiresIn: "1d",
        });
        return res.status(200).json({
          message: "Logged in successfully",
          token: token,
        });
      }
    } catch (error: any) {
      return res.status(500).json(error);
    }
  }
  //SIGNUP
  // ===================================================
  static async signup(req: Request, res: Response) {
    try {
      const { error } = validateUser(req.body);
      if (error) {
        return res.status(400).send(error.details[0].message);
      }
      const salt = await bcrypt.genSalt(10);
      const hashedpassword = await bcrypt.hash(req.body.password, salt);
      const existingUser = await User.findOne({ email: req.body.email });
      if (existingUser) {
        return res.status(409).json({
          message: "This user already exists",
        });
      }
      const newUser = new User({
        fullName: req.body.fullName,
        email: req.body.email,
        password: hashedpassword,
      });

      const saveUser = await newUser.save();
      const token = jwt.sign(
        { id: saveUser._id },
        process.env.JWT_SECRET || "",
        {
          expiresIn: process.env.JWT_EXPIRES_IN || "1d",
        }
      );
      return res.status(201).json({
        user: saveUser,
        token: token,
        message: "User successfully added",
      });
    } catch (error) {
      return res.status(500).json(error);
    }
  }

  //other oprations

  //UPDATE User
  static async updateT(req: Request, res: Response) {
    try {
      const UserId = req.params.id;
      const user = await User.findById(UserId);
      if (!user) {
        return res.status(400).json({
          status: "failed",
          message: "Id of a User not found",
        });
      }
      const updatedUser = await User.findByIdAndUpdate(
        { _id: UserId },
        {
          fullName: req.body.fullName,
          email: req.body.email,
          password: req.body.password,
        },
        { new: true }
      );
      return res.status(200).json({
        updatedUser,
        message: "your User was successfully updated",
      });
    } catch (error) {
      return res.status(500).json(error);
    }
  }

  //DELETE User
  static async deleteT(req: Request, res: Response) {
    try {
      const id = req.params.id;

      const user = await User.findById(id);
      if (!user) {
        return res.status(400).json({
          status: "failed",
          message: "Id of a User not found",
        });
      } else {
        await User.findByIdAndDelete(id);
        return res.status(204).json({
          status: "success",
          message: "User deleted ............",
        });
      }
    } catch (err) {
      return res.status(500).json(err);
    }
  }

  //GET User
  static async findOneUser(req: Request, res: Response) {
    try {
      const user = await User.findById(req.params.id);
      return res.status(200).json(user);
    } catch (err) {
      return res.status(500).json(err);
    }
  }

  //GET ALL Users
  static async findAllUser(req: Request, res: Response) {
    try {
      const Users = await User.find();

      return res.status(200).json({
        data: Users,
      });
    } catch (err) {
      return res.status(500).json(err);
    }
  }
}
