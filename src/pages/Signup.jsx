import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Lock, Mail, User } from 'lucide-react';
import logo from '../assets/logo.png';

import authBg from '../assets/auth_bg_new.jpg';

const Signup = () => {
    // ... existing state ...
    const [name, setName] = useState('');
    const [selectedPlan, setSelectedPlan] = useState('premium');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { signup } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await signup(email, password, name);
            navigate('/dashboard');
        } catch (err) {
            setError('Error al registrarse. Inténtalo de nuevo.');
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-brand-black flex flex-col justify-center items-center p-4 md:p-8 relative overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <img
                    src={authBg}
                    alt="Background"
                    className="w-full h-full object-cover opacity-40"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-brand-black/80 to-brand-black/40" />
            </div>

            <div className="w-full max-w-6xl bg-white shadow-2xl flex flex-col md:flex-row overflow-hidden relative z-10">

                {/* Left Side - Plans & Benefits */}
                <div className="w-full md:w-1/2 bg-gray-900 text-white p-8 md:p-12 flex flex-col justify-center relative overflow-hidden">
                    {/* Background accents */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-brand-orange/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-orange/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

                    <div className="relative z-10">
                        <h2 className="text-3xl md:text-4xl font-black uppercase mb-2">Elige tu camino</h2>
                        <p className="text-gray-400 mb-8">Únete a la comunidad de entrenamiento funcional más canalla de Valencia.</p>

                        <div className="space-y-6">
                            {/* Premium Plan */}
                            <div
                                onClick={() => setSelectedPlan('premium')}
                                className={`border-2 p-6 relative cursor-pointer transition-all ${selectedPlan === 'premium' ? 'border-brand-orange bg-brand-orange/10' : 'border-gray-700 bg-gray-800/50 hover:bg-gray-800'}`}
                            >
                                <div className="absolute -top-3 right-4 bg-brand-orange text-brand-black text-xs font-bold uppercase px-2 py-1">
                                    Recomendado
                                </div>
                                <div className="flex justify-between items-end mb-4">
                                    <div>
                                        <h3 className={`text-xl font-black uppercase ${selectedPlan === 'premium' ? 'text-brand-orange' : 'text-white'}`}>Plan Premium</h3>
                                        <p className="text-sm text-gray-400">Para los que van en serio</p>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-3xl font-black text-white">10€</span>
                                        <span className="text-sm text-gray-400">/mes</span>
                                    </div>
                                </div>
                                <ul className="space-y-3 text-sm">
                                    <li className="flex items-start">
                                        <span className="text-brand-orange mr-2">✓</span>
                                        <span className="font-bold text-white">Camiseta Oficial ESWODZAR</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="text-brand-orange mr-2">✓</span>
                                        Prioridad en reserva de plazas
                                    </li>
                                    <li className="flex items-start">
                                        <span className="text-brand-orange mr-2">✓</span>
                                        Acceso a grupos exclusivos
                                    </li>
                                    <li className="flex items-start">
                                        <span className="text-brand-orange mr-2">✓</span>
                                        15% dto. en marcas colaboradoras
                                    </li>
                                    <li className="flex items-start">
                                        <span className="text-brand-orange mr-2">✓</span>
                                        Contenido técnico semanal
                                    </li>
                                    <li className="flex items-start">
                                        <span className="text-brand-orange mr-2">✓</span>
                                        Sorteos mensuales de material
                                    </li>
                                </ul>
                                {selectedPlan === 'premium' && (
                                    <div className="mt-4 text-center">
                                        <span className="bg-brand-orange text-brand-black text-xs font-bold uppercase px-3 py-1 rounded-full">Seleccionado</span>
                                    </div>
                                )}
                            </div>

                            {/* Free Plan */}
                            <div
                                onClick={() => setSelectedPlan('free')}
                                className={`border p-6 transition-all cursor-pointer ${selectedPlan === 'free' ? 'border-white bg-white/10 opacity-100' : 'border-gray-700 opacity-75 hover:opacity-100'}`}
                            >
                                <div className="flex justify-between items-end mb-2">
                                    <h3 className="text-lg font-bold uppercase text-white">Plan Free</h3>
                                    <span className="text-xl font-bold text-white">0€</span>
                                </div>
                                <p className="text-xs text-gray-400 mb-4">Pago por evento (5€/evento)</p>
                                <ul className="space-y-2 text-sm text-gray-400">
                                    <li className="flex items-start">
                                        <span className="text-gray-500 mr-2">•</span>
                                        Acceso limitado a eventos
                                    </li>
                                    <li className="flex items-start">
                                        <span className="text-gray-500 mr-2">•</span>
                                        Comunidad básica
                                    </li>
                                </ul>
                                {selectedPlan === 'free' && (
                                    <div className="mt-4 text-center">
                                        <span className="bg-white text-brand-black text-xs font-bold uppercase px-3 py-1 rounded-full">Seleccionado</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side - Form */}
                <div className="w-full md:w-1/2 p-8 md:p-12 relative">
                    <Link to="/" className="absolute top-4 left-4 text-gray-400 hover:text-brand-black transition-colors">
                        <ArrowLeft size={24} />
                    </Link>

                    <div className="max-w-sm mx-auto mt-8">
                        <div className="text-center mb-8">
                            <img src={logo} alt="ESWODZAR" className="h-10 mx-auto mb-4 invert" />
                            <h2 className="text-2xl font-black uppercase text-brand-black">Crea tu Cuenta</h2>
                        </div>

                        {error && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                                <span className="block sm:inline">{error}</span>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Nombre Completo</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-3 text-gray-400" size={18} />
                                    <input
                                        type="text"
                                        required
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border-b-2 border-gray-200 focus:outline-none focus:border-brand-orange transition-colors text-sm"
                                        placeholder="Ej. Vicentín Van Gogh"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border-b-2 border-gray-200 focus:outline-none focus:border-brand-orange transition-colors text-sm"
                                        placeholder="tu@email.com"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Contraseña</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
                                    <input
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border-b-2 border-gray-200 focus:outline-none focus:border-brand-orange transition-colors text-sm"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-brand-black text-white py-4 font-black uppercase tracking-wider hover:bg-brand-orange transition-colors disabled:opacity-50 mt-4"
                            >
                                {loading ? 'Cargando...' : 'Continuar'}
                            </button>
                        </form>

                        <div className="mt-6 text-center text-xs text-gray-500">
                            ¿Ya tienes cuenta?{' '}
                            <Link to="/login" className="text-brand-orange font-bold hover:underline">
                                Inicia sesión
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;
