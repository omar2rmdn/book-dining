import { Router } from "express";
import { login, register, logout, refresh, profile } from "./controller";
import { auth } from "../../middleware/auth";

const router = Router();

router.post("/login", login);
router.post("/register", register);
router.post("/logout", auth, logout);
router.post("/refresh", refresh);
router.get("/profile", auth, profile);

export { router as authRouter };
