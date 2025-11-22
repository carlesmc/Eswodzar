import React from 'react';
import { MessageCircle, Zap, Coffee, Music } from 'lucide-react';

const Community = () => {
    const groups = [
        {
            icon: <Zap className="w-6 h-6" />,
            title: "WODs & Info Oficial",
            desc: "Ubicaciones secretas, horarios y material necesario. Si no estás aquí, no entrenas."
        },
        {
            icon: <Coffee className="w-6 h-6" />,
            title: "Ruta del Esmorzaret",
            desc: "Debates serios sobre dónde hacen el mejor cremaet. Organiza tus propias salidas gastronómicas."
        },
        {
            icon: <Music className="w-6 h-6" />,
            title: "Off-Topic & Planes",
            desc: "¿Festival el finde? ¿Escapada a la montaña? Aquí es donde la comunidad cobra vida fuera del entreno."
        }
    ];

    return (
        <section id="community" className="py-20 bg-brand-black text-white relative overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-orange/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                    <div>
                        <h2 className="text-brand-orange font-bold tracking-widest uppercase mb-4 text-sm">
                            El Núcleo
                        </h2>
                        <h3 className="text-4xl md:text-6xl font-black uppercase mb-6 leading-none">
                            No es solo un <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">
                                Grupo de WhatsApp
                            </span>
                        </h3>
                        <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                            Es el vestuario digital. Aquí es donde pasa todo antes y después del sudor.
                            Sin spam, solo buen rollo y planes improvisados.
                        </p>

                        <div className="space-y-6">
                            {groups.map((group, index) => (
                                <div key={index} className="flex items-start">
                                    <div className="bg-gray-800 p-3 rounded-lg text-brand-orange mr-4 shrink-0">
                                        {group.icon}
                                    </div>
                                    <div>
                                        <h4 className="font-bold uppercase text-lg">{group.title}</h4>
                                        <p className="text-gray-500 text-sm">{group.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-10">
                            <a
                                href="https://chat.whatsapp.com/HqgqcuifspqBtuMxGG527O"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center bg-[#25D366] text-white px-8 py-4 font-bold uppercase tracking-wide hover:bg-[#128C7E] transition-all duration-300 group"
                            >
                                <MessageCircle className="mr-3 group-hover:scale-110 transition-transform" />
                                Entrar al Grupo
                            </a>
                            <p className="mt-4 text-xs text-gray-500 uppercase tracking-wider">
                                *Acceso libre • Respeto obligatorio
                            </p>
                        </div>
                    </div>

                    <div className="relative">
                        {/* Mockup visual representation of chat/community */}
                        <div className="border border-gray-800 bg-gray-900/50 backdrop-blur-sm p-6 rounded-xl relative transform rotate-2 hover:rotate-0 transition-transform duration-500">
                            <div className="flex items-center justify-between mb-6 border-b border-gray-800 pb-4">
                                <div className="flex items-center">
                                    <div className="w-10 h-10 bg-brand-orange rounded-full flex items-center justify-center font-bold text-brand-black">ES</div>
                                    <div className="ml-3">
                                        <div className="font-bold">ESWODZAR Community</div>
                                        <div className="text-xs text-[#25D366]">Online</div>
                                    </div>
                                </div>
                                <MessageCircle size={20} className="text-gray-500" />
                            </div>

                            <div className="space-y-4">
                                <div className="bg-gray-800/50 p-3 rounded-lg rounded-tl-none max-w-[80%]">
                                    <p className="text-sm text-gray-300">¿Alguien se anima a un Murph este sábado? 🏋️‍♂️</p>
                                </div>
                                <div className="bg-brand-orange/20 p-3 rounded-lg rounded-tr-none max-w-[80%] ml-auto">
                                    <p className="text-sm text-brand-orange">¡Yo! Pero luego vamos a por ese bocadillo de calamares 🦑</p>
                                </div>
                                <div className="bg-gray-800/50 p-3 rounded-lg rounded-tl-none max-w-[80%]">
                                    <p className="text-sm text-gray-300">📍 Ubicación enviada: Río Turia, Tramo IX</p>
                                </div>
                                <div className="bg-gray-800/50 p-3 rounded-lg rounded-tl-none max-w-[80%]">
                                    <p className="text-sm text-gray-300">📸 [Foto del almuerzo]</p>
                                </div>
                            </div>

                            <div className="mt-6 pt-4 border-t border-gray-800 text-center">
                                <span className="text-xs text-gray-500 uppercase">Únete a +150 miembros activos</span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default Community;
