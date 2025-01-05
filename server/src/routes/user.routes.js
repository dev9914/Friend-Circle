import { Router } from "express";
import { getuser, getuserbyId, login, logout, signup } from "../controllers/user.controller.js";
import protectRoute from "../middleware/protectedRoute.js";

const router = Router()

router.post("/signup", signup)
router.post("/signin", login)
router.post("/logout", logout)
router.get("/getuser",protectRoute, getuser )
router.get("/getuserbyId/:userId", getuserbyId )

export default router