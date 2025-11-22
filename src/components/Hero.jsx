import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import heroBg from '../assets/hero_rotated.png';

const Hero = () => {
    return (
        <div id="hero" className="relative h-screen w-full overflow-hidden bg-brand-black">
            {/* Background Image */}
            <div className="absolute inset-0">
                <img
                    src={heroBg}
                    alt="Training outdoors"
                    className="w-full h-full object-cover opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-transparent to-transparent opacity-90" />
            </div>

            {/* Content */}
            <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center text-center pt-20">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="max-w-4xl"
                >
                    <h1 className="text-6xl md:text-8xl lg:text-9xl font-black text-white leading-none mb-8 uppercase tracking-tighter">
                        Sudor <span className="text-brand-orange">y</span><br />
                        <span className="text-white">Almuerzo</span>
                    </h1>

                    <div className="inline-block bg-brand-orange/80 px-4 py-1 mb-8 backdrop-blur-sm">
                        <span className="text-white font-bold tracking-[0.3em] uppercase text-xs md:text-sm">
                            Est. 2025 • Valencia
                        </span>
                    </div>

                    <p className="text-gray-200 text-lg md:text-2xl max-w-2xl mx-auto mb-12 font-light leading-relaxed">
                        La comunidad donde el entrenamiento funcional termina con la sagrada tradición valenciana.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-6 justify-center">
                        <a
                            href="#events"
                            className="px-10 py-4 bg-white text-brand-black font-black uppercase tracking-wider hover:bg-brand-orange hover:text-white transition-all duration-300 min-w-[200px]"
                        >
                            Ver Eventos
                        </a>
                        <Link
                            to="/signup"
                            className="px-10 py-4 border-2 border-white text-white font-black uppercase tracking-wider hover:bg-white hover:text-brand-black transition-all duration-300 min-w-[200px]"
                        >
                            Unirse Ahora
                        </Link>
                    </div>
                </motion.div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 1 }}
                className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-white flex flex-col items-center"
            >
                <span className="text-xs uppercase tracking-widest mb-2">Scroll</span>
                <div className="w-[1px] h-12 bg-gradient-to-b from-white to-transparent"></div>
            </motion.div>
        </div>
    );
};

export default Hero;
