import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import heroBg from '../assets/hero_final.jpg';
import logo from '../assets/logo.png';

const Hero = () => {
    return (
        <div id="hero" className="relative h-screen w-full overflow-hidden bg-brand-black">
            {/* Background Image */}
            <div className="absolute inset-0">
                <img
                    src={heroBg}
                    alt="Training outdoors"
                    className="w-full h-full object-cover object-right opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-brand-black via-brand-black/70 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-transparent to-transparent opacity-90" />
            </div>


            {/* Title and Established - Centered */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="absolute top-24 left-0 right-0 z-10 flex flex-col items-center justify-center pt-10"
            >
                <img src={logo} alt="ESWODZAR Logo" className="w-16 md:w-24 mb-6 invert opacity-90" />
                <div className="inline-block bg-brand-orange/80 px-4 py-1 backdrop-blur-sm mb-4">
                    <span className="text-white font-bold tracking-[0.3em] uppercase text-xs md:text-sm">
                        Est. 2025 • Valencia
                    </span>
                </div>

                <h1 className="text-6xl md:text-8xl lg:text-9xl font-black text-white leading-none uppercase tracking-tighter text-center">
                    ES<span className="text-brand-orange">WOD</span>ZAREM?
                </h1>
            </motion.div>

            {/* Content - Centered */}
            <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pointer-events-none">
                {/* Description and Buttons - Centered */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                    className="h-full flex flex-col justify-end items-center text-center pb-64 pointer-events-auto"
                >
                    <p className="text-gray-200 text-lg md:text-2xl max-w-2xl mb-12 font-light leading-relaxed">
                        Gánate el bocadillo. Suda la culpa.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-6 justify-center">
                        <a
                            href="#events"
                            className="px-10 py-4 bg-white text-brand-black font-black uppercase tracking-wider hover:bg-brand-orange hover:text-white transition-all duration-300 min-w-[200px] text-center"
                        >
                            Ver Eventos
                        </a>
                        <Link
                            to="/signup"
                            className="px-10 py-4 border-2 border-white text-white font-black uppercase tracking-wider hover:bg-white hover:text-brand-black transition-all duration-300 min-w-[200px] text-center"
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
