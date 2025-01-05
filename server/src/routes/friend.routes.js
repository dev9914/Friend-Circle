import { Router } from "express";
import { acceptFriendRequest, recommendFriends, rejectFriendRequest, searchUsers, sendFriendRequest } from "../controllers/friend.controller.js";
import protectRoute from "../middleware/protectedRoute.js";

const router = Router()

router.get('/search',protectRoute,searchUsers)
router.post('/friend-request',protectRoute, sendFriendRequest);
router.post('/accept-request',protectRoute, acceptFriendRequest);
router.post('/reject-request',protectRoute, rejectFriendRequest);
router.get('/recommendations',protectRoute, recommendFriends);

export default router