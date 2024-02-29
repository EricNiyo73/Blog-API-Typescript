import Router from "express";
const router = Router();
import MessageController from "../Controllers/MessageController";
router.post("/create", MessageController.sendMessage);
router.delete("/:id", MessageController.deleteM);
router.get("/:id", MessageController.findOneMessage);
router.get("/", MessageController.findAllMessage);

export default router;
