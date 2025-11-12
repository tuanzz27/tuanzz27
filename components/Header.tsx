import React from 'react';

const PiggyBankIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-secondary flex-shrink-0">
    <path d="M10 17V15.3569C10 15.1638 10.079 14.9785 10.2196 14.8379L11.8379 13.2196C11.9785 13.079 12.1638 13 12.3569 13H14"/>
    <path d="M10.1874 9.53102L10.5 9.43137C11.3912 9.17633 11.9688 8.35105 11.9688 7.40426C11.9688 6.55173 11.5173 5.79927 10.7925 5.42168L10.5 5.28947"/>
    <path d="M14 9.5542C14.5367 9.22734 14.9082 8.65727 14.9815 8.00363C15.0549 7.34999 14.8021 6.70293 14.3188 6.27515C13.8355 5.84738 13.1818 5.68884 12.5577 5.85623C11.9336 6.02361 11.4116 6.49569 11.1444 7.09839"/>
    <path d="M19.4682 10.421C19.7997 11.5233 20 12.3215 20 13C20 15.8284 17.8284 18 15 18H9C6.17157 18 3.99999 15.8284 4 13C4 11.5367 4.50294 10.1834 5.31818 9.16785C6.26279 7.96282 7.5553 7.09538 9 6.67133"/>
    <path d="M16 4.2C15.2283 3.44754 14.1635 3 13 3C11.8365 3 10.7717 3.44754 10 4.2"/>
  </svg>
);


interface HeaderProps {
    username: string;
}

const Header: React.FC<HeaderProps> = ({ username }) => {
  return (
    <header className="text-center mb-6">
       <div className="text-left">
            <div className="text-sm text-text-light">
                Xin chào, <span className="font-bold text-primary">{username}!</span>
            </div>
       </div>
       <div className="flex items-center justify-center space-x-3 mt-2">
            <PiggyBankIcon />
            <h1 className="text-2xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary uppercase tracking-tight">
                Quản lý chi tiêu cho học sinh trung học phổ thông
            </h1>
       </div>
    </header>
  );
};

export default Header;