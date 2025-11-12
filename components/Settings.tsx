import React, { useState } from 'react';
import { useNotification } from '../context/NotificationContext';

interface SettingsProps {
    username: string;
    onLogout: () => void;
}

const UserIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
);
const LockIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
);
const LogoutIcon = () => (
     <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
);


const Settings: React.FC<SettingsProps> = ({ username, onLogout }) => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const { showNotification } = useNotification();

    const handleChangePassword = (e: React.FormEvent) => {
        e.preventDefault();
        
        const savedPassword = localStorage.getItem(`password_${username}`);

        if(currentPassword !== savedPassword) {
            showNotification('Mật khẩu hiện tại không đúng!', 'error');
            return;
        }
        if(!newPassword || newPassword.length < 6) {
            showNotification('Mật khẩu mới phải có ít nhất 6 ký tự!', 'error');
            return;
        }
        if (newPassword !== confirmNewPassword) {
            showNotification('Mật khẩu mới không khớp!', 'error');
            return;
        }

        localStorage.setItem(`password_${username}`, newPassword);
        showNotification('Đổi mật khẩu thành công!', 'success');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmNewPassword('');
    };

    return (
        <div className="space-y-8 animate-pop-in">
            <h2 className="text-2xl font-bold text-text-main text-center">Cài đặt ⚙️</h2>

            {/* User Info Card */}
            <div className="p-6 bg-white rounded-2xl shadow-sm">
                <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 flex items-center justify-center rounded-full bg-primary-light text-primary">
                        <UserIcon />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg text-text-main">Tài khoản</h3>
                        <p className="text-text-light">{username}</p>
                    </div>
                </div>
            </div>

            {/* Change Password Card */}
            <div className="p-6 bg-white rounded-2xl shadow-sm">
                 <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 flex items-center justify-center rounded-full bg-primary-light text-primary">
                        <LockIcon />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg text-text-main">Đổi mật khẩu</h3>
                        <p className="text-text-light text-sm">Bảo mật tài khoản của bạn nhé!</p>
                    </div>
                </div>
                <form onSubmit={handleChangePassword} className="space-y-4">
                    <input 
                        type="password" 
                        placeholder="Mật khẩu hiện tại"
                        value={currentPassword}
                        onChange={e => setCurrentPassword(e.target.value)}
                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-light" 
                    />
                    <input 
                        type="password" 
                        placeholder="Mật khẩu mới"
                        value={newPassword}
                        onChange={e => setNewPassword(e.target.value)}
                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-light" 
                    />
                    <input 
                        type="password" 
                        placeholder="Xác nhận mật khẩu mới"
                        value={confirmNewPassword}
                        onChange={e => setConfirmNewPassword(e.target.value)}
                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-light" 
                    />
                    <button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-2.5 rounded-lg transition-all">
                        Lưu thay đổi
                    </button>
                </form>
            </div>
            
             {/* Logout Card */}
            <div className="p-4 bg-white rounded-2xl shadow-sm">
                <button onClick={onLogout} className="w-full flex items-center justify-center space-x-3 text-secondary hover:bg-secondary/10 font-bold py-2.5 rounded-lg transition-colors">
                    <LogoutIcon />
                    <span>Đăng xuất</span>
                </button>
            </div>
        </div>
    );
};

export default Settings;