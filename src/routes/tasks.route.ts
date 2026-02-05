import { Router } from "express";
import { adminAuthMiddleware, tokenAuthMiddleware } from "../middleware/auth.middleware.js";
import { validateMiddleware } from "../middleware/validate.middleware.js";
import { createTaskAsAdminSchema, createTaskSchema, filteringAndPagination, taskIdParamSchema, updateTaskSchema } from "../validations/tasks.validation.js";
import { createTaskController, deleteTaskController, getTaskController, getTasksController, updateTaskController } from "../controllers/tasks.controller.js";
import { catchAsync } from "../utils/catch-async.js";

const router = Router();

router.use(tokenAuthMiddleware);

// Router for Admins

router.get("/user/:userId", adminAuthMiddleware, validateMiddleware({ ...taskIdParamSchema, ...filteringAndPagination }), catchAsync(getTasksController));
router.post("/user/:userId", adminAuthMiddleware, validateMiddleware(createTaskAsAdminSchema), catchAsync(createTaskController));

// Router for Users

// GET
router.get("/", validateMiddleware(filteringAndPagination), catchAsync(getTasksController));
router.get("/:taskId", catchAsync(getTaskController));

// POST/PATCH/DELETE
router.post("/", validateMiddleware(createTaskSchema), catchAsync(createTaskController));
router.patch("/:taskId", validateMiddleware(updateTaskSchema), catchAsync(updateTaskController));
router.delete("/:taskId", validateMiddleware(taskIdParamSchema), deleteTaskController);



export default router;