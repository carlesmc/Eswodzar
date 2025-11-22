import React, { useState, useEffect } from 'react';
import EventCard from './EventCard';

import { supabase } from '../lib/supabase';

const Events = () => {
    const [eventsList, setEventsList] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const { data, error } = await supabase
                    .from('events')
                    .select('*')
                    .order('date', { ascending: true });

                if (error) throw error;
                setEventsList(data || []);
            } catch (error) {
                console.error('Error fetching events:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    if (loading) {
        return <div className="py-20 text-center">Cargando eventos...</div>;
    }

    return (
        <section id="events" className="py-20 bg-gray-50 scroll-mt-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12">
                    <div>
                        <h2 className="text-3xl md:text-5xl font-black uppercase mb-2">Próximos Eventos</h2>
                        <p className="text-gray-500">Reserva tu plaza. Plazas limitadas a 20 personas.</p>
                    </div>

                </div>

                <div className="flex overflow-x-auto pb-8 gap-8 snap-x snap-mandatory hide-scrollbar">
                    {eventsList.map((event) => (
                        <div key={event.id} className="min-w-[300px] md:min-w-[350px] snap-center">
                            <EventCard
                                id={event.id}
                                date={new Date(event.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'long' })}
                                time={event.time.slice(0, 5)}
                                location={event.location}
                                wod={event.title}
                                bar={event.description || 'Post-WOD sorpresa'}
                                coverImage={event.cover_image}
                                price={event.price}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Events;
