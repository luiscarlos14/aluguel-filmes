import { Request, Response } from "express";
import { prisma } from "../prisma/client"

export async function listarFilmes(req: Request, res: Response): Promise<void> {
  try {
    const { genero, disponivel, titulo } = req.query;

    const filmes = await prisma.filme.findMany({
      where: {
        ...(genero && { genero: { contains: String(genero), mode: "insensitive" } }),
        ...(disponivel !== undefined && { disponivel: disponivel === "true" }),
        ...(titulo && { titulo: { contains: String(titulo), mode: "insensitive" } }),
      },
      orderBy: { titulo: "asc" },
    });

    res.json(filmes);
  } catch (error) {
    res.status(500).json({ error: "Erro interno do servidor" });
  }
}

export async function buscarFilme(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;

    const filme = await prisma.filme.findUnique({
      where: { id },
      include: {
        alugados: {
          include: { user: { select: { id: true, nome: true } } },
          orderBy: { createdAt: "desc" },
          take: 5,
        },
      },
    });

    if (!filme) {
      res.status(404).json({ error: "Filme não encontrado" });
      return;
    }

    res.json(filme);
  } catch (error) {
    res.status(500).json({ error: "Erro interno do servidor" });
  }
}

export async function criarFilme(req: Request, res: Response): Promise<void> {
  try {
    const { titulo, descricao, genero, anoLancamento, duracao, precoDiaria } = req.body;

    if (!titulo || !genero || !anoLancamento || !duracao || !precoDiaria) {
      res.status(400).json({
        error: "titulo, genero, anoLancamento, duracao e precoDiaria são obrigatórios",
      });
      return;
    }

    const filme = await prisma.filme.create({
      data: { titulo, descricao, genero, anoLancamento, duracao, precoDiaria },
    });

    res.status(201).json(filme);
  } catch (error) {
    res.status(500).json({ error: "Erro interno do servidor" });
  }
}

export async function atualizarFilme(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const { titulo, descricao, genero, anoLancamento, duracao, precoDiaria, disponivel } = req.body;

    const filme = await prisma.filme.update({
      where: { id },
      data: { titulo, descricao, genero, anoLancamento, duracao, precoDiaria, disponivel },
    });

    res.json(filme);
  } catch (error) {
    res.status(500).json({ error: "Erro interno do servidor" });
  }
}

export async function deletarFilme(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    await prisma.filme.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Erro interno do servidor" });
  }
}
