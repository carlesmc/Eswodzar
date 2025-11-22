import React from 'react';
import { Calendar, MapPin, Clock, Beer } from 'lucide-react';
import { Link } from 'react-router-dom';

const EventCard = ({ id, date, time, location, wod, bar, coverImage }) => {
    return (
        <div className="bg-white border border-gray-100 hover:shadow-xl transition-all duration-300 group flex flex-col h-full">
            {/* Image Section */}
            <div className="h-48 bg-gray-200 relative overflow-hidden">
                {coverImage && (
                    <img
                        src={coverImage}
                        alt={wod}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                )}
                <div className="absolute top-4 left-4 bg-brand-black text-white px-3 py-1 text-xs font-bold uppercase tracking-wider">
                    {date}
                </div>
            </div>

            <div className="p-6 flex-grow flex flex-col">
                <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center text-gray-500 text-sm">
                        <Clock size={14} className="mr-1" />
                        {time}
                    </div>
                </div>

                <div className="mb-6 flex-grow">
                    <h3 className="text-xl font-black uppercase mb-2 group-hover:text-brand-orange transition-colors">
                        {wod}
                    </h3>
                    <div className="flex items-center text-gray-500 text-sm mb-1">
                        <MapPin size={14} className="mr-2" />
                        {location}
                    </div>
                    <div className="flex items-center text-gray-500 text-sm">
                        <Beer size={14} className="mr-2" />
                        Post-WOD: {bar}
                    </div>
                </div>

                <Link
                    to={`/event/${id}`}
                    className="block w-full bg-gray-100 text-brand-black text-center py-3 font-bold uppercase text-sm hover:bg-brand-black hover:text-white transition-colors"
                >
                    Apuntarse
                </Link>
            </div>
        </div>
    );
};

export default EventCard;
