import { Router } from "express";
import { signUpController, signInController, promoteController, refreshController, signOutController } from "../controllers/users.controller.js";
import { tokenAuthMiddleware } from "../middleware/auth.middleware.js";
import { adminAuthMiddleware } from "../middleware/auth.middleware.js";
import { validateMiddleware } from "../middleware/validate.middleware.js";
import { loginUserSchema, refreshTokenSchema, registerUserSchema, userIdParamSchema } from "../validations/users.validations.js";
import { catchAsync } from "../utils/catch-async.js";
import { UsersRepository } from "../repositories/users.repository.js";

const router = Router();

router.post("/signup", validateMiddleware(registerUserSchema), catchAsync(signUpController));
router.post("/signin", validateMiddleware(loginUserSchema), catchAsync(signInController));
router.post("/signout", validateMiddleware(refreshTokenSchema), tokenAuthMiddleware("refresh"), catchAsync(signOutController));
router.post("/refresh", validateMiddleware(refreshTokenSchema), tokenAuthMiddleware("refresh"), catchAsync(refreshController));


router.use(tokenAuthMiddleware('access'));

router.get("/", async (req, res) => {
    res.json(await UsersRepository.getAllUsers());
});

router.post("/promote/:id", validateMiddleware(userIdParamSchema), adminAuthMiddleware, promoteController);

export default router;
