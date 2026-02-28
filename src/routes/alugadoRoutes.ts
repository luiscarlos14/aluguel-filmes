import { Router } from "express";
import {
  alugarFilme,
  devolverFilme,
  listarMeusAlugueis,
  listarTodosAlugueis,
  buscarAluguel,
} from "../controllers/alugadoController";
import { authMiddleware } from "../middlewares/auth";

const router = Router();

// Todas autenticadas
router.post("/", authMiddleware, alugarFilme);
router.get("/meus", authMiddleware, listarMeusAlugueis);
router.get("/todos", listarTodosAlugueis); // poderia ser admin only
router.get("/:id", authMiddleware, buscarAluguel);
router.patch("/:id/devolver", authMiddleware, devolverFilme);

export default router;
