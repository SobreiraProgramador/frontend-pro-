const { PrismaClient } = require('@prisma/client');

let prisma = null;

async function getPrismaClient() {
  if (prisma) {
    return prisma;
  }

  try {
    console.log('🔗 Conectando ao Prisma...');
    
    prisma = new PrismaClient({
      log: ['query', 'info', 'warn', 'error'],
      datasources: {
        db: {
          url: process.env.DATABASE_URL || 'file:./dev.db'
        }
      }
    });

    // Testar conexão
    await prisma.$connect();
    console.log('✅ Prisma conectado com sucesso!');
    
    return prisma;
  } catch (error) {
    console.error('❌ Erro ao conectar Prisma:', error);
    prisma = null;
    throw error;
  }
}

async function disconnectPrisma() {
  if (prisma) {
    await prisma.$disconnect();
    prisma = null;
    console.log('🔌 Prisma desconectado');
  }
}

module.exports = {
  getPrismaClient,
  disconnectPrisma
};
