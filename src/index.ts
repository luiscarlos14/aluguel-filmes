import express from "express";
import userRoutes from "./routes/userRoutes";
import filmeRoutes from "./routes/filmeRoutes";
import alugadoRoutes from "./routes/alugadoRoutes";

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares globais
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rotas
app.use("/api/users", userRoutes);
app.use("/api/filmes", filmeRoutes);
app.use("/api/alugueis", alugadoRoutes);

// Health check
app.get("/health", (_, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// 404
app.use((_, res) => {
  res.status(404).json({ error: "Rota não encontrada" });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/health`);
});

export default app;
