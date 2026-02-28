import { Router } from "express";
import {
  listarFilmes,
  buscarFilme,
  criarFilme,
  atualizarFilme,
  deletarFilme,
} from "../controllers/filmeController";
import { authMiddleware } from "../middlewares/auth";

const router = Router();

// Públicas
router.get("/", listarFilmes);
router.get("/:id", buscarFilme);

// Autenticadas (em produção, adicionar verificação de admin)
router.post("/", authMiddleware, criarFilme);
router.put("/:id", authMiddleware, atualizarFilme);
router.delete("/:id", authMiddleware, deletarFilme);

export default router;
