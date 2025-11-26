import React from 'react';
import { Link } from 'react-router-dom';
import { User, Trophy, Users, Calendar, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const CommunityInvite = () => {
    const features = [
        {
            icon: <User className="w-8 h-8" />,
            title: "Tu Perfil Atleta",
            desc: "Crea tu identidad. Sube tu foto, define tu nivel y deja que otros te conozcan antes de llegar al box."
        },
        {
            icon: <Trophy className="w-8 h-8" />,
            title: "Ranking y Logros",
            desc: "La constancia tiene premio. Desbloquea medallas exclusivas y sube en el ranking mensual."
        },
        {
            icon: <Users className="w-8 h-8" />,
            title: "Conecta",
            desc: "Agrega amigos, mira quién asiste a los eventos y no entrenes nunca solo."
        },
        {
            icon: <Calendar className="w-8 h-8" />,
            title: "Gestión Total",
            desc: "Apúntate a eventos en un clic, gestiona tus reservas y valora la experiencia."
        }
    ];

    return (
        <section className="py-24 bg-gray-50 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-brand-orange font-bold tracking-widest uppercase mb-4 text-sm">
                        La Plataforma
                    </h2>
                    <h3 className="text-4xl md:text-5xl font-black uppercase mb-6 text-brand-black">
                        Todo lo que hay dentro
                    </h3>
                    <p className="text-gray-500 text-xl max-w-2xl mx-auto leading-relaxed">
                        ESWODZAR no es solo quedar para entrenar. Hemos construido una experiencia digital completa para ti.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:border-brand-orange hover:shadow-md transition-all group"
                        >
                            <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center text-brand-black mb-6 group-hover:bg-brand-orange group-hover:text-white transition-colors">
                                {feature.icon}
                            </div>
                            <h4 className="text-xl font-black uppercase mb-3">{feature.title}</h4>
                            <p className="text-gray-500 leading-relaxed">
                                {feature.desc}
                            </p>
                        </motion.div>
                    ))}
                </div>

                <div className="text-center">
                    <div className="inline-block p-1 rounded-full bg-gradient-to-r from-brand-orange to-brand-black">
                        <Link
                            to="/signup"
                            className="block px-12 py-4 bg-white rounded-full text-brand-black font-black uppercase tracking-wider hover:bg-gray-50 transition-colors flex items-center"
                        >
                            Únete a la Beta Gratis
                            <ArrowRight className="ml-2 w-5 h-5" />
                        </Link>
                    </div>
                    <p className="mt-4 text-sm text-gray-400 uppercase tracking-widest">
                        Sin tarjeta de crédito • Acceso inmediato
                    </p>
                </div>
            </div>
        </section>
    );
};

export default CommunityInvite;
