import React, { useState } from 'react';
import { Instagram, MessageCircle } from 'lucide-react';
import logo from '../assets/logo.png';
import peanutIcon from '../assets/peanut_icon.png';

const Footer = () => {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    return (
        <footer className="bg-brand-black text-white pt-20 pb-10 border-t border-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    <div className="col-span-1 md:col-span-2">
                        <img src={logo} alt="ESWODZAR" className="h-16 mb-6 invert" />
                        <p className="text-gray-400 max-w-md mb-8">
                            Una comunidad nacida en Valencia. Unimos el entrenamiento funcional con la cultura del almuerzo. Sudor, risas y 'esmorzaret'.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="w-10 h-10 bg-gray-800 flex items-center justify-center rounded-full hover:bg-brand-orange transition-colors">
                                <Instagram size={20} />
                            </a>
                            <a href="#" className="w-10 h-10 bg-gray-800 flex items-center justify-center rounded-full hover:bg-brand-orange transition-colors">
                                <MessageCircle size={20} />
                            </a>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-lg font-bold uppercase mb-6 text-brand-orange">Enlaces</h4>
                        <ul className="space-y-4 text-gray-400">
                            <li><a href="#mission" className="hover:text-white transition-colors">La Misión</a></li>
                            <li><a href="#events" className="hover:text-white transition-colors">Eventos</a></li>
                            <li><a href="#gallery" className="hover:text-white transition-colors">Galería</a></li>
                            <li><a href="#faq" className="hover:text-white transition-colors">FAQ</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-lg font-bold uppercase mb-6 text-brand-orange">Legal</h4>
                        <ul className="space-y-4 text-gray-400">
                            <li><a href="#" className="hover:text-white transition-colors">Aviso Legal</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Privacidad</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Cookies</a></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-gray-500 text-sm mb-4 md:mb-0">
                        &copy; {new Date().getFullYear()} ESWODZAR. Todos los derechos reservados.
                    </p>
                    <p className="text-gray-600 text-sm">
                        Designed with sweat in Valencia.
                    </p>
                </div>
            </div>

            {/* Sticky WhatsApp CTA */}
            {/* Sticky Email CTA */}
            <button
                onClick={() => setIsPopupOpen(true)}
                className="fixed bottom-6 right-6 bg-white text-brand-orange p-3 rounded-full shadow-lg hover:scale-110 transition-transform z-50 flex items-center justify-center border-2 border-brand-orange"
                title="Contáctanos"
            >
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                    <img src={peanutIcon} alt="Contacto" className="w-8 h-8" />
                </div>
            </button>

            {/* Email Popup */}
            {isPopupOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
                    <div className="bg-white text-brand-black p-8 max-w-md w-full relative shadow-2xl border-t-4 border-brand-orange">
                        <button
                            onClick={() => setIsPopupOpen(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-brand-black"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        <div className="text-center">
                            <div className="w-16 h-16 bg-brand-orange/10 rounded-full flex items-center justify-center mx-auto mb-4 text-brand-orange">
                                <MessageCircle size={32} />
                            </div>
                            <h3 className="text-2xl font-black uppercase mb-2">¿Tienes dudas?</h3>
                            <p className="text-gray-600 mb-6">
                                Envía un email a <a href="mailto:info@eswodzar.es" className="font-bold text-brand-orange hover:underline">info@eswodzar.es</a> y te responderemos en menos de 12h.
                            </p>
                            <button
                                onClick={() => setIsPopupOpen(false)}
                                className="w-full bg-brand-black text-white py-3 font-bold uppercase hover:bg-brand-orange transition-colors"
                            >
                                Entendido
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </footer>
    );
};

export default Footer;
