import { Router } from "express";
import { loginController, promoteController, registerController } from "../controllers/users.controller.js";
import { tokenAuthMiddleware } from "../middleware/auth.middleware.js";
import { adminAuthMiddleware } from "../middleware/auth.middleware.js";
import { getAllUsers } from "../services/users.service.js";
import { validateMiddleware } from "../middleware/validate.middleware.js";
import { loginUserSchema, registerUserSchema, userIdParamSchema } from "../validations/users.validations.js";
import { catchAsync } from "../utils/catch-async.js";

const router = Router();

router.post("/login", validateMiddleware(loginUserSchema), catchAsync(loginController));

router.post("/register", validateMiddleware(registerUserSchema), catchAsync(registerController));

router.use(tokenAuthMiddleware);

router.get("/", (req, res) => {
    res.json(getAllUsers());
});

router.post("/promote/:id", validateMiddleware(userIdParamSchema), adminAuthMiddleware, promoteController);

export default router;
