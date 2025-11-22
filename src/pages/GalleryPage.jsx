import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Link } from 'react-router-dom';
import { ArrowLeft, ZoomIn, X, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '../assets/logo.png';

const GalleryPage = () => {
    const [events, setEvents] = useState([]);
    const [selectedEventId, setSelectedEventId] = useState('all');
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(null);

    // Fetch all events that have images
    useEffect(() => {
        const fetchEvents = async () => {
            const { data } = await supabase
                .from('events')
                .select('id, title, date')
                .not('images', 'is', null)
                .order('date', { ascending: false });

            if (data) setEvents(data);
        };
        fetchEvents();
    }, []);

    // Fetch images based on selection
    useEffect(() => {
        const fetchImages = async () => {
            setLoading(true);
            try {
                let query = supabase
                    .from('events')
                    .select('title, date, images')
                    .not('images', 'is', null)
                    .order('date', { ascending: false });

                if (selectedEventId !== 'all') {
                    query = query.eq('id', selectedEventId);
                }

                const { data, error } = await query;
                if (error) throw error;

                const allImages = data.flatMap(event =>
                    (event.images || []).map(img => ({
                        src: img,
                        title: event.title,
                        date: event.date
                    }))
                );

                setImages(allImages);
            } catch (error) {
                console.error('Error fetching images:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchImages();
    }, [selectedEventId]);

    return (
        <div className="min-h-screen bg-brand-black text-white">
            {/* Header */}
            <header className="bg-brand-black border-b border-gray-800 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <Link to="/" className="text-gray-400 hover:text-white transition-colors flex items-center">
                        <ArrowLeft size={24} className="mr-2" />
                        <span className="hidden sm:inline font-bold uppercase text-sm">Volver</span>
                    </Link>
                    <img src={logo} alt="ESWODZAR" className="h-8 invert" />
                    <div className="w-16"></div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
                    <div>
                        <h1 className="text-4xl md:text-6xl font-black uppercase mb-2">Galería Completa</h1>
                        <p className="text-gray-400">Revive cada repetición.</p>
                    </div>

                    {/* Filter Dropdown */}
                    <div className="relative w-full md:w-64">
                        <Filter className="absolute left-3 top-3 text-brand-orange" size={20} />
                        <select
                            value={selectedEventId}
                            onChange={(e) => setSelectedEventId(e.target.value)}
                            className="w-full bg-gray-900 border border-gray-700 text-white pl-10 pr-4 py-3 appearance-none focus:outline-none focus:border-brand-orange cursor-pointer"
                        >
                            <option value="all">Todos los Eventos</option>
                            {events.map(event => (
                                <option key={event.id} value={event.id}>
                                    {event.title} ({new Date(event.date).toLocaleDateString()})
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {loading ? (
                    <div className="text-center py-20 text-gray-500">Cargando fotos...</div>
                ) : images.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {images.map((img, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="relative aspect-square cursor-pointer group overflow-hidden bg-gray-900"
                                onClick={() => setSelectedImage(img)}
                            >
                                <img
                                    src={img.src}
                                    alt={img.title}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    loading="lazy"
                                />
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-4 text-center">
                                    <ZoomIn className="text-brand-orange mb-2" size={24} />
                                    <p className="font-bold uppercase text-xs text-white">{img.title}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 text-gray-500 border border-gray-800 border-dashed">
                        No hay fotos disponibles para este evento.
                    </div>
                )}
            </main>

            {/* Lightbox */}
            <AnimatePresence>
                {selectedImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedImage(null)}
                        className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
                    >
                        <button
                            className="absolute top-4 right-4 text-white hover:text-brand-orange transition-colors"
                            onClick={() => setSelectedImage(null)}
                        >
                            <X size={32} />
                        </button>
                        <img
                            src={selectedImage.src}
                            alt={selectedImage.title}
                            className="max-w-full max-h-[90vh] object-contain"
                        />
                        <div className="absolute bottom-4 left-0 right-0 text-center text-white">
                            <p className="font-bold uppercase">{selectedImage.title}</p>
                            <p className="text-sm text-gray-400">{new Date(selectedImage.date).toLocaleDateString()}</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default GalleryPage;
