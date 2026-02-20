import usersRoute from "./users.route.js";
import tasksRoute from "./tasks.route.js";
import { Router } from "express";

const router = Router();

router.use('/users', usersRoute);
router.use('/tasks', tasksRoute);

export default router;