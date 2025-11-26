import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Award, Lock } from 'lucide-react';

const BadgesList = ({ userId }) => {
    const [badges, setBadges] = useState([]);
    const [userBadges, setUserBadges] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (userId) {
            fetchBadges();
        }
    }, [userId]);

    const fetchBadges = async () => {
        try {
            // Fetch all available badges
            const { data: allBadges, error: badgesError } = await supabase
                .from('badges')
                .select('*')
                .order('id');

            if (badgesError) throw badgesError;

            // Fetch user's earned badges
            const { data: earned, error: userBadgesError } = await supabase
                .from('user_badges')
                .select('badge_id, earned_at')
                .eq('user_id', userId);

            if (userBadgesError) throw userBadgesError;

            setBadges(allBadges);
            setUserBadges(earned);
        } catch (error) {
            console.error('Error fetching badges:', error);
        } finally {
            setLoading(false);
        }
    };

    const isEarned = (badgeId) => {
        return userBadges.some(ub => ub.badge_id === badgeId);
    };

    if (loading) return <div className="text-center py-4 text-gray-400">Cargando medallas...</div>;

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {badges.map((badge) => {
                const earned = isEarned(badge.id);
                return (
                    <div
                        key={badge.id}
                        className={`p-4 rounded-xl border flex flex-col items-center text-center transition-all ${earned
                                ? 'bg-white border-brand-orange/30 shadow-sm'
                                : 'bg-gray-50 border-gray-100 opacity-60 grayscale'
                            }`}
                    >
                        <div className="text-4xl mb-2 filter drop-shadow-sm">
                            {badge.icon_url}
                        </div>
                        <h4 className={`font-bold text-sm uppercase mb-1 ${earned ? 'text-brand-black' : 'text-gray-500'}`}>
                            {badge.name}
                        </h4>
                        <p className="text-xs text-gray-400 leading-tight">
                            {badge.description}
                        </p>
                        {!earned && (
                            <div className="mt-2 text-xs text-gray-400 flex items-center">
                                <Lock size={10} className="mr-1" />
                                Bloqueado
                            </div>
                        )}
                        {earned && (
                            <div className="mt-2 text-xs text-brand-orange font-bold uppercase flex items-center">
                                <Award size={10} className="mr-1" />
                                Conseguido
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default BadgesList;
