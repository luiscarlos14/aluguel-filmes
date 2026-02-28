import { Request, Response } from "express";
import prisma from "../prisma";
import { AuthRequest } from "../middlewares/auth";

export async function alugarFilme(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { filmeId } = req.body;

    if (!filmeId) {
      res.status(400).json({ error: "filmeId é obrigatório" });
      return;
    }

    // Verifica se o filme existe e está disponível
    const filme = await prisma.filme.findUnique({ where: { id: filmeId } });

    if (!filme) {
      res.status(404).json({ error: "Filme não encontrado" });
      return;
    }

    if (!filme.disponivel) {
      res.status(409).json({ error: "Filme indisponível para aluguel" });
      return;
    }

    // Verifica se o usuário já tem esse filme alugado
    const jaAlugado = await prisma.alugado.findFirst({
      where: { userId: req.userId, filmeId, status: "ATIVO" },
    });

    if (jaAlugado) {
      res.status(409).json({ error: "Você já tem esse filme alugado" });
      return;
    }

    // Cria o aluguel e marca o filme como indisponível
    const [alugado] = await prisma.$transaction([
      prisma.alugado.create({
        data: { userId: req.userId!, filmeId },
        include: { filme: true, user: { select: { id: true, nome: true } } },
      }),
      prisma.filme.update({
        where: { id: filmeId },
        data: { disponivel: false },
      }),
    ]);

    res.status(201).json(alugado);
  } catch (error) {
    res.status(500).json({ error: "Erro interno do servidor" });
  }
}

export async function devolverFilme(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;

    const alugado = await prisma.alugado.findUnique({
      where: { id },
      include: { filme: true },
    });

    if (!alugado) {
      res.status(404).json({ error: "Aluguel não encontrado" });
      return;
    }

    if (alugado.userId !== req.userId) {
      res.status(403).json({ error: "Sem permissão para devolver este aluguel" });
      return;
    }

    if (alugado.status !== "ATIVO") {
      res.status(409).json({ error: "Este aluguel já foi devolvido" });
      return;
    }

    const dataDevolucao = new Date();
    const diasAlugados = Math.ceil(
      (dataDevolucao.getTime() - alugado.dataAluguel.getTime()) / (1000 * 60 * 60 * 24)
    );
    const valorTotal = Number(alugado.filme.precoDiaria) * Math.max(diasAlugados, 1);

    // Atualiza o aluguel e libera o filme
    const [devolucao] = await prisma.$transaction([
      prisma.alugado.update({
        where: { id },
        data: { dataDevolucao, valorTotal, status: "DEVOLVIDO" },
        include: { filme: true, user: { select: { id: true, nome: true } } },
      }),
      prisma.filme.update({
        where: { id: alugado.filmeId },
        data: { disponivel: true },
      }),
    ]);

    res.json(devolucao);
  } catch (error) {
    res.status(500).json({ error: "Erro interno do servidor" });
  }
}

export async function listarMeusAlugueis(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { status } = req.query;

    const alugueis = await prisma.alugado.findMany({
      where: {
        userId: req.userId,
        ...(status && { status: String(status) as "ATIVO" | "DEVOLVIDO" | "ATRASADO" }),
      },
      include: { filme: true },
      orderBy: { createdAt: "desc" },
    });

    res.json(alugueis);
  } catch (error) {
    res.status(500).json({ error: "Erro interno do servidor" });
  }
}

export async function listarTodosAlugueis(req: Request, res: Response): Promise<void> {
  try {
    const { status } = req.query;

    const alugueis = await prisma.alugado.findMany({
      where: {
        ...(status && { status: String(status) as "ATIVO" | "DEVOLVIDO" | "ATRASADO" }),
      },
      include: {
        filme: true,
        user: { select: { id: true, nome: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(alugueis);
  } catch (error) {
    res.status(500).json({ error: "Erro interno do servidor" });
  }
}

export async function buscarAluguel(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;

    const alugado = await prisma.alugado.findUnique({
      where: { id },
      include: {
        filme: true,
        user: { select: { id: true, nome: true, email: true } },
      },
    });

    if (!alugado) {
      res.status(404).json({ error: "Aluguel não encontrado" });
      return;
    }

    if (alugado.userId !== req.userId) {
      res.status(403).json({ error: "Sem permissão" });
      return;
    }

    res.json(alugado);
  } catch (error) {
    res.status(500).json({ error: "Erro interno do servidor" });
  }
}
