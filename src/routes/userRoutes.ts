import { Router } from "express";
import { register, login, getMe, updateMe, deleteMe } from "../controllers/userController";
import { authMiddleware } from "../middlewares/auth";

const router = Router();

// Públicas
router.post("/register", register);
router.post("/login", login);

// Autenticadas
router.get("/me", authMiddleware, getMe);
router.put("/me", authMiddleware, updateMe);
router.delete("/me", authMiddleware, deleteMe);

export default router;
