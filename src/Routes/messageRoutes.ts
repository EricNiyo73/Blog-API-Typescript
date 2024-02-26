import Router from "express";
const router = Router();
import MessageController from "../Controllers/MessageController";
router.post("/signup", MessageController.sendMessage);
router.delete("/:id", MessageController.deleteM);
router.get("/:id", MessageController.findOneMessage);
router.get("/login", MessageController.findAllMessage);

export default router;
