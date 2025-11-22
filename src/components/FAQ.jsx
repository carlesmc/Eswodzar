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
            question: "¿Necesito estar en forma para unirme?",
            answer: "Para nada. Nuestros entrenamientos son escalables. Si no puedes hacer algo, lo adaptamos. Lo importante es moverse y pasarlo bien."
        },
        {
            question: "¿Cuánto cuesta?",
            answer: "La primera sesión es gratis. Después funcionamos con bonos o pago por sesión (5€). El almuerzo se paga aparte en el bar."
        },
        {
            question: "¿Qué material necesito llevar?",
            answer: "Ropa deportiva cómoda, zapatillas y agua. Nosotros ponemos el material (kettlebells, cuerdas, etc.)."
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
