import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Trophy, Medal, Award, User } from 'lucide-react';

const Leaderboard = () => {
    const [leaders, setLeaders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [timeframe, setTimeframe] = useState('all_time'); // 'all_time', 'month'

    useEffect(() => {
        fetchLeaderboard();
    }, [timeframe]);

    const fetchLeaderboard = async () => {
        setLoading(true);
        try {
            // In a real app, this would be a more complex query or a materialized view
            // For now, we'll fetch profiles and sort them client-side or use a simple order
            const { data, error } = await supabase
                .from('user_profiles')
                .select('id, first_name, last_name, avatar_url, total_events_attended, current_streak')
                .order('total_events_attended', { ascending: false })
                .limit(20);

            if (error) throw error;
            setLeaders(data);
        } catch (error) {
            console.error('Error fetching leaderboard:', error);
        } finally {
            setLoading(false);
        }
    };

    const getRankIcon = (index) => {
        switch (index) {
            case 0: return <Trophy className="text-yellow-400" size={24} />;
            case 1: return <Medal className="text-gray-400" size={24} />;
            case 2: return <Medal className="text-amber-600" size={24} />;
            default: return <span className="font-bold text-gray-400 w-6 text-center">{index + 1}</span>;
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h3 className="text-xl font-black uppercase flex items-center">
                    <Trophy className="mr-2 text-brand-orange" />
                    Ranking
                </h3>
                <div className="flex space-x-2 text-xs font-bold uppercase">
                    <button
                        onClick={() => setTimeframe('all_time')}
                        className={`px-3 py-1 rounded-full transition-colors ${timeframe === 'all_time' ? 'bg-brand-black text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                    >
                        Global
                    </button>
                    <button
                        onClick={() => setTimeframe('month')}
                        className={`px-3 py-1 rounded-full transition-colors ${timeframe === 'month' ? 'bg-brand-black text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                    >
                        Mensual
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="p-8 text-center text-gray-400">Cargando ranking...</div>
            ) : (
                <div className="divide-y divide-gray-50">
                    {leaders.map((user, index) => (
                        <div key={user.id} className="p-4 flex items-center hover:bg-gray-50 transition-colors">
                            <div className="mr-4 flex-shrink-0 w-8 flex justify-center">
                                {getRankIcon(index)}
                            </div>

                            <div className="mr-4">
                                {user.avatar_url ? (
                                    <img src={user.avatar_url} alt={user.first_name} className="w-10 h-10 rounded-full object-cover border-2 border-gray-100" />
                                ) : (
                                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                                        <User size={20} />
                                    </div>
                                )}
                            </div>

                            <div className="flex-grow">
                                <h4 className="font-bold text-brand-black">
                                    {user.first_name} {user.last_name?.charAt(0)}.
                                </h4>
                                <div className="flex items-center text-xs text-gray-500 space-x-3">
                                    <span className="flex items-center">
                                        <Award size={12} className="mr-1 text-brand-orange" />
                                        {user.total_events_attended} Eventos
                                    </span>
                                    {user.current_streak > 0 && (
                                        <span className="flex items-center text-green-600">
                                            <span className="mr-1">🔥</span>
                                            Racha: {user.current_streak}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Leaderboard;
