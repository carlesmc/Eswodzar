import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const FAQItem = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border-b border-gray-200">
            <button
                className="w-full py-6 flex justify-between items-center text-left focus:outline-none"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className="text-lg md:text-xl font-bold uppercase">{question}</span>
                <span className="ml-4 text-brand-orange">
                    {isOpen ? <Minus size={24} /> : <Plus size={24} />}
                </span>
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                    >
                        <p className="pb-6 text-gray-600 leading-relaxed">
                            {answer}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const FAQ = () => {
    const faqs = [
        {
            question: "¿Qué incluyen los planes de suscripción?",
            answer: "Tenemos dos opciones: FREE (acceso limitado a algunos eventos, pago por evento) y PREMIUM (10€/mes). El plan Premium incluye camiseta oficial, prioridad en reservas, acceso a todos los eventos y grupos exclusivos, descuentos en marcas y contenido técnico semanal."
        },
        {
            question: "¿Cómo funciona el pago?",
            answer: "El plan Premium es una suscripción mensual de 10€ sin permanencia. Puedes cancelar cuando quieras. Los eventos sueltos del plan Free se pagan in situ (5€)."
        },
        {
            question: "¿Qué es eso de la camiseta oficial?",
            answer: "Es nuestra piel de guerra. Solo los miembros Premium reciben la camiseta oficial de ESWODZAR al suscribirse. Diseño exclusivo y tejido técnico de calidad."
        },
        {
            question: "¿Necesito estar en forma para unirme?",
            answer: "Para nada. Nuestros entrenamientos son escalables. Si no puedes hacer algo, lo adaptamos. Lo importante es moverse y pasarlo bien."
        },
        {
            question: "¿Dónde quedamos exactamente?",
            answer: "La ubicación varía cada semana a lo largo del cauce del Río Turia. Avisamos por el grupo de WhatsApp 2 días antes."
        }
    ];

    return (
        <section id="faq" className="py-20 bg-white scroll-mt-24">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-black uppercase mb-4">Preguntas Frecuentes</h2>
                    <p className="text-gray-500">Todo lo que necesitas saber antes de sudar.</p>
                </div>

                <div className="space-y-2">
                    {faqs.map((faq, index) => (
                        <FAQItem key={index} {...faq} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FAQ;
