import Router from "express";
const router = Router();
import UserController from "../Controllers/userController";
router.post("/signup", UserController.signup);
router.post("/login", UserController.login);
router.delete("/:id", UserController.deleteT);
router.put("/:id", UserController.updateT);
router.get("/:id", UserController.findOneUser);
router.get("/login", UserController.findAllUser);

export default router;
