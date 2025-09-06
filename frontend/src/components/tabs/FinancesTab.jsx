import React, { useState, useEffect } from 'react';
import { Plus, Import, Save, DollarSign, TrendingUp, AlertCircle, Edit, Target, Zap, Globe, Calendar, Trash2 } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import NewTransactionModal from '../modals/NewTransactionModal';
import FinancialPlanningTab from './FinancialPlanningTab';
import apiService from '../../services/api';

const FinancesTab = ({ 
  activeSubTab, 
  setActiveSubTab, 
  finances, 
  setFinances, 
  budget, 
  setBudget, 
  editingBudget, 
  setEditingBudget,
  planilhaFinanceira,
  planilhaFinanceiraState,
  setPlanilhaFinanceiraState
}) => {
  const [showNewTransactionModal, setShowNewTransactionModal] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [deletingTransaction, setDeletingTransaction] = useState(null);
  
  // Estados para paginação
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6); // 6 cards por página (2 linhas de 3)
  const [selectedYear, setSelectedYear] = useState(2026);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  
  // Estados para filtros da aba "Planejado vs Realizado"
  const [comparisonYear, setComparisonYear] = useState(new Date().getFullYear());
  const [comparisonMonth, setComparisonMonth] = useState(new Date().getMonth() + 1); // último mês por padrão
  
  // Estado para mês atual (detecção automática)
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  
  // Detecção automática de mudança de mês
  useEffect(() => {
    const checkMonthChange = () => {
      const now = new Date();
      const newMonth = now.getMonth() + 1;
      const newYear = now.getFullYear();
      
      if (newMonth !== currentMonth || newYear !== currentYear) {
        console.log('🔄 [AUTO] Mês mudou automaticamente:', { 
          from: `${currentMonth}/${currentYear}`, 
          to: `${newMonth}/${newYear}` 
        });
        
        setCurrentMonth(newMonth);
        setCurrentYear(newYear);
        
        // Atualizar filtros para o mês atual
        setSelectedMonth(newMonth);
        setSelectedYear(newYear);
      }
    };
    
    // Verificar a cada minuto
    const interval = setInterval(checkMonthChange, 60000);
    
    // Verificar imediatamente
    checkMonthChange();
    
    return () => clearInterval(interval);
  }, [currentMonth, currentYear]);

  // Resetar página quando filtros mudarem
  useEffect(() => {
    setCurrentPage(1);
  }, [comparisonYear, comparisonMonth]);
  
  // Funções para cálculos automáticos dos cards
  const getFinalGoal = () => {
    if (!planilhaFinanceira || planilhaFinanceira.length === 0) return 0;
    const lastMonth = planilhaFinanceira[planilhaFinanceira.length - 1];
    return lastMonth.saldoAcum || 0;
  };

  const getMaxIncome = () => {
    if (!planilhaFinanceira || planilhaFinanceira.length === 0) return 0;
    const maxIncome = Math.max(...planilhaFinanceira.map(item => item.rendaTotal || 0));
    return maxIncome;
  };

  const getMaxIncomeMonth = () => {
    if (!planilhaFinanceira || planilhaFinanceira.length === 0) return '';
    const maxIncome = Math.max(...planilhaFinanceira.map(item => item.rendaTotal || 0));
    const maxMonth = planilhaFinanceira.find(item => item.rendaTotal === maxIncome);
    return maxMonth ? maxMonth.mes : '';
  };

  const getGrowthPercentage = () => {
    if (!planilhaFinanceira || planilhaFinanceira.length < 2) return 0;
    const firstIncome = planilhaFinanceira[0].rendaTotal || 0;
    const lastIncome = planilhaFinanceira[planilhaFinanceira.length - 1].rendaTotal || 0;
    if (firstIncome === 0) return 0;
    return Math.round(((lastIncome - firstIncome) / firstIncome) * 100);
  };

  const getTravelCount = () => {
    // Contar viagens únicas baseado nos dados de viagens
    // Por enquanto retorna 52 como na imagem, mas pode ser calculado dinamicamente
    return 52;
  };

  // Finance functions - filtradas por mês atual
  const getTotalIncome = () => {
    return finances
      .filter(item => {
        const itemDate = new Date(item.date);
        const itemYear = itemDate.getFullYear();
        const itemMonth = itemDate.getMonth() + 1;
        return item.type === 'income' && itemYear === currentYear && itemMonth === currentMonth;
      })
      .reduce((sum, item) => sum + item.amount, 0);
  };

  const getTotalExpenses = () => {
    return Math.abs(finances
      .filter(item => {
        const itemDate = new Date(item.date);
        const itemYear = itemDate.getFullYear();
        const itemMonth = itemDate.getMonth() + 1;
        return item.type === 'expense' && itemYear === currentYear && itemMonth === currentMonth;
      })
      .reduce((sum, item) => sum + item.amount, 0));
  };

  const getBalance = () => {
    return getTotalIncome() - getTotalExpenses();
  };

  const addNewTransaction = async (transaction) => {
    try {
      // Salvar no backend
      const savedTransaction = await apiService.finances.create(transaction);
      setFinances(prev => [...prev, savedTransaction.data]);
    } catch (error) {
      console.error('❌ Erro ao salvar transação no backend:', error);
      alert('❌ Erro ao salvar transação. Verifique sua conexão.');
      return; // Não salvar localmente se backend falhar
    }
    setShowNewTransactionModal(false);
  };

  const handleEditTransaction = (transaction) => {
    setEditingTransaction(transaction);
    setShowNewTransactionModal(true);
  };

  const handleDeleteTransaction = async (transactionId) => {
    if (!confirm('Tem certeza que deseja excluir esta transação?')) {
      return;
    }

    try {
      await apiService.finances.delete(transactionId);
      setFinances(prev => prev.filter(t => t.id !== transactionId));
      setDeletingTransaction(null);
    } catch (error) {
      console.error('❌ Erro ao excluir transação:', error);
      alert('❌ Erro ao excluir transação. Verifique sua conexão.');
    }
  };

  // Funções de paginação
  const getPaginatedData = (data) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return data.slice(startIndex, endIndex);
  };

  const getTotalPages = (data) => {
    return Math.ceil(data.length / itemsPerPage);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    const totalPages = getTotalPages(realizedTransactions);
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const renderTransactions = () => {
    const totalIncome = getTotalIncome();
    const totalExpenses = getTotalExpenses();
    const balance = getBalance();
    
          return (
        <div className="space-y-6 auto-scroll" style={{maxHeight: 'calc(100vh - 200px)', paddingBottom: '2rem'}}>
          {/* Header com botões de ação */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">Transações Financeiras</h2>
            <p className="text-sm text-gray-400 mt-1">
              {new Date(currentYear, currentMonth - 1).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
            </p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setShowNewTransactionModal(true)}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Plus size={16} />
              Nova Transação
            </button>
          </div>
        </div>
        
        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-green-600/80 to-green-800/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-green-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">Receitas</p>
                <p className="text-white text-2xl font-bold">
                  {formatCurrency(totalIncome)}
                </p>
                <p className="text-green-200 text-xs mt-1">↗ +12% este mês</p>
              </div>
              <div className="bg-green-500 bg-opacity-30 p-3 rounded-lg">
                <TrendingUp className="text-green-100" size={24} />
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-red-600/80 to-red-800/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-red-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-100 text-sm font-medium">Despesas</p>
                <p className="text-white text-2xl font-bold">
                  {formatCurrency(totalExpenses)}
                </p>
                <p className="text-red-200 text-xs mt-1">↘ -8% este mês</p>
              </div>
              <div className="bg-red-500 bg-opacity-30 p-3 rounded-lg">
                <DollarSign className="text-red-100" size={24} />
              </div>
            </div>
          </div>
          
          <div className={`bg-gradient-to-br ${balance >= 0 ? 'from-blue-600/80 to-blue-800/80' : 'from-orange-600/80 to-orange-800/80'} backdrop-blur-sm rounded-xl p-6 shadow-lg border ${balance >= 0 ? 'border-blue-500/20' : 'border-orange-500/20'}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`${balance >= 0 ? 'text-blue-100' : 'text-orange-100'} text-sm font-medium`}>Saldo</p>
                <p className="text-white text-2xl font-bold">
                  {formatCurrency(balance)}
                </p>
                <p className={`${balance >= 0 ? 'text-blue-200' : 'text-orange-200'} text-xs mt-1`}>
                  {balance >= 0 ? '✅ Saldo positivo' : '⚠ Atenção ao saldo'}
                </p>
              </div>
              <div className={`${balance >= 0 ? 'bg-blue-500' : 'bg-orange-500'} bg-opacity-30 p-3 rounded-lg`}>
                <AlertCircle className={`${balance >= 0 ? 'text-blue-100' : 'text-orange-100'}`} size={24} />
              </div>
            </div>
          </div>
        </div>
        
        {/* Transactions List */}
        <div className="bg-gray-800/40 backdrop-blur-md rounded-xl p-4 md:p-6 shadow-lg border border-gray-700/30">
          <div className="overflow-y-auto max-h-[350px] pr-8">
          <h3 className="text-white font-semibold mb-4 text-lg">Transações Recentes</h3>
          <div className="space-y-4">
            {finances
              .filter(transaction => {
                const transactionDate = new Date(transaction.date);
                const transactionYear = transactionDate.getFullYear();
                const transactionMonth = transactionDate.getMonth() + 1;
                return transactionYear === currentYear && transactionMonth === currentMonth;
              })
              .slice(-10)
              .reverse()
              .map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg hover:bg-gray-600/50 transition-all duration-200 backdrop-blur-sm">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    transaction.type === 'income' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                  }`}>
                    {transaction.type === 'income' ? '↗' : '↘'}
                  </div>
                  <div>
                    <p className="text-white font-medium">{transaction.description}</p>
                    <p className="text-gray-400 text-sm">{transaction.category}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-semibold ${transaction.type === 'income' ? 'text-green-400' : 'text-red-400'}`}>
                    {formatCurrency(Math.abs(transaction.amount))}
                  </p>
                  <p className="text-gray-400 text-sm">{new Date(transaction.date).toLocaleDateString('pt-BR')}</p>
                </div>
              </div>
            ))}
          </div>
          </div>
        </div>
      </div>
    );
  };

  const renderBudget = () => {
    const categories = budget.monthly?.categories || {};
    
    // Calcular gastos reais das transações do mês/ano selecionado
    const getActualExpenses = (category) => {
      return finances
        .filter(item => 
          item.type === 'expense' && 
          item.category === category &&
          new Date(item.date).getFullYear() === selectedYear &&
          new Date(item.date).getMonth() + 1 === selectedMonth
        )
        .reduce((sum, item) => sum + Math.abs(item.amount), 0);
    };

    // Obter dados planejados da planilha para o mês/ano selecionado
    const getPlannedData = () => {
      const monthKey = `${selectedYear}-${selectedMonth.toString().padStart(2, '0')}`;
      const plannedData = planilhaFinanceira.find(item => item.mes === monthKey);
      return plannedData ? plannedData.gastos : 0;
    };

    // Obter dados planejados por categoria (distribuindo o gasto total)
    const getPlannedDataByCategory = (category) => {
      const totalPlanned = getPlannedData();
      const categoryPercentages = {
        'Educação': 0.15,
        'Viagem': 0.25,
        'Moradia': 0.20,
        'Alimentação': 0.15,
        'Transporte': 0.10,
        'Lazer': 0.05,
        'Saúde': 0.05,
        'Emergência': 0.05
      };
      return totalPlanned * (categoryPercentages[category] || 0.05);
    };
    
    return (
      <div className="space-y-6 auto-scroll" style={{maxHeight: 'calc(100vh - 200px)', paddingBottom: '2rem'}}>
                 <div className="flex items-center justify-between">
           <h2 className="text-2xl font-bold text-white">Orçamento</h2>
           <div className="flex items-center gap-4">
             <div className="flex items-center gap-2">
               <label className="text-gray-300 text-sm font-medium">Mês:</label>
               <select
                 value={selectedMonth}
                 onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                 className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-1 text-white focus:outline-none focus:border-blue-500"
               >
                 {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(month => (
                   <option key={month} value={month}>
                     {new Date(2024, month - 1).toLocaleDateString('pt-BR', { month: 'long' })}
                   </option>
                 ))}
               </select>
             </div>
             <div className="flex items-center gap-2">
               <label className="text-gray-300 text-sm font-medium">Ano:</label>
               <select
                 value={selectedYear}
                 onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                 className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-1 text-white focus:outline-none focus:border-blue-500"
               >
                 {[2026, 2027, 2028].map(year => (
                   <option key={year} value={year}>{year}</option>
                 ))}
               </select>
             </div>
           </div>
         </div>
        
                          {/* Resumo Geral */}
         <div className="mb-6">
           <div className="bg-gray-800/40 backdrop-blur-md rounded-xl p-6 shadow-lg border border-gray-700/30">
             <h3 className="text-white font-semibold text-lg mb-4">Resumo Geral</h3>
             <div className="space-y-3">
               <div className="flex justify-between text-sm">
                 <span className="text-gray-400">Gasto Real:</span>
                 <span className="text-red-400 font-semibold">
                   {formatCurrency(finances
                     .filter(item => 
                       item.type === 'expense' &&
                       new Date(item.date).getFullYear() === selectedYear &&
                       new Date(item.date).getMonth() + 1 === selectedMonth
                     )
                     .reduce((sum, item) => sum + Math.abs(item.amount), 0)
                   )}
                 </span>
               </div>
               <div className="flex justify-between text-sm">
                 <span className="text-gray-400">Planejado:</span>
                 <span className="text-blue-400 font-semibold">
                   {formatCurrency(getPlannedData())}
                 </span>
               </div>
               <div className="text-xs text-gray-500 mt-2">
                 <p>💡 Gasto Real: Baseado nas transações registradas</p>
                 <p>📊 Planejado: Baseado na planilha financeira</p>
               </div>
               <div className="w-full bg-gray-700 rounded-full h-3">
                 <div 
                   className={`h-3 rounded-full transition-all ${
                     finances
                       .filter(item => 
                         item.type === 'expense' &&
                         new Date(item.date).getFullYear() === selectedYear &&
                         new Date(item.date).getMonth() + 1 === selectedMonth
                       )
                       .reduce((sum, item) => sum + Math.abs(item.amount), 0) > getPlannedData() 
                       ? 'bg-gradient-to-r from-red-500 to-red-600' 
                       : 'bg-gradient-to-r from-green-500 to-green-600'
                   }`}
                   style={{ 
                     width: `${Math.min((finances
                       .filter(item => 
                         item.type === 'expense' &&
                         new Date(item.date).getFullYear() === selectedYear &&
                         new Date(item.date).getMonth() + 1 === selectedMonth
                       )
                       .reduce((sum, item) => sum + Math.abs(item.amount), 0) / getPlannedData()) * 100, 100)}%` 
                   }}
                 ></div>
               </div>
             </div>
           </div>
         </div>

                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-8">
           {Object.entries(categories).map(([category, data]) => {
             const actual = getActualExpenses(category);
             const planned = getPlannedDataByCategory(category);
             const percentage = planned > 0 ? (actual / planned) * 100 : 0;
             const isOverBudget = actual > planned;
            
            return (
              <div key={category} className="bg-gray-800/40 backdrop-blur-md rounded-xl p-4 shadow-lg border border-gray-700/30 hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-white font-semibold text-base">{category}</h3>
                  {editingBudget && (
                    <button className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-gray-700 transition-colors">
                      <Edit size={16} />
                    </button>
                  )}
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Gasto:</span>
                    <span className={`font-semibold ${isOverBudget ? 'text-red-400' : 'text-white'}`}>
                      {formatCurrency(actual)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Planejado:</span>
                    <span className="text-gray-300 font-medium">{formatCurrency(planned)}</span>
                  </div>
                  
                  <div className="w-full bg-gray-700 rounded-full h-3">
                    <div 
                      className={`h-3 rounded-full transition-all ${isOverBudget ? 'bg-gradient-to-r from-red-500 to-red-600' : 'bg-gradient-to-r from-green-500 to-green-600'}`}
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    ></div>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">{percentage.toFixed(0)}% usado</span>
                    <span className={`font-medium ${isOverBudget ? 'text-red-400' : 'text-green-400'}`}>
                      {formatCurrency(planned - actual)} restante
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderPlanning = () => {
    return (
      <FinancialPlanningTab 
        planilhaFinanceiraState={planilhaFinanceiraState}
        setPlanilhaFinanceiraState={setPlanilhaFinanceiraState}
      />
    );
  };

  const renderRealized = () => {
    // Filtrar transações realizadas (com status 'completed', 'realized', 'done' ou sem status)
    const allRealizedTransactions = finances.filter(transaction => 
      transaction.status === 'completed' || 
      transaction.status === 'realized' || 
      transaction.status === 'done' ||
      transaction.status === undefined ||
      transaction.status === null
    );

    // Filtrar por período selecionado
    const realizedTransactions = filterTransactionsByPeriod(allRealizedTransactions, comparisonYear, comparisonMonth);

    // Calcular totais
    const totalIncome = realizedTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + (t.amount || 0), 0);
    
    const totalExpenses = realizedTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + (t.amount || 0), 0);

    const netResult = totalIncome - totalExpenses;

    // Gerar opções de anos (últimos 5 anos + próximos 2 anos)
    const currentYear = new Date().getFullYear();
    const yearOptions = [];
    for (let year = currentYear - 5; year <= currentYear + 2; year++) {
      yearOptions.push(year);
    }

    // Opções de meses
    const monthOptions = [
      { value: null, label: 'Ano inteiro' },
      { value: 1, label: 'Janeiro' },
      { value: 2, label: 'Fevereiro' },
      { value: 3, label: 'Março' },
      { value: 4, label: 'Abril' },
      { value: 5, label: 'Maio' },
      { value: 6, label: 'Junho' },
      { value: 7, label: 'Julho' },
      { value: 8, label: 'Agosto' },
      { value: 9, label: 'Setembro' },
      { value: 10, label: 'Outubro' },
      { value: 11, label: 'Novembro' },
      { value: 12, label: 'Dezembro' }
    ];

    // Título dinâmico baseado no período selecionado
    const getPeriodTitle = () => {
      if (comparisonMonth === null) {
        return `Transações Realizadas - ${comparisonYear}`;
      } else {
        const monthName = monthOptions.find(m => m.value === comparisonMonth)?.label;
        return `Transações Realizadas - ${monthName} ${comparisonYear}`;
      }
    };

    return (
      <div className="space-y-6">
        {/* Filtros de período */}
        <div className="bg-gray-800/40 backdrop-blur-md rounded-lg p-6 shadow-lg border border-gray-700/30">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">{getPeriodTitle()}</h3>
            <div className="flex gap-4">
              {/* Filtro por ano */}
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-400">Ano:</label>
                <select
                  value={comparisonYear}
                  onChange={(e) => setComparisonYear(parseInt(e.target.value))}
                  className="bg-gray-700 text-white px-3 py-1 rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                >
                  {yearOptions.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>

              {/* Filtro por mês */}
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-400">Mês:</label>
                <select
                  value={comparisonMonth || ''}
                  onChange={(e) => setComparisonMonth(e.target.value === '' ? null : parseInt(e.target.value))}
                  className="bg-gray-700 text-white px-3 py-1 rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                >
                  {monthOptions.map(month => (
                    <option key={month.value || 'all'} value={month.value || ''}>{month.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Resumo dos valores realizados */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-green-900/30 border border-green-500/30 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-400 text-sm font-medium">Receitas Realizadas</p>
                <p className="text-2xl font-bold text-green-300">{formatCurrency(totalIncome)}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-400" />
            </div>
          </div>
          
          <div className="bg-red-900/30 border border-red-500/30 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-400 text-sm font-medium">Despesas Realizadas</p>
                <p className="text-2xl font-bold text-red-300">{formatCurrency(totalExpenses)}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-red-400 rotate-180" />
            </div>
          </div>
          
          <div className={`${netResult >= 0 ? 'bg-green-900/30 border-green-500/30' : 'bg-red-900/30 border-red-500/30'} border rounded-lg p-4`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`${netResult >= 0 ? 'text-green-400' : 'text-red-400'} text-sm font-medium`}>
                  Resultado Líquido
                </p>
                <p className={`text-2xl font-bold ${netResult >= 0 ? 'text-green-300' : 'text-red-300'}`}>
                  {formatCurrency(netResult)}
                </p>
              </div>
              <DollarSign className={`h-8 w-8 ${netResult >= 0 ? 'text-green-400' : 'text-red-400'}`} />
            </div>
          </div>
        </div>

        {/* Cards de transações realizadas - estilo Berlim */}
        <div className="bg-gray-800/40 backdrop-blur-md rounded-xl p-6 shadow-lg border border-gray-700/30">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">Transações Realizadas</h3>
            <span className="text-sm text-gray-400">{realizedTransactions.length} transações</span>
          </div>
          
          {realizedTransactions.length === 0 ? (
            <div className="text-center py-8">
              <AlertCircle className="h-12 w-12 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400">Nenhuma transação realizada encontrada</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {getPaginatedData(realizedTransactions).map(transaction => (
                <div key={transaction.id} className="bg-gray-800/60 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg border border-gray-700/30 hover:border-gray-600/50 transition-all duration-200">
                  {/* Header colorido */}
                  <div className={`${transaction.type === 'income' ? 'bg-gradient-to-r from-blue-600 to-blue-700' : 'bg-gradient-to-r from-orange-600 to-orange-700'} p-4`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-white font-bold text-lg">{transaction.description}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Calendar size={14} className="text-blue-200" />
                          <span className="text-blue-200 text-sm">
                            {new Date(transaction.date).toLocaleDateString('pt-BR')}
                          </span>
                        </div>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${transaction.type === 'income' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                        {transaction.type === 'income' ? 'Receita' : 'Despesa'}
                      </div>
                    </div>
                  </div>
                  
                  {/* Corpo do card */}
                  <div className="p-4 bg-gray-800/40">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400 text-sm">Categoria:</span>
                        <span className="text-white text-sm font-medium">{transaction.category}</span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400 text-sm">Valor:</span>
                        <span className={`text-lg font-bold ${transaction.type === 'income' ? 'text-green-400' : 'text-red-400'}`}>
                          {transaction.type === 'income' ? '+' : '-'}{formatCurrency(Math.abs(transaction.amount))}
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400 text-sm">Status:</span>
                        <span className="text-green-400 text-sm font-medium">Realizado</span>
                      </div>
                    </div>
                    
                    {/* Botões de ação */}
                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={() => handleEditTransaction(transaction)}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                      >
                        <Edit size={14} />
                        Editar
                      </button>
                      <button
                        onClick={() => handleDeleteTransaction(transaction.id)}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                      >
                        <Trash2 size={14} />
                        Excluir
                      </button>
                    </div>
                  </div>
                </div>
                ))}
              </div>
              
              {/* Controles de paginação */}
              {getTotalPages(realizedTransactions) > 1 && (
                <div className="flex items-center justify-center gap-4 mt-8">
                  <button
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      currentPage === 1
                        ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    Anterior
                  </button>
                  
                  <div className="flex items-center gap-2">
                    {Array.from({ length: getTotalPages(realizedTransactions) }, (_, i) => i + 1).map(page => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          currentPage === page
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>
                  
                  <button
                    onClick={handleNextPage}
                    disabled={currentPage === getTotalPages(realizedTransactions)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      currentPage === getTotalPages(realizedTransactions)
                        ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    Próximo
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    );
  };

  // Função auxiliar para filtrar transações por período
  const filterTransactionsByPeriod = (transactions, year, month = null) => {
    return transactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      const transactionYear = transactionDate.getFullYear();
      const transactionMonth = transactionDate.getMonth() + 1; // getMonth() retorna 0-11
      
      if (month === null) {
        // Filtro por ano inteiro
        return transactionYear === year;
      } else {
        // Filtro por mês específico
        return transactionYear === year && transactionMonth === month;
      }
    });
  };

  // Função auxiliar para filtrar planilha financeira por período
  const filterPlanilhaByPeriod = (planilha, year, month = null) => {
    return planilha.filter(item => {
      if (!item.mes) return false;
      
      // Formato da planilha: "2026-01", "2026-02", etc.
      const parts = item.mes.split('-');
      const itemYear = parseInt(parts[0]);
      const itemMonth = parseInt(parts[1]);
      
      if (month === null) {
        // Filtro por ano inteiro
        return itemYear === year;
      } else {
        // Filtro por mês específico
        return itemYear === year && itemMonth === month;
      }
    });
  };

  const renderPlannedVsRealized = () => {
    // REALIZADO: Usar transações com status 'completed', 'realized', 'done' ou sem status (undefined)
    const allRealizedTransactions = finances.filter(transaction => 
      transaction.status === 'completed' || 
      transaction.status === 'realized' || 
      transaction.status === 'done' ||
      transaction.status === undefined ||
      transaction.status === null
    );

    // Filtrar transações realizadas por período selecionado
    const realizedTransactions = filterTransactionsByPeriod(allRealizedTransactions, comparisonYear, comparisonMonth);

    // Debug logs
    console.log('🔍 [COMPARISON DEBUG] Período selecionado:', { comparisonYear, comparisonMonth });
    console.log('🔍 [COMPARISON DEBUG] Total de transações:', finances.length);
    console.log('🔍 [COMPARISON DEBUG] Todas as transações:', finances);
    console.log('🔍 [COMPARISON DEBUG] Status das transações:', finances.map(t => ({ id: t.id, status: t.status, type: t.type, amount: t.amount, date: t.date })));
    console.log('🔍 [COMPARISON DEBUG] Status únicos encontrados:', [...new Set(finances.map(t => t.status))]);
    console.log('🔍 [COMPARISON DEBUG] Transações realizadas (todas):', allRealizedTransactions.length);
    console.log('🔍 [COMPARISON DEBUG] Transações realizadas (filtradas):', realizedTransactions.length);
    console.log('🔍 [COMPARISON DEBUG] Transações realizadas (detalhes):', realizedTransactions);

    // PLANEJADO: Usar dados da planilha financeira que já está funcionando
    const plannedData = planilhaFinanceira || [];
    const filteredPlanilha = filterPlanilhaByPeriod(plannedData, comparisonYear, comparisonMonth);
    
    // Calcular totais planejados (da planilha)
    const plannedIncome = filteredPlanilha.reduce((sum, item) => sum + (item.rendaTotal || 0), 0);
    const plannedExpenses = filteredPlanilha.reduce((sum, item) => sum + (item.gastos || 0), 0);
    
    console.log('🔍 [PLANNED DEBUG] Planilha filtrada:', filteredPlanilha);
    console.log('🔍 [PLANNED DEBUG] Renda planejada:', plannedIncome);
    console.log('🔍 [PLANNED DEBUG] Gastos planejados:', plannedExpenses);

    // Calcular totais realizados
    const realizedIncome = realizedTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + (t.amount || 0), 0);
    
    const realizedExpenses = realizedTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + (t.amount || 0), 0);

    // Calcular diferenças
    const incomeDiff = realizedIncome - plannedIncome;
    const expenseDiff = realizedExpenses - plannedExpenses;
    const netPlanned = plannedIncome - plannedExpenses;
    const netRealized = realizedIncome - realizedExpenses;
    const netDiff = netRealized - netPlanned;

    // Gerar opções de anos (últimos 5 anos + próximos 2 anos)
    const currentYear = new Date().getFullYear();
    const yearOptions = [];
    for (let year = currentYear - 5; year <= currentYear + 2; year++) {
      yearOptions.push(year);
    }

    // Opções de meses
    const monthOptions = [
      { value: null, label: 'Ano inteiro' },
      { value: 1, label: 'Janeiro' },
      { value: 2, label: 'Fevereiro' },
      { value: 3, label: 'Março' },
      { value: 4, label: 'Abril' },
      { value: 5, label: 'Maio' },
      { value: 6, label: 'Junho' },
      { value: 7, label: 'Julho' },
      { value: 8, label: 'Agosto' },
      { value: 9, label: 'Setembro' },
      { value: 10, label: 'Outubro' },
      { value: 11, label: 'Novembro' },
      { value: 12, label: 'Dezembro' }
    ];

    // Título dinâmico baseado no período selecionado
    const getPeriodTitle = () => {
      if (comparisonMonth === null) {
        return `Planejado vs Realizado - ${comparisonYear}`;
      } else {
        const monthName = monthOptions.find(m => m.value === comparisonMonth)?.label;
        return `Planejado vs Realizado - ${monthName} ${comparisonYear}`;
      }
    };

    return (
      <div className="space-y-6">
        {/* Filtros de período */}
        <div className="bg-gray-800/40 backdrop-blur-md rounded-lg p-6 shadow-lg border border-gray-700/30">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">{getPeriodTitle()}</h3>
            <div className="flex gap-4">
              {/* Filtro por ano */}
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-400">Ano:</label>
                <select
                  value={comparisonYear}
                  onChange={(e) => setComparisonYear(parseInt(e.target.value))}
                  className="bg-gray-700 text-white px-3 py-1 rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                >
                  {yearOptions.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>

              {/* Filtro por mês */}
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-400">Mês:</label>
                <select
                  value={comparisonMonth || ''}
                  onChange={(e) => setComparisonMonth(e.target.value === '' ? null : parseInt(e.target.value))}
                  className="bg-gray-700 text-white px-3 py-1 rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                >
                  {monthOptions.map(month => (
                    <option key={month.value || 'all'} value={month.value || ''}>{month.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Comparação de totais */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Receitas */}
          <div className="bg-gray-800/40 backdrop-blur-md rounded-lg p-6 shadow-lg border border-gray-700/30">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <TrendingUp className="h-5 w-5 text-green-400 mr-2" />
              Receitas {comparisonMonth ? `- ${monthOptions.find(m => m.value === comparisonMonth)?.label}` : `- ${comparisonYear}`}
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Planejado:</span>
                <span className="text-green-300 font-semibold">{formatCurrency(plannedIncome)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Realizado:</span>
                <span className="text-green-300 font-semibold">{formatCurrency(realizedIncome)}</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-gray-700">
                <span className="text-gray-400">Diferença:</span>
                <div className="text-right">
                  <span className={`font-semibold ${incomeDiff >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {incomeDiff >= 0 ? '+' : ''}{formatCurrency(incomeDiff)}
                  </span>
                  {plannedIncome > 0 && (
                    <div className={`text-xs ${incomeDiff >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      ({((incomeDiff / plannedIncome) * 100).toFixed(1)}%)
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Despesas */}
          <div className="bg-gray-800/40 backdrop-blur-md rounded-lg p-6 shadow-lg border border-gray-700/30">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <TrendingUp className="h-5 w-5 text-red-400 mr-2 rotate-180" />
              Despesas {comparisonMonth ? `- ${monthOptions.find(m => m.value === comparisonMonth)?.label}` : `- ${comparisonYear}`}
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Planejado:</span>
                <span className="text-red-300 font-semibold">{formatCurrency(plannedExpenses)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Realizado:</span>
                <span className="text-red-300 font-semibold">{formatCurrency(realizedExpenses)}</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-gray-700">
                <span className="text-gray-400">Diferença:</span>
                <div className="text-right">
                  <span className={`font-semibold ${expenseDiff <= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {expenseDiff >= 0 ? '+' : ''}{formatCurrency(expenseDiff)}
                  </span>
                  {plannedExpenses > 0 && (
                    <div className={`text-xs ${expenseDiff <= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      ({((expenseDiff / plannedExpenses) * 100).toFixed(1)}%)
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Resultado Líquido */}
        <div className="bg-gray-800/40 backdrop-blur-md rounded-lg p-6 shadow-lg border border-gray-700/30">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <DollarSign className="h-5 w-5 text-blue-400 mr-2" />
            Resultado Líquido
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-gray-400 text-sm">Planejado</p>
              <p className={`text-2xl font-bold ${netPlanned >= 0 ? 'text-green-300' : 'text-red-300'}`}>
                {formatCurrency(netPlanned)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-gray-400 text-sm">Realizado</p>
              <p className={`text-2xl font-bold ${netRealized >= 0 ? 'text-green-300' : 'text-red-300'}`}>
                {formatCurrency(netRealized)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-gray-400 text-sm">Diferença</p>
              <p className={`text-2xl font-bold ${netDiff >= 0 ? 'text-green-300' : 'text-red-300'}`}>
                {netDiff >= 0 ? '+' : ''}{formatCurrency(netDiff)}
              </p>
            </div>
          </div>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-800/40 backdrop-blur-md rounded-lg p-6 shadow-lg border border-gray-700/30">
            <h4 className="text-white font-semibold mb-3">Períodos Planejados</h4>
            <p className="text-3xl font-bold text-blue-400">{filteredPlanilha.length}</p>
            <p className="text-sm text-gray-400">Meses na planilha</p>
          </div>
          <div className="bg-gray-800/40 backdrop-blur-md rounded-lg p-6 shadow-lg border border-gray-700/30">
            <h4 className="text-white font-semibold mb-3">Transações Realizadas</h4>
            <p className="text-3xl font-bold text-green-400">{realizedTransactions.length}</p>
            <p className="text-sm text-gray-400">Total de transações</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Abas de navegação - sempre visíveis */}
      <div className="flex gap-1 bg-gray-800/40 backdrop-blur-md p-1 rounded-lg w-fit shadow-lg border border-gray-700/30">
        {['transactions', 'planning', 'realized', 'planned-vs-realized'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveSubTab(tab)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeSubTab === tab
                ? 'bg-blue-600 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            {tab === 'transactions' ? '💰 Transações' : 
             tab === 'planning' ? '📈 Planejamento' :
             tab === 'realized' ? '✅ Realizado' :
             tab === 'planned-vs-realized' ? '📊 Planejado vs Realizado' : ''}
          </button>
        ))}
      </div>
      
      {/* Conteúdo da aba ativa */}
      <div>
        {activeSubTab === 'transactions' && renderTransactions()}
        {activeSubTab === 'planning' && renderPlanning()}
        {activeSubTab === 'realized' && renderRealized()}
        {activeSubTab === 'planned-vs-realized' && renderPlannedVsRealized()}
      </div>

      {/* Modal Nova Transação */}
      {showNewTransactionModal && (
        <NewTransactionModal 
          isOpen={showNewTransactionModal}
          onClose={() => {
            setEditingTransaction(null);
            setShowNewTransactionModal(false);
          }}
          onSave={editingTransaction ? (transaction) => {
            // Lógica de edição será implementada
            setEditingTransaction(null);
            setShowNewTransactionModal(false);
          } : addNewTransaction}
          editingTransaction={editingTransaction}
        />
      )}
    </div>
  );
};

export default FinancesTab;


