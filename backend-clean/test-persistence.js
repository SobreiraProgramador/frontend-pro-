const { PrismaClient } = require('@prisma/client');

async function testPersistence() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🧪 Testando persistência de goals...');
    
    // Buscar uma meta existente
    const goal = await prisma.goal.findFirst({
      where: {
        userId: 'cmf1r01ki00ban0dmguycpnvv' // ID do usuário de teste
      }
    });
    
    if (!goal) {
      console.log('❌ Nenhuma meta encontrada para teste');
      return;
    }
    
    console.log('📋 Meta encontrada:', goal.title);
    console.log('📋 Goals atuais:', goal.goals);
    
    // Simular atualização de um sub-objetivo
    const currentGoals = goal.goals || [];
    const updatedGoals = currentGoals.map(goalStr => {
      const goalObj = JSON.parse(goalStr);
      if (goalObj.id === 1756769409840) { // ID do sub-objetivo "react"
        goalObj.done = true;
      }
      return JSON.stringify(goalObj);
    });
    
    console.log('🔄 Goals atualizados:', updatedGoals);
    
    // Salvar no banco
    const updatedGoal = await prisma.goal.update({
      where: { id: goal.id },
      data: {
        goals: updatedGoals,
        progress: 50
      }
    });
    
    console.log('✅ Meta atualizada no banco');
    console.log('📋 Goals salvos:', updatedGoal.goals);
    
    // Verificar se foi salvo corretamente
    const verification = await prisma.goal.findUnique({
      where: { id: goal.id }
    });
    
    console.log('🔍 Verificação - Goals recuperados:', verification.goals);
    
    // Verificar se o sub-objetivo está marcado como done
    const reactGoal = verification.goals.find(g => {
      const obj = JSON.parse(g);
      return obj.id === 1756769409840;
    });
    
    if (reactGoal) {
      const reactObj = JSON.parse(reactGoal);
      console.log('🎯 Sub-objetivo "react" - done:', reactObj.done);
    }
    
  } catch (error) {
    console.error('❌ Erro no teste:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testPersistence();
