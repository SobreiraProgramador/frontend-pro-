# 🏁 Planner Pro - Backend API

Backend API REST para o sistema Planner Pro - Sistema completo de planejamento pessoal.

## 🚀 Tecnologias

- **Node.js** + **Express** - Framework web
- **Prisma** - ORM para banco de dados
- **PostgreSQL** - Banco de dados (produção)
- **SQLite** - Banco de dados (desenvolvimento local)
- **JWT** - Autenticação
- **Socket.io** - Tempo real
- **bcryptjs** - Hash de senhas

## 📋 Funcionalidades

- ✅ **Autenticação**: Login/Registro + JWT
- ✅ **Projetos**: CRUD completo com categorias
- ✅ **Metas**: Sistema de objetivos e progresso  
- ✅ **Finanças**: Controle de receitas e despesas
- ✅ **Viagens**: Planejamento e controle de custos
- ✅ **Calendário**: Eventos e compromissos
- ✅ **Carreira**: Histórico profissional
- ✅ **Planejamento Financeiro**: Metas financeiras
- ✅ **Tempo Real**: Sincronização via WebSocket

## 🌐 Deploy

- **Produção**: Vercel + PostgreSQL (Supabase)
- **Desenvolvimento**: Local + SQLite

## 📊 Endpoints API

### Autenticação
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Registro
- `POST /api/auth/google` - Login Google

### Recursos (todos autenticados)
- `GET|POST|PUT|DELETE /api/goals` - Metas
- `GET|POST|PUT|DELETE /api/projects` - Projetos  
- `GET|POST|PUT|DELETE /api/finances` - Finanças
- `GET|POST|PUT|DELETE /api/travels` - Viagens
- `GET|POST|PUT|DELETE /api/calendar` - Calendário
- `GET|POST|PUT|DELETE /api/career` - Carreira
- `GET|POST|PUT|DELETE /api/financial-planning` - Planejamento

### Utilitários
- `GET /api/health` - Status da API
- `POST /api/import/travels` - Importar planilha viagens
- `POST /api/import/finances` - Importar planilha financeira

## 🔧 Desenvolvimento Local

```bash
# Instalar dependências
npm install

# Configurar ambiente
cp env.example .env
# Edite .env com suas configurações

# Configurar banco SQLite
npm run db:setup

# Executar em desenvolvimento
npm run dev
```

## 🌍 Variáveis de Ambiente

```env
# Banco de dados
DATABASE_URL="postgresql://..." # Produção
DATABASE_URL="file:./dev.db"    # Local

# JWT
JWT_SECRET="your-secret-key"

# Servidor
PORT=3001
NODE_ENV="production"
```

## 📡 CORS

Configurado para aceitar:
- Frontend em produção (Vercel)
- Desenvolvimento local (localhost:5173)

## 🔗 Links

- **Frontend**: [Planner Pro Frontend](https://github.com/SobreiraProgramador/frontend-pro-)
- **API Produção**: [https://backend-pro.vercel.app](https://backend-pro.vercel.app)
- **Health Check**: [https://backend-pro.vercel.app/api/health](https://backend-pro.vercel.app/api/health)

---

**Desenvolvido por SobreiraProgramador** 🚀