import Router from "express";
const router = Router();
import checkAdmin from "../Middlewares/checkAdmin";
import subscriberController from "../Controllers/subscribersController";
router.post("/create", subscriberController.sendsubscriber);
router.delete("/:id", checkAdmin, subscriberController.deleteSub);
router.get("/", checkAdmin, subscriberController.findAllsubscriber);

export default router;
