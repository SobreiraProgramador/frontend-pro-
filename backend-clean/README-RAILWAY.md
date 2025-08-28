# 🚂 Railway Deploy Instructions

## ⚠️ Conta Railway - Verificação Necessária

Para fazer deploy no Railway, você precisa:

1. **Acesse:** https://railway.com/account/plans
2. **Adicione um cartão de crédito** (necessário mesmo no plano gratuito)
3. **Escolha "Hobby Plan"** - permanece gratuito com $5/mês

## 🔧 Deploy via GitHub (Recomendado)

1. **Faça push do código para GitHub**
2. **No Railway Dashboard:**
   - Clique em "New Project"
   - Selecione "Deploy from GitHub repo"
   - Escolha o repositório `backend-pro`
   - Railway detecta Node.js automaticamente

## 🎯 Variáveis de Ambiente Configuradas

✅ **DATABASE_URL** - Configurado automaticamente pelo PostgreSQL
✅ **JWT_SECRET** - Configurado via CLI
✅ **NODE_ENV** - Configurado via CLI  
✅ **PORT** - Configurado via CLI

## 🚀 URLs do Projeto

**Projeto Railway:** https://railway.com/project/8bbda1e7-b8f2-45ea-a8ed-0b8feab5e0ba

## 📋 Próximos Passos

1. Verificar conta Railway
2. Deploy backend via GitHub
3. Deploy frontend 
4. Testar WebSockets
5. Configurar domínio customizado (opcional)

## 🔗 WebSockets

✅ **WebSocket Server** já configurado em `realtime-sync.js`
✅ **CORS** configurado para Railway
✅ **PostgreSQL** incluído no projeto
