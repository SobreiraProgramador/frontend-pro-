# 🗄️ Configurar Novo Banco de Dados

## 🎯 Opções de Banco (Escolha uma):

### 1. 🟢 Supabase (Recomendado)
- **Site**: https://supabase.com
- **Login**: Use GitHub (SobreiraProgramador)
- **Grátis**: 2 projetos, 500MB, 2GB transferência

### 2. 🟡 Neon (Alternativa)
- **Site**: https://neon.tech
- **Login**: Use GitHub (SobreiraProgramador)  
- **Grátis**: 10GB, auto-suspend

### 3. 🔵 Railway (Alternativa)
- **Site**: https://railway.app
- **Login**: Use GitHub (SobreiraProgramador)
- **Grátis**: $5/mês de crédito

## 📋 Passos para Supabase (Recomendado):

### 1. Criar Projeto
1. Acesse: https://supabase.com
2. **Sign in** → GitHub (SobreiraProgramador)
3. **New Project**
4. **Nome**: `planner-pro-db`
5. **Senha**: `PlannerPro2024!` (anote essa senha!)
6. **Região**: South America (São Paulo)
7. **Create new project**

### 2. Obter String de Conexão
1. No projeto criado → **Settings** (engrenagem)
2. **Database** (na sidebar)
3. **Connection string** → **URI**
4. Copiar a URL que aparece (será algo como):
```
postgresql://postgres.xyz:[PASSWORD]@aws-0-sa-east-1.pooler.supabase.com:6543/postgres?sslmode=require
```

### 3. Cole a URL aqui quando conseguir:
```
DATABASE_URL="[COLE AQUI A URL DO SEU NOVO BANCO]"
```

## ⚡ Após conseguir a URL:

1. **Me informe a URL** e eu atualizo automaticamente
2. **Faço deploy** com o novo banco
3. **Testo tudo** funcionando
4. **Projeto finalizado!**

---

**🎯 Qual opção você prefere? Supabase, Neon ou Railway?**
**Ou você já tem um banco configurado em outro lugar?**
