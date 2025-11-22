import React from 'react';
import { Instagram, MessageCircle } from 'lucide-react';
import logo from '../assets/logo.png';

const Footer = () => {
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
            <a
                href="https://chat.whatsapp.com/HqgqcuifspqBtuMxGG527O"
                target="_blank"
                rel="noopener noreferrer"
                className="fixed bottom-6 right-6 bg-[#25D366] text-white p-4 rounded-full shadow-lg hover:scale-110 transition-transform z-50 flex items-center justify-center"
                title="Únete al grupo de WhatsApp"
            >
                <MessageCircle size={32} />
            </a>
        </footer>
    );
};

export default Footer;
