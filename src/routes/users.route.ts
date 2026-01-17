import { Router } from "express";
import { loginToUser, registerAUser } from "../controllers/users.controller.js";

const router = Router();

router.get("/login", loginToUser);

router.post("/register", registerAUser);

export default router;
