import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../prisma/client"
import { AuthRequest } from "../middlewares/auth";

export async function register(req: Request, res: Response): Promise<void> {
  try {
    const { nome, email, senha } = req.body;

    if (!nome || !email || !senha) {
      res.status(400).json({ error: "nome, email e senha são obrigatórios" });
      return;
    }

    const userExiste = await prisma.user.findUnique({ where: { email } });
    if (userExiste) {
      res.status(409).json({ error: "Email já cadastrado" });
      return;
    }

    const senhaHash = await bcrypt.hash(senha, 10);

    const user = await prisma.user.create({
      data: { nome, email, senha: senhaHash },
      select: { id: true, nome: true, email: true, createdAt: true },
    });

    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: "Erro interno do servidor" });
  }
}

export async function login(req: Request, res: Response): Promise<void> {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      res.status(400).json({ error: "email e senha são obrigatórios" });
      return;
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      res.status(401).json({ error: "Credenciais inválidas" });
      return;
    }

    const senhaCorreta = await bcrypt.compare(senha, user.senha);
    if (!senhaCorreta) {
      res.status(401).json({ error: "Credenciais inválidas" });
      return;
    }

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: { id: user.id, nome: user.nome, email: user.email },
    });
  } catch (error) {
    res.status(500).json({ error: "Erro interno do servidor" });
  }
}

export async function getMe(req: AuthRequest, res: Response): Promise<void> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: {
        id: true,
        nome: true,
        email: true,
        createdAt: true,
        alugados: {
          include: { filme: true },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!user) {
      res.status(404).json({ error: "Usuário não encontrado" });
      return;
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Erro interno do servidor" });
  }
}

export async function updateMe(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { nome, email, senha } = req.body;

    const data: { nome?: string; email?: string; senha?: string } = {};
    if (nome) data.nome = nome;
    if (email) data.email = email;
    if (senha) data.senha = await bcrypt.hash(senha, 10);

    const user = await prisma.user.update({
      where: { id: req.userId },
      data,
      select: { id: true, nome: true, email: true, updatedAt: true },
    });

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Erro interno do servidor" });
  }
}

export async function deleteMe(req: AuthRequest, res: Response): Promise<void> {
  try {
    await prisma.user.delete({ where: { id: req.userId } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Erro interno do servidor" });
  }
}
