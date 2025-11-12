import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Expense, UserData, JarName, Jar, SavingsGoal, DashboardView, Pet } from '../types';
import { JARS_CONFIG, ALL_JAR_NAMES, PETS_CONFIG } from '../constants';
import Header from './Header';
import JarsDisplay from './JarsDisplay';
import ExpenseForm from './ExpenseForm';
import ExpenseList from './ExpenseList';
import InsightModal from './InsightModal';
import IncomeManager from './IncomeManager';
import SavingsGoals from './SavingsGoals';
import BottomNav from './BottomNav';
import Analysis from './Analysis';
import Settings from './Settings';
import ConfirmationModal from './ConfirmationModal';
import ActivePetDisplay from './Pet/ActivePetDisplay';
import PetCollectionModal from './Pet/PetCollectionModal';
import PetRewardModal from './Pet/PetRewardModal';
import { getSpendingAdvice } from '../services/geminiService';
import { useNotification } from '../context/NotificationContext';

interface DashboardProps {
  username: string;
  onLogout: () => void;
}

const getInitialUserData = (username: string): UserData => {
  const savedData = localStorage.getItem(`userData_${username}`);
  if (savedData) {
    const parsedData = JSON.parse(savedData);
    // Ensure date objects are correctly parsed
    parsedData.expenses = parsedData.expenses.map((exp: any) => ({
      ...exp,
      date: new Date(exp.date),
    }));
    // Ensure savingsGoals array exists
    if (!parsedData.savingsGoals) {
        parsedData.savingsGoals = [];
    }
    // Ensure pet data exists for old users
    if (!parsedData.activePetId) {
        parsedData.activePetId = 'heo-dat';
    }
    if (!parsedData.collectedPets) {
        parsedData.collectedPets = [{ petId: 'heo-dat', unlockedAt: new Date() }];
    }
    return parsedData;
  }

  // New user default data
  const initialJars: Record<JarName, Jar> = {} as any;
  ALL_JAR_NAMES.forEach(key => {
    initialJars[key] = { ...JARS_CONFIG[key], balance: 0 };
  });

  return {
    username,
    income: 0,
    jars: initialJars,
    expenses: [],
    savingsGoals: [],
    activePetId: 'heo-dat',
    collectedPets: [{ petId: 'heo-dat', unlockedAt: new Date() }],
  };
};

const AddExpenseModal: React.FC<{ isOpen: boolean; onClose: () => void; onRequestAdd: (expense: Omit<Expense, 'id' | 'date'>) => void; jars: JarName[] }> = ({ isOpen, onClose, onRequestAdd, jars }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in" onClick={onClose}>
            <div onClick={(e) => e.stopPropagation()}>
                <ExpenseForm onRequestAdd={onRequestAdd} jars={jars} />
            </div>
        </div>
    );
};


