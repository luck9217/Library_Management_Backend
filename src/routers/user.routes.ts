import { Router } from "express";
import { getUserToken } from "../config/controllers/user.controllers";
import { getUserNewPass } from "../config/controllers/user.controllers";

const router = Router();

//Token Catched to confirm account link
router.get("/api/user/confirm/:token", getUserToken);

//Token Catched to changed password link
router.get("/api/user/newpass/:token", getUserNewPass);

export default router;
