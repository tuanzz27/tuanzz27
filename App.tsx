import React, { useState, useCallback } from 'react';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import { NotificationProvider } from './context/NotificationContext';

type View = 'login' | 'register' | 'dashboard';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<string | null>(localStorage.getItem('currentUser'));
  const [currentView, setCurrentView] = useState<View>(currentUser ? 'dashboard' : 'login');

  const handleLogin = useCallback((username: string) => {
    localStorage.setItem('currentUser', username);
    setCurrentUser(username);
    setCurrentView('dashboard');
  }, []);

  const handleRegister = useCallback((username: string) => {
    // In a real app, you'd save user data to a backend. Here we just log them in.
    handleLogin(username);
  }, [handleLogin]);

  const handleLogout = useCallback(() => {
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
    setCurrentView('login');
  }, []);

  const navigate = (view: View) => {
    setCurrentView(view);
  };

  const renderContent = () => {
    if (currentView === 'dashboard' && currentUser) {
      return <Dashboard username={currentUser} onLogout={handleLogout} />;
    }
    if (currentView === 'register') {
      return <Register onRegister={handleRegister} onNavigateToLogin={() => navigate('login')} />;
    }
    // Default to login
    return <Login onLogin={handleLogin} onNavigateToRegister={() => navigate('register')} />;
  };

  return (
    <NotificationProvider>
        <div className="min-h-screen font-sans text-text-main bg-background">
        {renderContent()}
        </div>
    </NotificationProvider>
  );
};

export default App;
