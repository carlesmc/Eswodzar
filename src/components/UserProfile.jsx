import React from 'react';
import { User, MapPin, Dumbbell, Edit2 } from 'lucide-react';
import UserStats from './UserStats';

const UserProfile = ({ profile, isOwnProfile, onEdit }) => {
    if (!profile) return null;

    return (
        <div className="space-y-6">
            {/* Profile Header */}
            <div className="bg-white rounded-none shadow-sm border border-gray-100 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-brand-orange/10 to-gray-100"></div>

                <div className="relative p-6 flex flex-col sm:flex-row items-center sm:items-end gap-6 mt-4">
                    {/* Avatar */}
                    <div className="relative">
                        <div className="w-32 h-32 rounded-full border-4 border-white shadow-md overflow-hidden bg-gray-100 flex items-center justify-center">
                            {profile.profile_photo_url ? (
                                <img
                                    src={profile.profile_photo_url}
                                    alt={profile.first_name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <User className="w-16 h-16 text-gray-400" />
                            )}
                        </div>
                        <div className="absolute bottom-2 right-2 bg-brand-orange text-white text-xs font-bold px-2 py-1 rounded-full border-2 border-white shadow-sm">
                            {profile.fitness_level === 'beginner' && 'Principiante'}
                            {profile.fitness_level === 'intermediate' && 'Intermedio'}
                            {profile.fitness_level === 'advanced' && 'Avanzado'}
                        </div>
                    </div>

                    {/* Info */}
                    <div className="flex-1 text-center sm:text-left">
                        <h1 className="text-3xl font-black uppercase text-brand-black mb-1">
                            {profile.first_name} {profile.last_name}
                        </h1>
                        <div className="flex items-center justify-center sm:justify-start gap-2 text-gray-500 mb-4">
                            <MapPin className="w-4 h-4" />
                            <span>Valencia, ES</span>
                        </div>

                        {profile.bio && (
                            <p className="text-gray-600 max-w-lg italic mb-4">
                                "{profile.bio}"
                            </p>
                        )}
                    </div>

                    {/* Actions */}
                    {isOwnProfile && (
                        <div className="flex gap-2">
                            <button
                                onClick={onEdit}
                                className="bg-gray-100 hover:bg-gray-200 text-gray-700 p-2 rounded-lg transition-colors border border-gray-200"
                                title="Editar Perfil"
                            >
                                <Edit2 className="w-5 h-5" />
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Stats */}
            <UserStats stats={profile} theme="light" />

            {/* Badges Placeholder */}
            <div className="bg-white rounded-none p-6 border border-gray-100 shadow-sm">
                <h3 className="text-xl font-black uppercase text-brand-black mb-4 flex items-center gap-2">
                    <Dumbbell className="w-5 h-5 text-brand-orange" />
                    Logros Recientes
                </h3>
                <div className="text-center py-8 text-gray-400 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                    <p>Participa en eventos para desbloquear insignias.</p>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
