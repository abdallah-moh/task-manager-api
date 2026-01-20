import { Router } from "express";
import { adminAuthMiddleware, tokenAuthMiddleware } from "../middleware/auth.middleware.js";
import { validateMiddleware } from "../middleware/validate.middleware.js";
import { createTaskAsAdminSchema, createTaskSchema, taskIdParamSchema, updateTaskSchema } from "../validations/tasks.validation.js";
import { createTaskController, deleteTaskController, getTasksController, updateTaskController } from "../controllers/tasks.controller.js";

const router = Router();

router.use(tokenAuthMiddleware);

// Router for Users
router.get("/", getTasksController);
router.post("/", validateMiddleware(createTaskSchema), createTaskController);
router.patch("/:id", validateMiddleware(updateTaskSchema), updateTaskController);
router.delete("/:id", validateMiddleware(taskIdParamSchema), deleteTaskController);

// Router for Admins
router.use(adminAuthMiddleware);

router.get("/:id", validateMiddleware(taskIdParamSchema), getTasksController);
router.post("/:id", validateMiddleware(createTaskAsAdminSchema), createTaskController);
router.patch("/:id", validateMiddleware(updateTaskSchema), updateTaskController);
router.delete("/:id", validateMiddleware(taskIdParamSchema), deleteTaskController);



export default router;