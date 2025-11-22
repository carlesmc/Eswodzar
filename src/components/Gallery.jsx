import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ZoomIn } from 'lucide-react';

const Gallery = () => {
    const [images, setImages] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchGalleryImages = async () => {
            try {
                // Fetch last 3 events that have images
                const { data, error } = await supabase
                    .from('events')
                    .select('title, date, images')
                    .not('images', 'is', null)
                    .order('date', { ascending: false })
                    .limit(3);

                if (error) throw error;

                // Flatten images array and take only the first few to show
                const galleryImages = data.flatMap(event =>
                    (event.images || []).map(img => ({
                        src: img,
                        title: event.title,
                        date: event.date
                    }))
                ).slice(0, 6); // Limit to 6 photos total for the preview

                setImages(galleryImages);
            } catch (error) {
                console.error('Error fetching gallery:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchGalleryImages();
    }, []);

    return (
        <section id="gallery" className="py-20 bg-brand-black text-white scroll-mt-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-end mb-12">
                    <div>
                        <h2 className="text-3xl md:text-5xl font-black uppercase mb-2">Galería</h2>
                        <p className="text-gray-400">Momentos de sufrimiento y gloria.</p>
                    </div>
                    <Link to="/gallery" className="hidden md:block text-brand-orange font-bold uppercase hover:text-white transition-colors">
                        Ver todas las fotos →
                    </Link>
                </div>

                {loading ? (
                    <div className="text-center py-12 text-gray-500">Cargando fotos...</div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {images.map((img, index) => (
                            <motion.div
                                key={index}
                                whileHover={{ scale: 1.02 }}
                                className="relative aspect-square cursor-pointer group overflow-hidden"
                                onClick={() => setSelectedImage(img)}
                            >
                                <img
                                    src={img.src}
                                    alt={img.title}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-4 text-center">
                                    <ZoomIn className="text-brand-orange mb-2" size={24} />
                                    <p className="font-bold uppercase text-sm">{img.title}</p>
                                    <p className="text-xs text-gray-300">{new Date(img.date).toLocaleDateString()}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}

                <div className="mt-8 text-center md:hidden">
                    <Link to="/gallery" className="text-brand-orange font-bold uppercase hover:text-white transition-colors">
                        Ver todas las fotos →
                    </Link>
                </div>
            </div>

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
        </section>
    );
};

export default Gallery;
