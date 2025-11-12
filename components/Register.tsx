import React, { useState } from 'react';
import { useNotification } from '../context/NotificationContext';

interface RegisterProps {
  onRegister: (username: string) => void;
  onNavigateToLogin: () => void;
}

const PiggyBankIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-secondary flex-shrink-0">
      <path d="M10 17V15.3569C10 15.1638 10.079 14.9785 10.2196 14.8379L11.8379 13.2196C11.9785 13.079 12.1638 13 12.3569 13H14"/>
      <path d="M10.1874 9.53102L10.5 9.43137C11.3912 9.17633 11.9688 8.35105 11.9688 7.40426C11.9688 6.55173 11.5173 5.79927 10.7925 5.42168L10.5 5.28947"/>
      <path d="M14 9.5542C14.5367 9.22734 14.9082 8.65727 14.9815 8.00363C15.0549 7.34999 14.8021 6.70293 14.3188 6.27515C13.8355 5.84738 13.1818 5.68884 12.5577 5.85623C11.9336 6.02361 11.4116 6.49569 11.1444 7.09839"/>
      <path d="M19.4682 10.421C19.7997 11.5233 20 12.3215 20 13C20 15.8284 17.8284 18 15 18H9C6.17157 18 3.99999 15.8284 4 13C4 11.5367 4.50294 10.1834 5.31818 9.16785C6.26279 7.96282 7.5553 7.09538 9 6.67133"/>
      <path d="M16 4.2C15.2283 3.44754 14.1635 3 13 3C11.8365 3 10.7717 3.44754 10 4.2"/>
    </svg>
);

const Register: React.FC<RegisterProps> = ({ onRegister, onNavigateToLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { showNotification } = useNotification();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password || !confirmPassword) {
      showNotification('Vui lòng điền đầy đủ thông tin!', 'error');
      return;
    }
    if (password.length < 6) {
        showNotification('Mật khẩu cần có ít nhất 6 ký tự!', 'error');
        return;
    }
    if (password !== confirmPassword) {
      showNotification('Mật khẩu nhập lại không khớp!', 'error');
      return;
    }
    // Simulate checking if user exists
    if (localStorage.getItem(`password_${username}`)) {
        showNotification('Tên đăng nhập này đã tồn tại!', 'error');
        return;
    }

    // Simulate creating user
    localStorage.setItem(`password_${username}`, password);
    showNotification('Tạo tài khoản thành công! Bắt đầu quản lý chi tiêu nào!', 'success');
    onRegister(username);
  };

  return (
    <div className="flex items-center justify-center min-h-screen animate-fade-in">
      <div className="w-full max-w-sm p-8 space-y-6 bg-white rounded-2xl shadow-lg">
        <div className="text-center">
            <div className="flex flex-col items-center justify-center space-y-3 mb-6">
                <PiggyBankIcon />
                <p className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary uppercase tracking-wider text-center">
                    QUẢN LÍ CHI TIÊU CHO HỌC SINH TRUNG HỌC PHỔ THÔNG
                </p>
            </div>
            <h1 className="text-3xl font-extrabold text-primary">Đăng Ký</h1>
            <p className="text-text-light mt-2">Tạo tài khoản để bắt đầu quản lý chi tiêu!</p>
        </div>
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="text-sm font-bold text-gray-600 block">Tên đăng nhập</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)} 
              className="w-full p-2 border border-gray-300 rounded-md mt-1 focus:ring-2 focus:ring-primary-light" />
          </div>
          <div>
            <label className="text-sm font-bold text-gray-600 block">Mật khẩu</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)} 
              className="w-full p-2 border border-gray-300 rounded-md mt-1 focus:ring-2 focus:ring-primary-light" />
          </div>
          <div>
            <label className="text-sm font-bold text-gray-600 block">Nhập lại mật khẩu</label>
            <input 
              type="password" 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)} 
              className="w-full p-2 border border-gray-300 rounded-md mt-1 focus:ring-2 focus:ring-primary-light" />
          </div>
          <button type="submit" className="w-full py-2 px-4 bg-primary text-white rounded-md hover:bg-primary/90 font-semibold">Đăng Ký</button>
        </form>
         <div className="text-center">
          <button onClick={onNavigateToLogin} className="text-sm text-primary hover:underline">
            Đã có tài khoản? Đăng nhập
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register;
