import { Router } from "express";
import { loginController, promoteController, registerController } from "../controllers/users.controller.js";
import { tokenAuthMiddleware } from "../middleware/token.auth.js";
import { adminAuthMiddleware } from "../middleware/admin.auth.js";
import { getAllUsers } from "../services/users.service.js";

const router = Router();

router.get("/login", loginController);

router.post("/register", registerController);

router.get("/", (req, res) => {
    res.json(getAllUsers());
});

router.use(tokenAuthMiddleware);

router.post("/promote/:id", adminAuthMiddleware, promoteController);

export default router;
