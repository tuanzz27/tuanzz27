import React from 'react';
import { DashboardView } from '../types';

interface BottomNavProps {
    activeView: DashboardView;
    onNavigate: (view: DashboardView) => void;
}

const NavItem: React.FC<{
    label: string;
    icon: React.ReactNode;
    isActive: boolean;
    onClick: () => void;
    isCentral?: boolean;
}> = ({ label, icon, isActive, onClick, isCentral }) => (
    <button
        onClick={onClick}
        className={`flex flex-col items-center justify-center w-full pt-2 pb-1 transition-colors duration-200 group ${isActive ? 'text-primary' : 'text-text-light'}`}
    >
        <div className={`flex items-center justify-center w-12 h-8 mb-0.5 rounded-full ${isCentral ? 'bg-primary text-white' : ''} ${isActive && !isCentral ? 'bg-primary-light' : ''}`}>
            {icon}
        </div>
        <span className={`text-xs font-medium ${isCentral ? 'text-primary' : ''}`}>{label}</span>
    </button>
);

const Icon: React.FC<{ path: string; isActive?: boolean, isCentral?: boolean }> = ({ path, isActive, isCentral }) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={isCentral ? 'currentColor' : isActive ? 'var(--color-primary)' : 'currentColor' } strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d={path} />
    </svg>
);


const BottomNav: React.FC<BottomNavProps> = ({ activeView, onNavigate }) => {
    const navItems: { view: DashboardView, label: string, iconPath: string }[] = [
        { view: 'dashboard', label: 'Dashboard', iconPath: 'M3 13l4-4 4 4 4-4 4 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7' },
        { view: 'history', label: 'Lịch Sử', iconPath: 'M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zM12 12a3 3 0 100-6 3 3 0 000 6z' },
        { view: 'add', label: 'Thêm', iconPath: 'M12 5v14M5 12h14' },
        { view: 'analysis', label: 'Phân Tích', iconPath: 'M21.21 15.89A10 10 0 1 1 8 2.83M22 12A10 10 0 0 0 12 2v10z' },
        { view: 'settings', label: 'Cài Đặt', iconPath: 'M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z' },
    ];
    
    return (
        <div className="fixed bottom-0 left-0 right-0 h-16 bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.05)] z-40">
            <div className="flex justify-around items-center h-full max-w-2xl mx-auto">
                {navItems.map(item => (
                    <NavItem 
                        key={item.view}
                        label={item.label}
                        icon={<Icon path={item.iconPath} isActive={activeView === item.view} isCentral={item.view === 'add'} />}
                        isActive={activeView === item.view && item.view !== 'add'}
                        onClick={() => onNavigate(item.view)}
                        isCentral={item.view === 'add'}
                    />
                ))}
            </div>
        </div>
    );
};

export default BottomNav;