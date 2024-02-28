import Router from "express";
const router = Router();
import authentication from "../Middlewares/mustHaveAccount";
import CommentController from "../Controllers/CommentController";
router.post("/add-comment/:blogId", CommentController.addComment);
router.post("/like/:blogId", authentication, CommentController.likeBlog);
export default router;
