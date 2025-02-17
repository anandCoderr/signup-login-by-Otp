import express from "express";
import { register,verifyLogin } from "../Controllers/AuthController.js";
import {sendOtpForLoginController} from '../Controllers/OtpController.js'


import {userPost,getUserPosts,likeAndDislike} from '../Controllers/userPostController.js'

import upload from '../Helper/imgUploadHelper.js'

// -----------middleware Function


import userAuthMiddleware from '../Middleware/userAuthMiddleware.js'

// ---------route starts

const router = express.Router();

router.post("/register", register);
router.post("/login", sendOtpForLoginController);
router.post("/login/verify", verifyLogin);






// --------------- user posts route

router.post('/post',userAuthMiddleware,upload.array('images', 12),userPost);
router.get('/get/posts',getUserPosts);
router.get('/get/posts?search',getUserPosts);

// --------------post like and dislike route
router.post('/post/like-dislike',userAuthMiddleware,likeAndDislike);



export default router;