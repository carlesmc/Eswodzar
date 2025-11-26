import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { User, MessageSquare } from 'lucide-react';

const FriendsList = ({ userId }) => {
    const [friends, setFriends] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (userId) {
            fetchFriends();
        }
    }, [userId]);

    const fetchFriends = async () => {
        try {
            const { data, error } = await supabase
                .rpc('get_user_friends', { p_user_id: userId });

            if (error) throw error;
            setFriends(data || []);
        } catch (error) {
            console.error('Error fetching friends:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="text-center py-4 text-gray-400">Cargando amigos...</div>;
    }

    if (friends.length === 0) {
        return (
            <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                <User className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500 font-medium">Aún no tienes amigos agregados.</p>
                <p className="text-xs text-gray-400 mt-1">¡Busca a tus compañeros de WOD!</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {friends.map((friend) => (
                <div key={friend.friend_id} className="flex items-center p-3 bg-white border border-gray-100 shadow-sm rounded-lg hover:border-brand-orange transition-colors">
                    <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden mr-3 flex-shrink-0">
                        {friend.friend_photo ? (
                            <img
                                src={friend.friend_photo}
                                alt={friend.friend_name}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                                <User size={20} />
                            </div>
                        )}
                    </div>
                    <div>
                        <h4 className="font-bold text-sm text-brand-black">{friend.friend_name}</h4>
                        <p className="text-xs text-gray-500">Amigos desde {new Date(friend.friendship_date).toLocaleDateString()}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default FriendsList;
