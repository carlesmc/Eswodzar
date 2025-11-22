import React from 'react';
import { motion } from 'framer-motion';
import { Dumbbell, Beer, Users } from 'lucide-react';

const Mission = () => {
    const features = [
        {
            icon: <Dumbbell className="w-8 h-8 text-brand-orange" />,
            title: "Entreno Funcional",
            description: "WODs adaptables a todos los niveles. Sin espejos, sin egos, solo sudor y aire libre."
        },
        {
            icon: <Beer className="w-8 h-8 text-brand-orange" />,
            title: "Almuerzo Sagrado",
            description: "Porque el deporte es la excusa. Bocadillo, cacaos y cerveza Turia son la recompensa."
        },
        {
            icon: <Users className="w-8 h-8 text-brand-orange" />,
            title: "Comunidad Real",
            description: "Conoce gente nueva en Valencia con tus mismos valores: vida sana y buen rollo."
        }
    ];

    return (
        <section id="mission" className="py-20 bg-white scroll-mt-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-black uppercase mb-4">La Misión</h2>
                    <div className="w-24 h-1 bg-brand-orange mx-auto"></div>
                    <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto">
                        ESWODZAR nace de una idea simple: Valencia es el mejor gimnasio del mundo y el almuerzo es su mejor recuperación.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.2 }}
                            className="flex flex-col items-center text-center p-6 border border-gray-100 hover:border-brand-orange transition-colors duration-300 group"
                        >
                            <div className="mb-6 p-4 bg-gray-50 rounded-full group-hover:bg-brand-orange/10 transition-colors">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-bold uppercase mb-3">{feature.title}</h3>
                            <p className="text-gray-500 leading-relaxed">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Mission;
