import React, { useState, useCallback } from 'react';
import { Expense, JarName } from '../types';
import { categorizeAndSuggestJar } from '../services/geminiService';
import { CATEGORIES, JARS_CONFIG } from '../constants';
import { useNotification } from '../context/NotificationContext';

interface ExpenseFormProps {
  onRequestAdd: (expense: Omit<Expense, 'id' | 'date'>) => void;
  jars: JarName[];
}

const LoadingSpinner = () => (
  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
);

const ExpenseForm: React.FC<ExpenseFormProps> = ({ onRequestAdd, jars }) => {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [selectedJar, setSelectedJar] = useState<JarName>(jars[0]);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const { showNotification } = useNotification();

  const handleNameBlur = useCallback(async () => {
    if (name && !isAiLoading) {
        setIsAiLoading(true);
        try {
            const { jar } = await categorizeAndSuggestJar(name);
            if (jars.includes(jar)) {
                setSelectedJar(jar);
            }
        } catch (err) {
            console.error("AI suggestion failed:", err);
            // Don't show error to user, just fail silently
        } finally {
            setIsAiLoading(false);
        }
    }
  }, [name, jars, isAiLoading]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !amount || +amount <= 0) {
      showNotification('Vui lòng điền đầy đủ và chính xác thông tin chi tiêu nhé!', 'error');
      return;
    }
    
    // We already have the suggestion, so we don't need to load here again.
    // The category is just for display, the jar is for logic.
    const { category } = await categorizeAndSuggestJar(name);

    onRequestAdd({
        name,
        amount: +amount,
        category: CATEGORIES.includes(category) ? category : 'Khác',
        jar: selectedJar,
    });

    setName('');
    setAmount('');
  }, [name, amount, selectedJar, onRequestAdd, showNotification]);

  return (
    <div className="p-5 bg-white rounded-2xl shadow-lg animate-pop-in w-full max-w-md">
      <h2 className="text-xl font-bold text-text-main mb-4 text-center">Thêm chi tiêu mới 🖊️</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-text-light mb-1">
            Bạn đã chi cho việc gì?
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={handleNameBlur}
            placeholder="VD: Trà sữa, sách tham khảo..."
            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-light focus:border-primary transition"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-text-light mb-1">
                Số tiền (VNĐ)
              </label>
              <input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="VD: 30000"
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-light focus:border-primary transition"
              />
            </div>
            <div>
              <label htmlFor="jar" className="flex items-center space-x-2 text-sm font-medium text-text-light mb-1">
                <span>Chi từ lọ nào?</span>
                {isAiLoading && <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>}
              </label>
              <select 
                id="jar"
                value={selectedJar}
                onChange={(e) => setSelectedJar(e.target.value as JarName)}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-light focus:border-primary transition"
                >
                {jars.map(jar => <option key={jar} value={jar}>{JARS_CONFIG[jar].fullName}</option>)}
              </select>
            </div>
        </div>
        <button
          type="submit"
          disabled={isAiLoading}
          className="w-full flex items-center justify-center bg-primary hover:bg-primary/90 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:bg-primary/50 disabled:cursor-not-allowed"
        >
          {isAiLoading ? 'AI đang gợi ý...' : 'Thêm ngay!'}
        </button>
      </form>
    </div>
  );
};

export default ExpenseForm;