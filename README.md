# 🎬 API de Aluguel de Filmes

API REST com Node.js, TypeScript e Prisma para gerenciamento de usuários, filmes e aluguéis.

## 📦 Tecnologias

- **Node.js** + **TypeScript**
- **Express** — framework HTTP
- **Prisma** — ORM com PostgreSQL
- **JWT** — autenticação
- **bcryptjs** — hash de senhas

## 🗄️ Banco de Dados

### Tabelas

| Tabela     | Descrição                              |
|------------|----------------------------------------|
| `users`    | Usuários cadastrados                   |
| `filmes`   | Catálogo de filmes disponíveis         |
| `alugados` | Registros de aluguéis (pivot table)    |

---

## 🚀 Como Rodar

### 1. Instalar dependências
```bash
npm install
```

### 2. Configurar variáveis de ambiente
```bash
cp .env.example .env
# Edite o .env com suas credenciais do PostgreSQL
```

### 3. Rodar migrations
```bash
npx prisma migrate dev --name init
```

### 4. Iniciar em desenvolvimento
```bash
npm run dev
```

---

## 📡 Endpoints

### 👤 Usuários `/api/users`

| Método | Rota        | Auth | Descrição              |
|--------|-------------|------|------------------------|
| POST   | `/register` | ❌   | Cadastrar usuário      |
| POST   | `/login`    | ❌   | Login (retorna token)  |
| GET    | `/me`       | ✅   | Ver meu perfil         |
| PUT    | `/me`       | ✅   | Atualizar perfil       |
| DELETE | `/me`       | ✅   | Deletar conta          |

### 🎬 Filmes `/api/filmes`

| Método | Rota    | Auth | Descrição                           |
|--------|---------|------|-------------------------------------|
| GET    | `/`     | ❌   | Listar filmes (filtros: genero, disponivel, titulo) |
| GET    | `/:id`  | ❌   | Buscar filme por ID                 |
| POST   | `/`     | ✅   | Criar filme                         |
| PUT    | `/:id`  | ✅   | Atualizar filme                     |
| DELETE | `/:id`  | ✅   | Deletar filme                       |

### 📋 Aluguéis `/api/alugueis`

| Método | Rota              | Auth | Descrição                    |
|--------|-------------------|------|------------------------------|
| POST   | `/`               | ✅   | Alugar filme                 |
| GET    | `/meus`           | ✅   | Meus aluguéis                |
| GET    | `/todos`          | ❌   | Todos os aluguéis            |
| GET    | `/:id`            | ✅   | Buscar aluguel por ID        |
| PATCH  | `/:id/devolver`   | ✅   | Devolver filme               |

---

## 📝 Exemplos de Uso

### Cadastrar usuário
```bash
curl -X POST http://localhost:3000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{"nome": "João Silva", "email": "joao@email.com", "senha": "123456"}'
```

### Login
```bash
curl -X POST http://localhost:3000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email": "joao@email.com", "senha": "123456"}'
```

### Criar filme (autenticado)
```bash
curl -X POST http://localhost:3000/api/filmes \
  -H "Authorization: Bearer SEU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "titulo": "Interestelar",
    "genero": "Ficção Científica",
    "anoLancamento": 2014,
    "duracao": 169,
    "precoDiaria": 9.90
  }'
```

### Alugar filme
```bash
curl -X POST http://localhost:3000/api/alugueis \
  -H "Authorization: Bearer SEU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"filmeId": "uuid-do-filme"}'
```

### Devolver filme
```bash
curl -X PATCH http://localhost:3000/api/alugueis/UUID_ALUGUEL/devolver \
  -H "Authorization: Bearer SEU_TOKEN"
```

---

## 🧩 Scripts Prisma

```bash
npx prisma migrate dev     # Criar/aplicar migrations
npx prisma studio          # Interface visual do banco
npx prisma generate        # Gerar client após mudanças no schema
```
