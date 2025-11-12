import React from 'react';
import { Pet } from '../../types';
import { PETS_CONFIG } from '../../constants';

interface ActivePetDisplayProps {
  activePetId: string | null;
  totalSavings: number;
  onOpenCollection: () => void;
}

const ActivePetDisplay: React.FC<ActivePetDisplayProps> = ({ activePetId, totalSavings, onOpenCollection }) => {
  if (!activePetId) return null;

  const petConfig = PETS_CONFIG.find(p => p.id === activePetId);
  if (!petConfig) return null;

  let currentEvolution = petConfig.evolutions[0];
  let nextEvolution = null;

  for (let i = 0; i < petConfig.evolutions.length; i++) {
    if (totalSavings >= petConfig.evolutions[i].requiredSavings) {
      currentEvolution = petConfig.evolutions[i];
    } else {
      nextEvolution = petConfig.evolutions[i];
      break;
    }
  }

  const progress = nextEvolution
    ? ((totalSavings - currentEvolution.requiredSavings) / (nextEvolution.requiredSavings - currentEvolution.requiredSavings)) * 100
    : 100;

  return (
    <div className="bg-white p-4 rounded-2xl shadow-sm animate-pop-in space-y-3">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-text-main">Thú Cưng Tiết Kiệm 🐾</h2>
        <button onClick={onOpenCollection} className="text-sm text-primary font-semibold hover:underline">
            Bộ sưu tập
        </button>
      </div>
      <div className="flex items-center space-x-4">
        <div className="text-6xl flex-shrink-0 w-20 h-20 flex items-center justify-center bg-primary-light rounded-full">
          {currentEvolution.image}
        </div>
        <div className="flex-grow">
          <p className="font-bold text-lg text-primary">{petConfig.name}</p>
          <p className="text-text-light font-medium">Cấp độ: {currentEvolution.name}</p>
          {nextEvolution ? (
            <div className="mt-2">
              <div className="flex justify-between text-xs text-text-light mb-1">
                <span>Tiến hóa</span>
                <span>{nextEvolution.requiredSavings.toLocaleString('vi-VN')}đ</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-accent h-2 rounded-full" style={{ width: `${progress}%` }}></div>
              </div>
            </div>
          ) : (
            <p className="text-sm font-semibold text-accent mt-2">Đã đạt cấp độ tối đa! 🎉</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActivePetDisplay;
