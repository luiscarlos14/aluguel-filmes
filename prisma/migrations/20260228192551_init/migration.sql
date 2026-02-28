-- CreateEnum
CREATE TYPE "Status" AS ENUM ('ATIVO', 'DEVOLVIDO', 'ATRASADO');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "filmes" (
    "id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT,
    "genero" TEXT NOT NULL,
    "anoLancamento" INTEGER NOT NULL,
    "duracao" INTEGER NOT NULL,
    "precoDiaria" DECIMAL(10,2) NOT NULL,
    "disponivel" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "filmes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "alugados" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "filmeId" TEXT NOT NULL,
    "dataAluguel" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataDevolucao" TIMESTAMP(3),
    "valorTotal" DECIMAL(10,2),
    "status" "Status" NOT NULL DEFAULT 'ATIVO',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "alugados_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "alugados" ADD CONSTRAINT "alugados_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "alugados" ADD CONSTRAINT "alugados_filmeId_fkey" FOREIGN KEY ("filmeId") REFERENCES "filmes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
