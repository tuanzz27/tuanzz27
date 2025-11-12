import React, { useState } from 'react';
import { useNotification } from '../context/NotificationContext';

interface RegisterProps {
  onRegister: (username: string) => void;
  onNavigateToLogin: () => void;
}

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
