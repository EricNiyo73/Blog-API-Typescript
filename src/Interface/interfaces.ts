import { Request } from "express";
import { UserDocument } from "../Models/userModel";

interface RequestWithUser extends Request {
  user?: UserDocument;
}

export default RequestWithUser;
