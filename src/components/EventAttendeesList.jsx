import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Users } from 'lucide-react';
import AttendeeCard from './AttendeeCard';

const EventAttendeesList = ({ eventId, currentUserId }) => {
    const [attendees, setAttendees] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (eventId) {
            fetchAttendees();
        }
    }, [eventId, currentUserId]);

    const fetchAttendees = async () => {
        try {
            const { data, error } = await supabase
                .rpc('get_event_attendees', {
                    p_event_id: eventId,
                    p_current_user_id: currentUserId || '00000000-0000-0000-0000-000000000000' // Handle guest case if needed, though RPC expects UUID
                });

            if (error) throw error;
            setAttendees(data || []);
        } catch (error) {
            console.error('Error fetching attendees:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="text-center py-4 text-gray-400 text-sm">Cargando asistentes...</div>;
    }

    if (attendees.length === 0) {
        return (
            <div className="text-center py-6 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                <Users className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500 text-sm font-medium">Sé el primero en apuntarte.</p>
            </div>
        );
    }

    return (
        <div>
            <h3 className="text-sm font-bold uppercase text-gray-500 mb-3 flex items-center">
                <Users size={16} className="mr-2" />
                Asistentes ({attendees.length})
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-60 overflow-y-auto pr-1">
                {attendees.map((attendee) => (
                    <AttendeeCard key={attendee.user_id} attendee={attendee} />
                ))}
            </div>
        </div>
    );
};

export default EventAttendeesList;
