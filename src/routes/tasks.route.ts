import { Router } from "express";
import { adminAuthMiddleware, tokenAuthMiddleware } from "../middleware/auth.middleware.js";
import { validateMiddleware } from "../middleware/validate.middleware.js";
import { createTaskAsAdminSchema, createTaskSchema, taskIdParamSchema, updateTaskSchema } from "../validations/tasks.validation.js";
import { createTaskController, deleteTaskController, getTaskController, getTasksForUserController, updateTaskController } from "../controllers/tasks.controller.js";
import { catchAsync } from "../utils/catch-async.js";

const router = Router();

router.use(tokenAuthMiddleware);

// Router for Users
router.get("/", catchAsync(getTasksForUserController));
router.get("/:id", catchAsync(getTaskController));
router.post("/", validateMiddleware(createTaskSchema), catchAsync(createTaskController));
router.patch("/:id", validateMiddleware(updateTaskSchema), catchAsync(updateTaskController));
router.delete("/:id", validateMiddleware(taskIdParamSchema), deleteTaskController);

// Router for Admins
router.use(adminAuthMiddleware);

router.get("/user/:userId", validateMiddleware(taskIdParamSchema), catchAsync(getTasksForUserController));
router.post("/:id", validateMiddleware(createTaskAsAdminSchema), catchAsync(createTaskController));
router.patch("/:id", validateMiddleware(updateTaskSchema), catchAsync(updateTaskController));
router.delete("/:id", validateMiddleware(taskIdParamSchema), catchAsync(deleteTaskController));



export default router;