# Planner Pro - Sistema Completo

Sistema de planejamento pessoal completo com frontend React e backend Node.js.

## 🚀 Estrutura do Projeto

```
copia-para-testes/
├── frontend/          # Aplicação React (Vite)
├── backend/           # API Node.js (Express)
└── README.md          # Este arquivo
```

## 📋 Pré-requisitos

- Node.js 18+ 
- npm ou yarn
- Git

## 🛠️ Setup Local

### 🚀 Execução Rápida (Recomendado)

#### Windows:
```bash
# 1. Setup inicial (execute apenas uma vez)
.\setup-local.bat

# 2. Executar projeto (abre 2 janelas automaticamente)
.\run-project.bat

# OU executar separadamente:
.\start-backend.bat   # Em uma janela
.\start-frontend.bat  # Em outra janela
```

#### Linux/Mac:
```bash
# 1. Setup inicial (execute apenas uma vez)
chmod +x *.sh
./setup-local.sh

# 2. Executar projeto
./run-local.sh
```

### 🔧 Execução Manual

#### 1. Backend
```bash
cd backend-clean
cp env.local.example .env  # Configurar variáveis de ambiente
npm install                # Instalar dependências
npm run db:setup          # Configurar banco SQLite
npm run dev               # Executar (porta 3001)
```

#### 2. Frontend  
```bash
cd frontend
cp env.local.example .env.local  # Configurar variáveis de ambiente
npm install                      # Instalar dependências
npm run dev                     # Executar (porta 5173)
```

### 🌐 URLs Locais
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:3001
- **Health Check**: http://localhost:3001/api/health

### 👤 Login de Teste
- **Email**: teste@planner.com  
- **Senha**: 123456

## 🌐 Deploy

### Frontend (Vercel)

```bash
cd frontend
vercel --prod
```

### Backend (Vercel)

```bash
cd backend
vercel --prod
```

## 🔧 Configuração

### Variáveis de Ambiente

Crie um arquivo `.env` no backend:

```env
DATABASE_URL="sua_url_do_banco"
JWT_SECRET="seu_jwt_secret"
GOOGLE_CLIENT_ID="seu_google_client_id"
GOOGLE_CLIENT_SECRET="seu_google_client_secret"
```

## 📱 Funcionalidades

- ✅ Autenticação (Login/Registro)
- ✅ Gerenciamento de Projetos
- ✅ Planejamento Financeiro
- ✅ Metas e Objetivos
- ✅ Calendário de Eventos
- ✅ Viagens
- ✅ Carreira
- ✅ Relatórios e Analytics
- ✅ Configurações

## 🎨 Tecnologias

### Frontend
- React 18
- Vite
- Tailwind CSS
- Lucide React (Ícones)
- React Router

### Backend
- Node.js
- Express
- Prisma (ORM)
- JWT (Autenticação)
- Passport (OAuth)
- bcryptjs (Hash)

## 📊 Status

- ✅ Sistema funcionando localmente
- ✅ Frontend e backend integrados
- ✅ Deploy configurado
- ✅ CORS configurado
- ✅ Autenticação funcionando

## 🔗 Links

- **Frontend**: [URL do Vercel]
- **Backend**: [URL do Vercel]
- **Repositório**: https://github.com/Wellevelton/copia-para-testes.git

## 👨‍💻 Desenvolvimento

Para continuar o desenvolvimento:

1. Clone o repositório
2. Configure as variáveis de ambiente
3. Execute `npm install` em ambos os diretórios
4. Execute `npm run dev` para desenvolvimento local

## 📝 Licença

Este projeto está sob a licença MIT.

