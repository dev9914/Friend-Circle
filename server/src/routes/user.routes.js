import { Router } from "express";
import { login, logout, signup } from "../controllers/user.controller.js";

const router = Router()

router.post("/signup", signup)
router.post("/signin", login)
router.post("/logout", logout)

export default router