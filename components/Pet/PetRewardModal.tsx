import React from 'react';
import { Pet } from '../../types';

interface PetRewardModalProps {
  isOpen: boolean;
  onClose: () => void;
  pet: Pet | null;
}

const PetRewardModal: React.FC<PetRewardModalProps> = ({ isOpen, onClose, pet }) => {
  if (!isOpen || !pet) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl w-full max-w-sm m-4 p-6 md:p-8 text-center relative animate-pop-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4">
            <span className="text-4xl">🎉</span>
            <h2 className="text-2xl font-bold text-primary mt-2">Mở khóa Pet mới!</h2>
        </div>

        <div className="my-6 flex flex-col items-center">
            <div className="text-7xl mb-4">{pet.evolutions[0].image}</div>
            <h3 className="text-xl font-bold text-text-main">{pet.name}</h3>
            <p className="text-text-light mt-1">{pet.description}</p>
        </div>

        <button
          onClick={onClose}
          className="mt-4 w-full bg-accent hover:bg-accent/90 text-white font-bold py-3 px-4 rounded-lg transition-all"
        >
          Tuyệt vời!
        </button>
      </div>
    </div>
  );
};

export default PetRewardModal;
