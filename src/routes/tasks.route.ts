import { Router } from "express";
import { adminAuthMiddleware, tokenAuthMiddleware } from "../middleware/auth.middleware.js";
import { validateMiddleware } from "../middleware/validate.middleware.js";
import { createTaskAsAdminSchema, createTaskSchema, filteringAndPagination, taskIdParamSchema, updateTaskSchema } from "../validations/tasks.validation.js";
import { createTaskController, deleteTaskController, getTaskController, getTasksController, updateTaskController } from "../controllers/tasks.controller.js";
import { catchAsync } from "../utils/catch-async.js";

const router = Router();

router.use(tokenAuthMiddleware);

// Router for Users

// GET
router.get("/", validateMiddleware(filteringAndPagination), catchAsync(getTasksController));
router.get("/:id", catchAsync(getTaskController));

// POST/PATCH/DELETE
router.post("/", validateMiddleware(createTaskSchema), catchAsync(createTaskController));
router.patch("/:id", validateMiddleware(updateTaskSchema), catchAsync(updateTaskController));
router.delete("/:id", validateMiddleware(taskIdParamSchema), deleteTaskController);

// Router for Admins
router.use(adminAuthMiddleware);

router.get("/user/:userId", validateMiddleware({ ...taskIdParamSchema, ...filteringAndPagination }), catchAsync(getTasksController));
router.post("/:id", validateMiddleware(createTaskAsAdminSchema), catchAsync(createTaskController));
router.delete("/:id", validateMiddleware(taskIdParamSchema), catchAsync(deleteTaskController));



export default router;