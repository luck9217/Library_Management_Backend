import { Router } from "express";
import { getUserToken } from "../config/controllers/user.controllers";

const router = Router();

//Token Catched
router.get("/api/user/confirm/:token", getUserToken);

export default router;
