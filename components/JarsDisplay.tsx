import React from 'react';
import { Jar } from '../types';

interface JarCardProps {
  jar: Jar;
}

const JarCard: React.FC<JarCardProps> = ({ jar }) => (
  <div className="p-4 bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col items-center text-center">
    <div className={`w-14 h-14 rounded-full flex items-center justify-center text-3xl mb-2 ${jar.color}`}>
        {jar.icon}
    </div>
    <p className="font-bold text-text-main">{jar.fullName}</p>
    <p className="text-xs text-text-light">({jar.name} - {jar.percentage * 100}%)</p>
    <p className="text-xl font-extrabold text-primary mt-2">
        {jar.balance.toLocaleString('vi-VN')}
        <span className="text-sm opacity-80 ml-1">đ</span>
    </p>
  </div>
);


interface JarsDisplayProps {
  jars: Jar[];
}

const JarsDisplay: React.FC<JarsDisplayProps> = ({ jars }) => {
  return (
    <div className="animate-pop-in">
        <h2 className="text-xl font-bold text-text-main mb-4">6 Chiếc Lọ Của Bạn 🏺</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {jars.map(jar => <JarCard key={jar.name} jar={jar} />)}
        </div>
    </div>
  );
};

export default JarsDisplay;