const Dashboard: React.FC<DashboardProps> = ({ username, onLogout }) => {
  const [userData, setUserData] = useState<UserData>(() => getInitialUserData(username));
  const [isInsightModalOpen, setIsInsightModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [expenseToConfirm, setExpenseToConfirm] = useState<Omit<Expense, 'id' | 'date'> | null>(null);
  const [aiInsight, setAiInsight] = useState('');
  const [isInsightLoading, setIsInsightLoading] = useState(false);
  const [activeView, setActiveView] = useState<DashboardView>('dashboard');
  const [isPetCollectionOpen, setIsPetCollectionOpen] = useState(false);
  const [rewardPet, setRewardPet] = useState<Pet | null>(null);
  const { showNotification } = useNotification();

  useEffect(() => {
    localStorage.setItem(`userData_${username}`, JSON.stringify(userData));
  }, [userData, username]);

  const handleSetIncome = useCallback((newIncome: number) => {
    setUserData(prevData => {
        const updatedJars = { ...prevData.jars };
        ALL_JAR_NAMES.forEach(key => {
            const config = JARS_CONFIG[key];
            updatedJars[key].balance = newIncome * config.percentage;
        });
        // Reset expenses and goals on new income for simplicity
        return { ...prevData, income: newIncome, jars: updatedJars, expenses: [], savingsGoals: [] }; 
    });
    showNotification('Đã cập nhật thu nhập và phân phối vào các lọ!', 'success');
  }, [showNotification]);

  const handleAddExpense = useCallback((newExpense: Omit<Expense, 'id' | 'date'>) => {
    setUserData(prevData => {
        const jarToUpdate = prevData.jars[newExpense.jar];
        if (jarToUpdate.balance < newExpense.amount) {
            showNotification(`Ối! Lọ ${JARS_CONFIG[newExpense.jar].fullName} không đủ tiền!`, 'error');
            return prevData;
        }

        const updatedJars = { 
            ...prevData.jars,
            [newExpense.jar]: {
                ...jarToUpdate,
                balance: jarToUpdate.balance - newExpense.amount
            }
        };

        const fullExpense: Expense = {
            ...newExpense,
            id: Date.now().toString(),
            date: new Date()
        };
        
        showNotification(`Đã thêm chi tiêu "${newExpense.name}"!`, 'success');

        return {
            ...prevData,
            jars: updatedJars,
            expenses: [fullExpense, ...prevData.expenses]
        };
    });
  }, [showNotification]);

  const handleRequestAddExpense = useCallback((expense: Omit<Expense, 'id' | 'date'>) => {
      setExpenseToConfirm(expense);
      setIsAddModalOpen(false);
      setIsConfirmModalOpen(true);
  }, []);

  const confirmAddExpense = useCallback(() => {
    if (expenseToConfirm) {
        handleAddExpense(expenseToConfirm);
    }
    setIsConfirmModalOpen(false);
    setExpenseToConfirm(null);
  }, [expenseToConfirm, handleAddExpense]);

  const cancelAddExpense = useCallback(() => {
    setIsConfirmModalOpen(false);
    setExpenseToConfirm(null);
  }, []);

  const handleDeleteExpense = useCallback((id: string) => {
    setUserData(prevData => {
        const expenseToDelete = prevData.expenses.find(e => e.id === id);
        if (!expenseToDelete) return prevData;

        const updatedJars = {
            ...prevData.jars,
            [expenseToDelete.jar]: {
                ...prevData.jars[expenseToDelete.jar],
                balance: prevData.jars[expenseToDelete.jar].balance + expenseToDelete.amount
            }
        };
        
        showNotification('Đã xóa chi tiêu và hoàn tiền lại vào lọ.', 'info');

        return {
            ...prevData,
            jars: updatedJars,
            expenses: prevData.expenses.filter(e => e.id !== id)
        };
    });
  }, [showNotification]);

    const handleAddSavingsGoal = useCallback(async (newGoal: Omit<SavingsGoal, 'id' | 'currentAmount'>) => {
        setUserData(prevData => {
            const fullGoal: SavingsGoal = {
                ...newGoal,
                id: Date.now().toString(),
                currentAmount: 0,
                completed: false,
            };
            return {
                ...prevData,
                savingsGoals: [...prevData.savingsGoals, fullGoal],
            };
        });
        showNotification(`Đã tạo mục tiêu "${newGoal.name}"! Cố lên nhé!`, 'success');
    }, [showNotification]);

    const handleDepositToGoal = useCallback((goalId: string, amount: number) => {
        setUserData(prevData => {
            const ltssJar = prevData.jars.LTSS;
            if (ltssJar.balance < amount) {
                showNotification('Lọ Tiết kiệm dài hạn (LTSS) không đủ tiền!', 'error');
                return prevData;
            }

            const goalIndex = prevData.savingsGoals.findIndex(g => g.id === goalId);
            if (goalIndex === -1) return prevData;
            
            const originalGoal = prevData.savingsGoals[goalIndex];
            if (originalGoal.completed) {
                showNotification('Mục tiêu này đã hoàn thành rồi!', 'info');
                return prevData;
            }

            const updatedGoal = {
                ...originalGoal,
                currentAmount: originalGoal.currentAmount + amount,
            };

            const updatedSavingsGoals = [...prevData.savingsGoals];
            updatedSavingsGoals[goalIndex] = updatedGoal;

            const updatedJars = {
                ...prevData.jars,
                LTSS: {
                    ...ltssJar,
                    balance: ltssJar.balance - amount,
                }
            };
            
            showNotification(`Đã nạp ${amount.toLocaleString('vi-VN')}đ vào mục tiêu!`, 'success');

            let finalData = {
                ...prevData,
                jars: updatedJars,
                savingsGoals: updatedSavingsGoals,
            };

            // Check for goal completion and pet unlock
            if (updatedGoal.currentAmount >= updatedGoal.targetAmount && !originalGoal.completed) {
                updatedGoal.completed = true;
                
                const collectedPetIds = new Set(finalData.collectedPets.map(p => p.petId));
                const availablePets = PETS_CONFIG.filter(p => !collectedPetIds.has(p.id));
                
                if (availablePets.length > 0) {
                    const newPet = availablePets[0]; // Unlock the next available pet
                    finalData.collectedPets = [...finalData.collectedPets, { petId: newPet.id, unlockedAt: new Date() }];
                    setRewardPet(newPet); // Trigger reward modal
                    showNotification(`Chúc mừng! Bạn đã hoàn thành mục tiêu và mở khóa pet ${newPet.name}!`, 'success');
                } else {
                    showNotification('Chúc mừng! Bạn đã hoàn thành mục tiêu!', 'success');
                }
            }
            return finalData;
        });
    }, [showNotification]);

    const handleDeleteSavingsGoal = useCallback((goalId: string) => {
        setUserData(prevData => {
            const goalToDelete = prevData.savingsGoals.find(g => g.id === goalId);
            if (!goalToDelete) return prevData;

            // Refund money to LTSS jar only if not completed
            let moneyToRefund = goalToDelete.currentAmount;
            if (goalToDelete.completed) {
              moneyToRefund = 0; // Don't refund from completed goals to prevent abuse
            }
            
            const updatedJars = {
                ...prevData.jars,
                LTSS: {
                    ...prevData.jars.LTSS,
                    balance: prevData.jars.LTSS.balance + moneyToRefund,
                }
            };
            
            if (moneyToRefund > 0) {
                showNotification('Đã xóa mục tiêu. Tiền đã được hoàn lại vào lọ LTSS.', 'info');
            } else {
                showNotification('Đã xóa mục tiêu đã hoàn thành.', 'info');
            }

            return {
                ...prevData,
                jars: updatedJars,
                savingsGoals: prevData.savingsGoals.filter(g => g.id !== goalId),
            };
        });
    }, [showNotification]);

    const handleSelectPet = useCallback((petId: string) => {
        setUserData(prev => ({...prev, activePetId: petId}));
        setIsPetCollectionOpen(false);
        showNotification('Đã đổi thú cưng đồng hành!', 'success');
    }, [showNotification]);

  const handleGetInsight = useCallback(async () => {
    if (userData.expenses.length < 3 && userData.savingsGoals.length === 0) {
      setAiInsight('Bạn cần thêm chi tiêu hoặc mục tiêu tiết kiệm để AI có thể đưa ra lời khuyên chính xác nhé!');
      setIsInsightModalOpen(true);
      return;
    }
    setIsInsightLoading(true);
    setIsInsightModalOpen(true);
    try {
      const advice = await getSpendingAdvice(userData.jars, userData.expenses, userData.savingsGoals);
      setAiInsight(advice);
    } catch (error) {
      console.error("Error getting spending advice:", error);
      setAiInsight('Ối! AI đang bận một chút, bạn thử lại sau nha.');
    } finally {
      setIsInsightLoading(false);
    }
  }, [userData.expenses, userData.jars, userData.savingsGoals]);

  const handleNavigation = useCallback((view: DashboardView) => {
      if (view === 'add') {
          setIsAddModalOpen(true);
      } else {
          setActiveView(view);
      }
  }, []);

  const totalBalance = useMemo(() => {
    return ALL_JAR_NAMES.reduce((sum, key) => sum + userData.jars[key].balance, 0);
  }, [userData.jars]);

  const totalSavings = useMemo(() => {
    return userData.savingsGoals.reduce((sum, goal) => sum + goal.currentAmount, 0);
  }, [userData.savingsGoals]);

  const renderActiveView = () => {
    switch(activeView) {
        case 'dashboard':
            return (
                <div className="space-y-6">
                    <IncomeManager 
                        income={userData.income} 
                        totalBalance={totalBalance} 
                        onSetIncome={handleSetIncome} 
                        onGetInsight={handleGetInsight}
                        isInsightLoading={isInsightLoading}
                    />
                    <ActivePetDisplay 
                        activePetId={userData.activePetId}
                        totalSavings={totalSavings}
                        onOpenCollection={() => setIsPetCollectionOpen(true)}
                    />
                    <JarsDisplay jars={Object.values(userData.jars)} />
                    <SavingsGoals
                        goals={userData.savingsGoals}
                        onAddGoal={handleAddSavingsGoal}
                        onDeleteGoal={handleDeleteSavingsGoal}
                        onDeposit={handleDepositToGoal}
                        ltssBalance={userData.jars.LTSS.balance}
                    />
                </div>
            );
        case 'history':
            return <ExpenseList expenses={userData.expenses} onDeleteExpense={handleDeleteExpense} />;
        case 'analysis':
            return <Analysis expenses={userData.expenses} />;
        case 'settings':
            return <Settings username={username} onLogout={onLogout} />;
        default:
            return null;
    }
  };


  return (
    <div className="flex flex-col h-screen">
      <div className="flex-grow overflow-y-auto pb-24">
        <div className="container mx-auto max-w-2xl p-4 md:p-6">
            <Header username={username} />
            <main className="space-y-6">
                {renderActiveView()}
            </main>
        </div>
      </div>

      <BottomNav 
        activeView={activeView} 
        onNavigate={handleNavigation} 
      />
      
      <AddExpenseModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onRequestAdd={handleRequestAddExpense}
        jars={ALL_JAR_NAMES}
      />

      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={cancelAddExpense}
        onConfirm={confirmAddExpense}
        title="Xác nhận chi tiêu"
        message="Bạn có chắc muốn thêm khoản chi tiêu này không?"
      />
      
      <InsightModal 
        isOpen={isInsightModalOpen} 
        onClose={() => setIsInsightModalOpen(false)} 
        insight={aiInsight}
        isLoading={isInsightLoading}
      />

      <PetCollectionModal
        isOpen={isPetCollectionOpen}
        onClose={() => setIsPetCollectionOpen(false)}
        collectedPets={userData.collectedPets}
        activePetId={userData.activePetId}
        onSelectPet={handleSelectPet}
      />

      <PetRewardModal 
        isOpen={!!rewardPet}
        onClose={() => setRewardPet(null)}
        pet={rewardPet}
      />
    </div>
  );
};

export default Dashboard;
