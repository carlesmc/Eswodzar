import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, X } from 'lucide-react';
import { supabase } from '../lib/supabase';

const BadgeNotification = ({ userId }) => {
    const [notification, setNotification] = useState(null);

    useEffect(() => {
        if (!userId) return;

        // Subscribe to new badges for this user
        const subscription = supabase
            .channel('public:user_badges')
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'user_badges',
                filter: `user_id=eq.${userId}`
            }, async (payload) => {
                // Fetch badge details
                const { data: badgeData, error } = await supabase
                    .from('badges')
                    .select('*')
                    .eq('id', payload.new.badge_id)
                    .single();

                if (!error && badgeData) {
                    setNotification(badgeData);
                    // Auto dismiss after 5 seconds
                    setTimeout(() => {
                        setNotification(null);
                    }, 5000);
                }
            })
            .subscribe();

        return () => {
            supabase.removeChannel(subscription);
        };
    }, [userId]);

    return (
        <AnimatePresence>
            {notification && (
                <motion.div
                    initial={{ opacity: 0, y: 50, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.8 }}
                    className="fixed bottom-4 right-4 z-50 max-w-sm w-full bg-white border-l-4 border-brand-orange shadow-2xl rounded-lg overflow-hidden"
                >
                    <div className="p-4 flex items-start">
                        <div className="flex-shrink-0 bg-brand-orange/10 p-2 rounded-full">
                            <span className="text-2xl">{notification.icon_url || '🏆'}</span>
                        </div>
                        <div className="ml-3 w-0 flex-1 pt-0.5">
                            <p className="text-sm font-bold text-brand-orange uppercase mb-1">
                                ¡Nueva Medalla Desbloqueada!
                            </p>
                            <p className="text-sm font-black text-gray-900 uppercase">
                                {notification.name}
                            </p>
                            <p className="mt-1 text-sm text-gray-500">
                                {notification.description}
                            </p>
                        </div>
                        <div className="ml-4 flex-shrink-0 flex">
                            <button
                                className="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none"
                                onClick={() => setNotification(null)}
                            >
                                <span className="sr-only">Cerrar</span>
                                <X size={18} />
                            </button>
                        </div>
                    </div>
                    <div className="bg-brand-orange h-1 w-full animate-progress-bar"></div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default BadgeNotification;
