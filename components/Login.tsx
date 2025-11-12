import React, { useState } from 'react';
import { useNotification } from '../context/NotificationContext';

interface LoginProps {
  onLogin: (username: string) => void;
  onNavigateToRegister: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin, onNavigateToRegister }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { showNotification } = useNotification();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      showNotification('Vui lòng nhập đầy đủ thông tin!', 'error');
      return;
    }
    // Simulate checking user
    const savedUserData = localStorage.getItem(`password_${username}`);
    if (savedUserData === password) {
      showNotification(`Chào mừng ${username} quay trở lại!`, 'success');
      onLogin(username);
    } else {
      showNotification('Tên đăng nhập hoặc mật khẩu không đúng!', 'error');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen animate-fade-in">
      <div className="w-full max-w-sm p-8 space-y-6 bg-white rounded-2xl shadow-lg">
        <div className="text-center">
            <h1 className="text-3xl font-extrabold text-primary">Đăng Nhập</h1>
            <p className="text-text-light mt-2">Chào mừng bạn trở lại!</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-sm font-bold text-gray-600 block">Tên đăng nhập</label>
            <input 
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)} 
              className="w-full p-2 border border-gray-300 rounded-md mt-1 focus:ring-2 focus:ring-primary-light" 
            />
          </div>
          <div>
            <label className="text-sm font-bold text-gray-600 block">Mật khẩu</label>
            <input 
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)} 
              className="w-full p-2 border border-gray-300 rounded-md mt-1 focus:ring-2 focus:ring-primary-light" 
            />
          </div>
          <button type="submit" className="w-full py-2 px-4 bg-primary text-white rounded-md hover:bg-primary/90 font-semibold">Đăng Nhập</button>
        </form>
        <div className="text-center">
          <button onClick={onNavigateToRegister} className="text-sm text-primary hover:underline">
            Chưa có tài khoản? Đăng ký ngay!
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
