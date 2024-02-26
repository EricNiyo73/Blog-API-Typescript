import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User, { UserDocument } from "../Models/userModel";

import dotenv from "dotenv";
dotenv.config();
declare global {
  namespace Express {
    interface Request {
      user?: UserDocument;
    }
  }
}

const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response<any, Record<string, any>> | void> => {
  try {
    const token: string | undefined = req.headers.authorization;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized, please Login" });
    }

    const decodedToken: any = jwt.verify(token, process.env.JWT_SECRET || "");

    if (!decodedToken || typeof decodedToken !== "object" || !decodedToken.id) {
      return res.status(401).json({ message: "Invalid token" });
    }

    const user: UserDocument | null = await User.findById(decodedToken.id);

    if (user) {
      req.user = user;
      next();
    } else {
      return res.status(401).json({ message: "Please create an account" });
    }
  } catch (err: any) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired" });
    } else if (err.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token" });
    } else {
      return res.status(401).json({ message: "Unauthorized, please Login" });
    }
  }
};

export default authMiddleware;
