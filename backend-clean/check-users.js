const { PrismaClient } = require('@prisma/client');

async function checkUsers() {
  const prisma = new PrismaClient();
  
  try {
    console.log('👥 Verificando usuários no banco...');
    
    const users = await prisma.user.findMany();
    console.log('📋 Usuários encontrados:', users.length);
    
    users.forEach(user => {
      console.log(`👤 Usuário: ${user.email} (ID: ${user.id})`);
    });
    
    if (users.length > 0) {
      const firstUser = users[0];
      console.log('\n🎯 Testando com o primeiro usuário...');
      
      const goals = await prisma.goal.findMany({
        where: { userId: firstUser.id }
      });
      
      console.log(`📋 Metas encontradas: ${goals.length}`);
      
      goals.forEach(goal => {
        console.log(`🎯 Meta: ${goal.title} (ID: ${goal.id})`);
        console.log(`📋 Goals: ${goal.goals}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Erro:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkUsers();

