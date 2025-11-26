import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { UserPlus, Check, X, User } from 'lucide-react';

const FriendRequests = ({ userId, onRequestProcessed }) => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (userId) {
            fetchRequests();
        }
    }, [userId]);

    const fetchRequests = async () => {
        try {
            // Fetch pending requests where current user is the receiver (friend_id)
            // We need to join with user_profiles to get the sender's info
            const { data, error } = await supabase
                .from('friendships')
                .select(`
                    id,
                    created_at,
                    sender:user_id (
                        id
                    )
                `)
                .eq('friend_id', userId)
                .eq('status', 'pending');

            if (error) throw error;

            // Now fetch profile details for each sender manually since the join above only gets auth.users info which might not have profile data accessible directly via simple join if RLS is strict or structure is different.
            // Actually, we can try to join user_profiles if we set up the foreign key relation correctly.
            // Let's assume we need to fetch profiles separately for safety or use a custom query.
            // But wait, user_profiles is linked to auth.users by id.

            // Let's refine the query to get profile data.
            // Since we can't easily join auth.users -> user_profiles in one go with standard client if relations aren't perfect, 
            // let's fetch the requests first, then fetch the profiles.

            if (data && data.length > 0) {
                const senderIds = data.map(r => r.sender.id);
                const { data: profiles, error: profilesError } = await supabase
                    .from('user_profiles')
                    .select('id, first_name, last_name, profile_photo_url')
                    .in('id', senderIds);

                if (profilesError) throw profilesError;

                const requestsWithProfiles = data.map(req => {
                    const profile = profiles.find(p => p.id === req.sender.id);
                    return {
                        ...req,
                        senderProfile: profile
                    };
                });
                setRequests(requestsWithProfiles);
            } else {
                setRequests([]);
            }

        } catch (error) {
            console.error('Error fetching friend requests:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAccept = async (requestId) => {
        try {
            const { error } = await supabase.rpc('accept_friend_request', { p_friendship_id: requestId });
            if (error) throw error;

            // Remove from list
            setRequests(prev => prev.filter(r => r.id !== requestId));
            if (onRequestProcessed) onRequestProcessed();
            alert('¡Solicitud aceptada!');
        } catch (error) {
            console.error('Error accepting request:', error);
            alert('Error al aceptar la solicitud');
        }
    };

    const handleReject = async (requestId) => {
        try {
            const { error } = await supabase
                .from('friendships')
                .delete()
                .eq('id', requestId);

            if (error) throw error;

            setRequests(prev => prev.filter(r => r.id !== requestId));
            alert('Solicitud rechazada');
        } catch (error) {
            console.error('Error rejecting request:', error);
            alert('Error al rechazar la solicitud');
        }
    };

    if (loading) return null;

    if (requests.length === 0) return null;

    return (
        <div className="mb-8">
            <h3 className="text-sm font-bold uppercase text-gray-500 mb-3 flex items-center">
                <UserPlus size={16} className="mr-2" />
                Solicitudes Pendientes ({requests.length})
            </h3>
            <div className="space-y-3">
                {requests.map((req) => (
                    <div key={req.id} className="bg-white border border-brand-orange/30 p-4 rounded-lg shadow-sm flex items-center justify-between">
                        <div className="flex items-center">
                            <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden mr-3">
                                {req.senderProfile?.profile_photo_url ? (
                                    <img
                                        src={req.senderProfile.profile_photo_url}
                                        alt={req.senderProfile.first_name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                                        <User size={16} />
                                    </div>
                                )}
                            </div>
                            <div>
                                <p className="font-bold text-sm">
                                    {req.senderProfile
                                        ? `${req.senderProfile.first_name} ${req.senderProfile.last_name}`
                                        : 'Usuario Desconocido'}
                                </p>
                                <p className="text-xs text-gray-500">quiere ser tu amigo</p>
                            </div>
                        </div>
                        <div className="flex space-x-2">
                            <button
                                onClick={() => handleAccept(req.id)}
                                className="p-2 bg-green-100 text-green-700 rounded-full hover:bg-green-200 transition-colors"
                                title="Aceptar"
                            >
                                <Check size={16} />
                            </button>
                            <button
                                onClick={() => handleReject(req.id)}
                                className="p-2 bg-red-100 text-red-700 rounded-full hover:bg-red-200 transition-colors"
                                title="Rechazar"
                            >
                                <X size={16} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FriendRequests;
