import Router from "express";
const router = Router();
import checkAdmin from "../Middlewares/checkAdmin";
import verrify from "../Middlewares/mustHaveAccount";
import MessageController from "../Controllers/MessageController";
router.post("/create", MessageController.sendMessage);
router.delete("/:id", checkAdmin, MessageController.deleteM);
router.get("/:id", checkAdmin, MessageController.findOneMessage);
router.get("/", checkAdmin, MessageController.findAllMessage);

export default router;
