import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Lock, Mail, User } from 'lucide-react';
import logo from '../assets/logo.png';

const Signup = () => {
    const [name, setName] = useState('');
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
        <div className="min-h-screen bg-brand-black flex flex-col justify-center items-center p-4">
            <div className="w-full max-w-md bg-white p-8 rounded-none shadow-2xl relative">
                <Link to="/" className="absolute top-4 left-4 text-gray-400 hover:text-brand-black transition-colors">
                    <ArrowLeft size={24} />
                </Link>

                <div className="text-center mb-8">
                    <img src={logo} alt="ESWODZAR" className="h-12 mx-auto mb-4 invert" />
                    <h2 className="text-3xl font-black uppercase text-brand-black">Únete</h2>
                    <p className="text-gray-500">Crea tu cuenta y empieza a entrenar</p>
                </div>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                        <span className="block sm:inline">{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 uppercase mb-2">Nombre Completo</label>
                        <div className="relative">
                            <User className="absolute left-3 top-3 text-gray-400" size={20} />
                            <input
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border-b-2 border-gray-200 focus:outline-none focus:border-brand-orange transition-colors"
                                placeholder="Ej. Vicentín Van Gogh"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 uppercase mb-2">Email</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border-b-2 border-gray-200 focus:outline-none focus:border-brand-orange transition-colors"
                                placeholder="tu@email.com"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 uppercase mb-2">Contraseña</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border-b-2 border-gray-200 focus:outline-none focus:border-brand-orange transition-colors"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-brand-black text-white py-4 font-black uppercase tracking-wider hover:bg-brand-orange transition-colors disabled:opacity-50"
                    >
                        {loading ? 'Cargando...' : 'Crear Cuenta'}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-gray-500">
                    ¿Ya tienes cuenta?{' '}
                    <Link to="/login" className="text-brand-orange font-bold hover:underline">
                        Inicia sesión
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Signup;
