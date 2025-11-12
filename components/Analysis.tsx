import React, { useMemo } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { Expense } from '../types';
import { JARS_CONFIG, CATEGORIES, CHART_COLORS } from '../constants';

ChartJS.register(ArcElement, Tooltip, Legend);

interface AnalysisProps {
  expenses: Expense[];
}

const ChartCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="bg-white p-4 md:p-6 rounded-2xl shadow-sm">
        <h3 className="text-lg font-bold text-text-main mb-4 text-center">{title}</h3>
        <div className="h-64 flex items-center justify-center">
            {children}
        </div>
    </div>
);

const Analysis: React.FC<AnalysisProps> = ({ expenses }) => {
  const chartData = useMemo(() => {
    const jarTotals: { [key: string]: number } = {};
    const categoryTotals: { [key: string]: number } = {};

    for (const expense of expenses) {
      jarTotals[expense.jar] = (jarTotals[expense.jar] || 0) + expense.amount;
      categoryTotals[expense.category] = (categoryTotals[expense.category] || 0) + expense.amount;
    }

    const jarChartData = {
      labels: Object.keys(jarTotals).map(jar => JARS_CONFIG[jar as keyof typeof JARS_CONFIG].fullName),
      datasets: [{
        data: Object.values(jarTotals),
        backgroundColor: CHART_COLORS,
        borderColor: '#fff',
        borderWidth: 2,
      }],
    };

    const categoryChartData = {
      labels: Object.keys(categoryTotals),
      datasets: [{
        data: Object.values(categoryTotals),
        backgroundColor: CHART_COLORS.slice().reverse(), // Use a different color order
        borderColor: '#fff',
        borderWidth: 2,
      }],
    };
    
    return { jarChartData, categoryChartData };
  }, [expenses]);

  if (expenses.length === 0) {
    return (
      <div className="text-center py-10 px-6 bg-white rounded-2xl shadow-sm animate-fade-in">
        <div className="text-5xl mb-4">📊</div>
        <h2 className="text-xl font-bold text-text-main">Phân tích Chi tiêu</h2>
        <p className="text-text-light mt-2">Chưa có dữ liệu để phân tích.</p>
        <p className="text-text-light">Hãy thêm vài khoản chi tiêu để xem biểu đồ nhé!</p>
      </div>
    );
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
            font: {
                family: '"Be Vietnam Pro", sans-serif'
            }
        }
      },
    },
  };

  return (
    <div className="space-y-6 animate-pop-in">
      <h2 className="text-xl font-bold text-text-main">Phân tích Chi tiêu 📊</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ChartCard title="Phân bổ theo Lọ">
            <Doughnut data={chartData.jarChartData} options={chartOptions} />
        </ChartCard>
        <ChartCard title="Phân bổ theo Danh mục">
            <Doughnut data={chartData.categoryChartData} options={chartOptions} />
        </ChartCard>
      </div>
    </div>
  );
};

export default Analysis;