import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { useNavigate, Link } from 'react-router-dom';
import { LogOut, User, CreditCard, Calendar, Settings, X, Check, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Dashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [activeModal, setActiveModal] = useState(null); // 'events', 'subscription', 'settings'

    useEffect(() => {
        if (!user) {
            navigate('/login');
        }
    }, [user, navigate]);

    if (!user) return null;

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const closeModal = () => setActiveModal(null);

    // Check for password reset mode
    const [resetMode, setResetMode] = useState(false);
    const [newPassword, setNewPassword] = useState('');

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        if (params.get('reset') === 'true') {
            setResetMode(true);
            setActiveModal('reset_password');
        }
    }, []);

    const handlePasswordUpdate = async (e) => {
        e.preventDefault();
        try {
            const { error } = await supabase.auth.updateUser({ password: newPassword });
            if (error) throw error;
            alert('¡Contraseña actualizada! Por favor, inicia sesión de nuevo.');
            await logout();
            navigate('/login');
        } catch (error) {
            alert('Error al actualizar la contraseña: ' + error.message);
        }
    };

    // Fetch User Registrations
    const [myEvents, setMyEvents] = useState([]);
    useEffect(() => {
        if (user) {
            const fetchRegistrations = async () => {
                const { data, error } = await supabase
                    .from('registrations')
                    .select('*, events(*)')
                    .eq('user_id', user.id)
                    .order('created_at', { ascending: false });

                if (!error && data) {
                    setMyEvents(data);
                }
            };
            fetchRegistrations();
        }
    }, [user]);

    // Filter upcoming events for "Recent Activity" / "Upcoming"
    const upcomingEvents = myEvents.filter(reg => new Date(reg.events.date) >= new Date());

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Dashboard Header */}
            <header className="bg-white shadow-sm sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <div className="flex items-center">
                        <Link to="/" className="mr-4 text-gray-400 hover:text-brand-black transition-colors">
                            <ArrowLeft size={24} />
                        </Link>
                        <h1 className="text-2xl font-black uppercase text-brand-black">Mi Cuenta</h1>
                    </div>
                    <div className="flex items-center space-x-6">
                        <Link to="/" className="hidden md:block text-sm font-bold uppercase text-gray-500 hover:text-brand-orange transition-colors">
                            Volver al Inicio
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="flex items-center text-gray-500 hover:text-red-600 transition-colors text-sm font-bold uppercase"
                        >
                            <LogOut size={18} className="mr-2" />
                            Cerrar Sesión
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Welcome Section */}
                <div className="bg-brand-black text-white p-8 rounded-none shadow-lg mb-8 relative overflow-hidden">
                    <div className="relative z-10">
                        <h2 className="text-3xl font-black uppercase mb-2">Hola, {user.name}</h2>
                        <p className="text-gray-400">Bienvenido a tu panel de control.</p>

                        <div className="mt-6 inline-flex items-center bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
                            <div className={`w-3 h-3 rounded-full mr-3 ${user?.membership === 'active' ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                            <span className="uppercase text-xs font-bold tracking-wider">
                                Estado: {user?.membership === 'active' ? 'Membresía Activa' : 'Cuenta Gratuita'}
                            </span>
                        </div>
                    </div>
                    <div className="absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-brand-orange/20 to-transparent pointer-events-none"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Stats / Quick Actions */}
                    <div
                        onClick={() => setActiveModal('events')}
                        className="bg-white p-6 shadow-sm border border-gray-100 group hover:border-brand-orange transition-colors cursor-pointer"
                    >
                        <div className="bg-gray-50 w-12 h-12 flex items-center justify-center mb-4 group-hover:bg-brand-orange group-hover:text-white transition-colors">
                            <Calendar size={24} />
                        </div>
                        <h3 className="text-xl font-bold uppercase mb-2">Mis Eventos</h3>
                        <p className="text-gray-500 text-sm">Gestiona tus próximas asistencias y revisa tu historial.</p>
                    </div>

                    <div
                        onClick={() => setActiveModal('subscription')}
                        className="bg-white p-6 shadow-sm border border-gray-100 group hover:border-brand-orange transition-colors cursor-pointer"
                    >
                        <div className="bg-gray-50 w-12 h-12 flex items-center justify-center mb-4 group-hover:bg-brand-orange group-hover:text-white transition-colors">
                            <CreditCard size={24} />
                        </div>
                        <h3 className="text-xl font-bold uppercase mb-2">Suscripción</h3>
                        <p className="text-gray-500 text-sm">Gestiona tu método de pago y facturas.</p>
                    </div>

                    <div
                        onClick={() => setActiveModal('settings')}
                        className="bg-white p-6 shadow-sm border border-gray-100 group hover:border-brand-orange transition-colors cursor-pointer"
                    >
                        <div className="bg-gray-50 w-12 h-12 flex items-center justify-center mb-4 group-hover:bg-brand-orange group-hover:text-white transition-colors">
                            <Settings size={24} />
                        </div>
                        <h3 className="text-xl font-bold uppercase mb-2">Configuración</h3>
                        <p className="text-gray-500 text-sm">Actualiza tus datos personales y contraseña.</p>
                    </div>
                </div>

                {/* Upcoming Events (Replaces Recent Activity) */}
                <div className="mt-12">
                    <h3 className="text-xl font-black uppercase mb-6">Próximos Eventos</h3>
                    {upcomingEvents.length > 0 ? (
                        <div className="grid gap-4">
                            {upcomingEvents.map((reg) => (
                                <div key={reg.id} className="bg-white border border-gray-100 p-6 flex justify-between items-center shadow-sm">
                                    <div>
                                        <h4 className="font-bold uppercase text-lg">{reg.events.title}</h4>
                                        <p className="text-gray-500 text-sm">
                                            {new Date(reg.events.date).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })} • {reg.events.time.slice(0, 5)}
                                        </p>
                                        <p className="text-gray-400 text-xs mt-1">{reg.events.location}</p>
                                    </div>
                                    <div className="text-right">
                                        <span className="block px-3 py-1 bg-green-100 text-green-800 text-xs font-bold uppercase rounded-full mb-2">
                                            Confirmado
                                        </span>
                                        {reg.lunch_option && (
                                            <span className="text-xs text-brand-orange font-bold uppercase">
                                                + Almuerzo
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white border border-gray-100 p-8 text-center text-gray-400">
                            No tienes eventos próximos. ¡Apúntate a uno!
                        </div>
                    )}
                </div>
            </main>

            {/* Modals */}
            <AnimatePresence>
                {activeModal && activeModal !== 'reset_password' && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={closeModal}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
                        >
                            <button
                                onClick={closeModal}
                                className="absolute top-4 right-4 text-gray-400 hover:text-brand-black transition-colors"
                            >
                                <X size={24} />
                            </button>

                            {/* Events Modal */}
                            {activeModal === 'events' && (
                                <div className="p-8">
                                    <h2 className="text-2xl font-black uppercase mb-6">Mis Eventos</h2>
                                    <div className="space-y-4">
                                        {myEvents.length > 0 ? (
                                            myEvents.map((reg) => (
                                                <div key={reg.id} className="border border-gray-100 p-4 flex justify-between items-center">
                                                    <div>
                                                        <h3 className="font-bold uppercase">{reg.events.title}</h3>
                                                        <p className="text-sm text-gray-500">
                                                            {new Date(reg.events.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                        </p>
                                                    </div>
                                                    <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-bold uppercase rounded-full">
                                                        {reg.status === 'confirmed' ? 'Asistido/Confirmado' : reg.status}
                                                    </span>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-center text-gray-400 text-sm pt-4">No tienes historial de eventos.</p>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Subscription Modal */}
                            {activeModal === 'subscription' && (
                                <div className="p-8">
                                    <h2 className="text-2xl font-black uppercase mb-6">Planes de Membresía</h2>
                                    <div className="grid md:grid-cols-2 gap-6">
                                        {/* Free Plan */}
                                        <div className="border border-gray-200 p-6 relative">
                                            {user.membership !== 'active' && (
                                                <div className="absolute top-0 right-0 bg-gray-100 text-gray-600 text-xs font-bold px-2 py-1 uppercase">Plan Actual</div>
                                            )}
                                            <h3 className="text-xl font-black uppercase mb-2">Gratuito</h3>
                                            <p className="text-3xl font-bold mb-4">0€<span className="text-sm text-gray-400 font-normal">/mes</span></p>
                                            <ul className="space-y-2 mb-6 text-sm text-gray-600">
                                                <li className="flex items-center"><Check size={16} className="mr-2 text-green-500" /> Acceso limitado a eventos</li>
                                                <li className="flex items-center"><Check size={16} className="mr-2 text-green-500" /> Pago por evento (5€)</li>
                                                <li className="flex items-center"><Check size={16} className="mr-2 text-green-500" /> Comunidad básica</li>
                                            </ul>
                                            <button className="w-full py-3 border-2 border-gray-200 font-bold uppercase text-sm text-gray-400 cursor-not-allowed">
                                                {user.membership !== 'active' ? 'Seleccionado' : 'Cambiar a Free'}
                                            </button>
                                        </div>

                                        {/* Premium Plan */}
                                        <div className="border-2 border-brand-orange p-6 relative bg-orange-50/10">
                                            {user.membership === 'active' && (
                                                <div className="absolute top-0 right-0 bg-brand-orange text-white text-xs font-bold px-2 py-1 uppercase">Plan Actual</div>
                                            )}
                                            <h3 className="text-xl font-black uppercase mb-2 text-brand-orange">Premium</h3>
                                            <p className="text-3xl font-bold mb-4">10€<span className="text-sm text-gray-400 font-normal">/mes</span></p>
                                            <ul className="space-y-2 mb-6 text-sm text-gray-600">
                                                <li className="flex items-center"><Check size={16} className="mr-2 text-brand-orange" /> Todo lo del plan gratuito</li>
                                                <li className="flex items-center"><Check size={16} className="mr-2 text-brand-orange" /> Camiseta Oficial ESWODZAR</li>
                                                <li className="flex items-center"><Check size={16} className="mr-2 text-brand-orange" /> Prioridad en reservas</li>
                                                <li className="flex items-center"><Check size={16} className="mr-2 text-brand-orange" /> Acceso a grupos exclusivos</li>
                                                <li className="flex items-center"><Check size={16} className="mr-2 text-brand-orange" /> Descuentos en partners</li>
                                            </ul>
                                            <button className="w-full py-3 bg-brand-black text-white font-bold uppercase text-sm hover:bg-brand-orange transition-colors">
                                                {user.membership === 'active' ? 'Gestionar Suscripción' : 'Mejorar Plan'}
                                            </button>
                                        </div>
                                    </div>
                                    <p className="text-xs text-gray-400 text-center mt-6">
                                        Pagos seguros procesados por Stripe. Puedes cancelar en cualquier momento.
                                    </p>
                                </div>
                            )}

                            {/* Settings Modal */}
                            {activeModal === 'settings' && (
                                <div className="p-8">
                                    <h2 className="text-2xl font-black uppercase mb-6">Configuración</h2>
                                    <form className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 uppercase mb-2">Nombre</label>
                                            <input
                                                type="text"
                                                defaultValue={user.name}
                                                className="w-full bg-gray-50 border-b-2 border-gray-200 p-3 focus:outline-none focus:border-brand-orange"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 uppercase mb-2">Email</label>
                                            <input
                                                type="email"
                                                defaultValue={user.email}
                                                className="w-full bg-gray-50 border-b-2 border-gray-200 p-3 focus:outline-none focus:border-brand-orange"
                                            />
                                        </div>
                                        <div className="pt-4">
                                            <button className="bg-brand-black text-white px-6 py-3 font-bold uppercase text-sm hover:bg-brand-orange transition-colors">
                                                Guardar Cambios
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            )}
                        </motion.div>
                    </div>
                )}

                {/* Mandatory Password Reset Modal */}
                {activeModal === 'reset_password' && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="absolute inset-0 bg-black/90 backdrop-blur-md" // Darker background, no click to close
                        />

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="relative bg-white w-full max-w-md p-8 shadow-2xl z-10"
                        >
                            <h2 className="text-2xl font-black uppercase mb-4 text-center">Nueva Contraseña</h2>
                            <p className="text-gray-500 text-center mb-6 text-sm">
                                Por seguridad, debes establecer una nueva contraseña para tu cuenta.
                            </p>

                            <form onSubmit={handlePasswordUpdate} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 uppercase mb-2">Nueva Contraseña</label>
                                    <input
                                        type="password"
                                        required
                                        minLength={6}
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="w-full bg-gray-50 border-b-2 border-gray-200 p-3 focus:outline-none focus:border-brand-orange"
                                        placeholder="Mínimo 6 caracteres"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="w-full bg-brand-black text-white py-3 font-black uppercase hover:bg-brand-orange transition-colors"
                                >
                                    Actualizar y Salir
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Dashboard;
