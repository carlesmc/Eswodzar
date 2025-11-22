import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Lock, Mail } from 'lucide-react';
import logo from '../assets/logo.png';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login, resetPassword } = useAuth();
    const navigate = useNavigate();

    const handleResetPassword = async () => {
        if (!email) {
            setError('Por favor, escribe tu email primero para recuperar la contraseña.');
            return;
        }
        try {
            setLoading(true);
            const { error } = await resetPassword(email);
            if (error) throw error;
            alert('¡Correo enviado! Revisa tu bandeja de entrada para restablecer tu contraseña.');
        } catch (err) {
            setError(err.message || 'Error al enviar el correo de recuperación.');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const { data, error } = await login(email, password);

            if (error) {
                // Log error only in development mode
                if (import.meta.env.DEV) {
                    console.error('Login Error:', error);
                }
                throw error;
            }

            if (data?.user) {
                navigate('/dashboard');
            }
        } catch (err) {
            setError('Email o contraseña incorrectos.');
            if (import.meta.env.DEV) {
                console.error('Catch Error:', err);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-brand-black flex flex-col justify-center items-center p-4">
            <div className="w-full max-w-md bg-white p-8 rounded-none shadow-2xl relative">
                <Link to="/" className="absolute top-4 left-4 text-gray-400 hover:text-brand-black transition-colors">
                    <ArrowLeft size={24} />
                </Link>

                <div className="text-center mb-8">
                    <img src={logo} alt="ESWODZAR" className="h-12 mx-auto mb-4 invert" />
                    <h2 className="text-3xl font-black uppercase text-brand-black">Bienvenido</h2>
                    <p className="text-gray-500">Accede a tu cuenta de miembro</p>
                </div>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                        <span className="block sm:inline">{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
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
                    <div className="text-right mt-1">
                        <button
                            type="button"
                            onClick={handleResetPassword}
                            className="text-xs text-gray-500 hover:text-brand-orange transition-colors"
                        >
                            ¿Olvidaste tu contraseña?
                        </button>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-brand-black text-white py-4 font-black uppercase tracking-wider hover:bg-brand-orange transition-colors disabled:opacity-50"
                    >
                        {loading ? 'Cargando...' : 'Iniciar Sesión'}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-gray-500">
                    ¿No tienes cuenta?{' '}
                    <Link to="/signup" className="text-brand-orange font-bold hover:underline">
                        Regístrate aquí
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
