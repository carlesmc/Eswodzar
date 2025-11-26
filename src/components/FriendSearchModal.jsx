import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Search, UserPlus, X, User, Check } from 'lucide-react';
import { motion } from 'framer-motion';

const FriendSearchModal = ({ onClose, currentUserId }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [sentRequests, setSentRequests] = useState(new Set());

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchTerm.trim()) return;

        setLoading(true);
        try {
            // Search in user_profiles
            const { data, error } = await supabase
                .from('user_profiles')
                .select('*')
                .or(`first_name.ilike.%${searchTerm}%,last_name.ilike.%${searchTerm}%`)
                .neq('id', currentUserId) // Don't show self
                .limit(10);

            if (error) throw error;
            setSearchResults(data || []);
        } catch (error) {
            console.error('Error searching users:', error);
        } finally {
            setLoading(false);
        }
    };

    const sendRequest = async (targetUserId) => {
        try {
            const { error } = await supabase.rpc('send_friend_request', { p_friend_id: targetUserId });

            if (error) {
                if (error.message.includes('already exists')) {
                    alert('Ya existe una amistad o solicitud pendiente con este usuario.');
                } else {
                    throw error;
                }
            } else {
                setSentRequests(prev => new Set(prev).add(targetUserId));
            }
        } catch (error) {
            console.error('Error sending request:', error);
            alert('Error al enviar solicitud');
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white p-6 max-w-md w-full relative z-10 shadow-2xl rounded-lg"
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-brand-black"
                >
                    <X size={24} />
                </button>

                <h3 className="text-2xl font-black uppercase mb-6">Buscar Amigos</h3>

                <form onSubmit={handleSearch} className="mb-6">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Buscar por nombre..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-200 pl-10 pr-4 py-3 rounded-lg focus:outline-none focus:border-brand-orange transition-colors"
                        />
                        <Search className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
                    </div>
                </form>

                <div className="space-y-4 max-h-60 overflow-y-auto">
                    {loading ? (
                        <div className="text-center text-gray-400 py-4">Buscando...</div>
                    ) : searchResults.length > 0 ? (
                        searchResults.map((user) => (
                            <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center">
                                    <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden mr-3">
                                        {user.profile_photo_url ? (
                                            <img
                                                src={user.profile_photo_url}
                                                alt={user.first_name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                                                <User size={16} />
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm">{user.first_name} {user.last_name}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => sendRequest(user.id)}
                                    disabled={sentRequests.has(user.id)}
                                    className={`p-2 rounded-full transition-colors ${sentRequests.has(user.id)
                                            ? 'bg-green-100 text-green-600'
                                            : 'bg-brand-black text-white hover:bg-brand-orange'
                                        }`}
                                >
                                    {sentRequests.has(user.id) ? <Check size={16} /> : <UserPlus size={16} />}
                                </button>
                            </div>
                        ))
                    ) : searchTerm && (
                        <div className="text-center text-gray-400 py-4">No se encontraron usuarios.</div>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default FriendSearchModal;
