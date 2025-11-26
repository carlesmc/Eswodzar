import React from 'react';
import { Trophy, Flame, Calendar } from 'lucide-react';

const UserStats = ({ stats, theme = 'dark' }) => {
    if (!stats) return null;

    const isLight = theme === 'light';

    const containerClass = isLight
        ? "bg-white p-4 rounded-none border border-gray-100 shadow-sm flex flex-col items-center text-center"
        : "bg-brand-black/50 p-4 rounded-xl border border-gray-800 flex flex-col items-center text-center";

    const textClass = isLight ? "text-brand-black" : "text-white";
    const labelClass = isLight ? "text-gray-500" : "text-gray-400";

    return (
        <div className="grid grid-cols-3 gap-4 mb-6">
            <div className={containerClass}>
                <div className="bg-brand-orange/10 p-2 rounded-full mb-2">
                    <Calendar className="w-5 h-5 text-brand-orange" />
                </div>
                <span className={`text-2xl font-bold ${textClass}`}>{stats.total_events_attended || 0}</span>
                <span className={`text-xs uppercase tracking-wider ${labelClass}`}>Eventos</span>
            </div>

            <div className={containerClass}>
                <div className="bg-red-500/10 p-2 rounded-full mb-2">
                    <Flame className="w-5 h-5 text-red-500" />
                </div>
                <span className={`text-2xl font-bold ${textClass}`}>{stats.current_streak || 0}</span>
                <span className={`text-xs uppercase tracking-wider ${labelClass}`}>Racha Actual</span>
            </div>

            <div className={containerClass}>
                <div className="bg-yellow-500/10 p-2 rounded-full mb-2">
                    <Trophy className="w-5 h-5 text-yellow-500" />
                </div>
                <span className={`text-2xl font-bold ${textClass}`}>{stats.longest_streak || 0}</span>
                <span className={`text-xs uppercase tracking-wider ${labelClass}`}>Mejor Racha</span>
            </div>
        </div>
    );
};

export default UserStats;
