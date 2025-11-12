import React from 'react';
import { Pet, UserPet } from '../../types';
import { PETS_CONFIG } from '../../constants';

interface PetCollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  collectedPets: UserPet[];
  activePetId: string | null;
  onSelectPet: (petId: string) => void;
}

const PetCard: React.FC<{
  pet: Pet;
  isUnlocked: boolean;
  isActive: boolean;
  onSelect: () => void;
}> = ({ pet, isUnlocked, isActive, onSelect }) => {
  return (
    <div className={`p-4 border-2 rounded-2xl text-center transition-all ${isActive ? 'border-primary bg-primary-light/50' : 'border-gray-200'} ${!isUnlocked ? 'bg-gray-100' : 'bg-white'}`}>
      <div className={`text-5xl mb-2 transition-transform duration-300 ${isUnlocked ? 'grayscale-0' : 'grayscale'}`}>{pet.evolutions[0].image}</div>
      <h3 className={`font-bold ${isUnlocked ? 'text-text-main' : 'text-gray-400'}`}>{isUnlocked ? pet.name : '???'}</h3>
      <p className="text-xs text-text-light h-10">{isUnlocked ? pet.description : 'Hoàn thành mục tiêu để mở khóa.'}</p>
      {isUnlocked && (
        <button
          onClick={onSelect}
          disabled={isActive}
          className="mt-2 w-full text-sm font-semibold py-2 px-3 rounded-lg transition-colors disabled:bg-primary disabled:text-white disabled:cursor-not-allowed bg-gray-200 hover:bg-primary hover:text-white"
        >
          {isActive ? 'Đang chọn' : 'Chọn'}
        </button>
      )}
    </div>
  );
};


const PetCollectionModal: React.FC<PetCollectionModalProps> = ({ isOpen, onClose, collectedPets, activePetId, onSelectPet }) => {
  if (!isOpen) return null;

  const collectedPetIds = new Set(collectedPets.map(p => p.petId));

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl m-4 p-6 md:p-8 relative animate-pop-in"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="text-center mb-6">
          <span className="text-4xl">🐾</span>
          <h2 className="text-2xl font-bold text-primary mt-2">Bộ Sưu Tập Thú Cưng</h2>
          <p className="text-text-light">Chọn một người bạn để cùng đồng hành nhé!</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-[60vh] overflow-y-auto p-1">
          {PETS_CONFIG.map(pet => (
            <PetCard
              key={pet.id}
              pet={pet}
              isUnlocked={collectedPetIds.has(pet.id)}
              isActive={activePetId === pet.id}
              onSelect={() => onSelectPet(pet.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PetCollectionModal;
