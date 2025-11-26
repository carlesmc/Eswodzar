import React from 'react';
import { User, Star } from 'lucide-react';

const AttendeeCard = ({ attendee }) => {
    return (
        <div className={`flex items-center p-2 rounded-lg border ${attendee.is_friend ? 'bg-brand-orange/5 border-brand-orange/30' : 'bg-white border-gray-100'}`}>
            <div className="relative w-10 h-10 rounded-full bg-gray-200 overflow-hidden mr-3 flex-shrink-0">
                {attendee.profile_photo_url ? (
                    <img
                        src={attendee.profile_photo_url}
                        alt={attendee.first_name}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                        <User size={16} />
                    </div>
                )}
                {attendee.is_friend && (
                    <div className="absolute bottom-0 right-0 bg-brand-orange text-white rounded-full p-0.5 border-2 border-white" title="Amigo">
                        <Star size={8} fill="currentColor" />
                    </div>
                )}
            </div>
            <div className="overflow-hidden">
                <p className={`text-sm font-bold truncate ${attendee.is_friend ? 'text-brand-orange' : 'text-brand-black'}`}>
                    {attendee.first_name} {attendee.last_name}
                </p>
                <p className="text-xs text-gray-500 truncate">
                    {attendee.status === 'confirmed' ? 'Confirmado' : attendee.status}
                </p>
            </div>
        </div>
    );
};

export default AttendeeCard;
