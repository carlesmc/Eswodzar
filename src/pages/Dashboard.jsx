import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { useNavigate, Link } from 'react-router-dom';
import { LogOut, User, CreditCard, Calendar, Settings, ArrowLeft, LayoutDashboard, X, Check, Edit2, Users, UserPlus, Award, Trophy } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ProfileHeader from '../components/ProfileHeader';
import UserStats from '../components/UserStats';
import ProfileEditor from '../components/ProfileEditor';
import VisibilitySettings from '../components/VisibilitySettings';
import FriendsList from '../components/FriendsList';
import FriendRequests from '../components/FriendRequests';
import FriendSearchModal from '../components/FriendSearchModal';
import BadgesList from '../components/BadgesList';
import Leaderboard from '../components/Leaderboard';

const Dashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'edit_profile', 'friends', 'badges', 'leaderboard'
    const [activeModal, setActiveModal] = useState(null); // 'events', 'subscription', 'settings', 'reset_password', 'search_friends'
    const [userProfile, setUserProfile] = useState(null);

    // Check for password reset mode
    const [newPassword, setNewPassword] = useState('');

    useEffect(() => {
        if (!user) {
            navigate('/login');
        } else {
            fetchUserProfile();
        }

        const params = new URLSearchParams(window.location.search);
        if (params.get('reset') === 'true') {
            setActiveModal('reset_password');
        }
    }, [user, navigate]);

    const fetchUserProfile = async () => {
        try {
            const { data, error } = await supabase
                .from('user_profiles')
                .select('*')
                .eq('id', user.id)
                .single();

            if (!error && data) {
                setUserProfile(data);
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const closeModal = () => setActiveModal(null);

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

    const handleVisibilityChange = async (value) => {
        try {
            const { error } = await supabase
                .from('user_profiles')
                .update({ visibility: value })
                .eq('id', user.id);

            if (error) throw error;

            // Update local state
            setUserProfile(prev => ({ ...prev, visibility: value }));
        } catch (error) {
            console.error('Error updating visibility:', error);
            alert('Error al actualizar la visibilidad');
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

    // Filter upcoming events
    const upcomingEvents = myEvents.filter(reg => {
        if (!reg.events?.date) return false;
        const eventDate = new Date(reg.events.date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return eventDate >= today;
    });

    if (!user) return null;

    const renderContent = () => {
        switch (activeTab) {
            case 'edit_profile':
                return (
                    <ProfileEditor
                        profile={userProfile}
                        onSave={() => {
                            fetchUserProfile();
                            setActiveTab('overview');
                        }}
                        onCancel={() => setActiveTab('overview')}
                    />
                );
            case 'friends':
                return (
                    <div>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-black uppercase">Mis Amigos</h2>
                            <button
                                onClick={() => setActiveModal('search_friends')}
                                className="bg-brand-black text-white px-4 py-2 rounded-full font-bold uppercase text-sm flex items-center hover:bg-brand-orange transition-colors"
                            >
                                <UserPlus size={18} className="mr-2" />
                                Buscar Amigos
                            </button>
                        </div>

                        <FriendRequests userId={user.id} onRequestProcessed={() => {
                            // Trigger refresh of friends list if needed, or just let the component handle it
                            // Ideally we would trigger a re-fetch in FriendsList via a key or prop
                            // For now, simple re-render is fine
                        }} />

                        <FriendsList userId={user.id} />
                    </div>
                );
            case 'badges':
                return (
                    <div>
                        <h2 className="text-2xl font-black uppercase mb-6">Mis Logros</h2>
                        <BadgesList userId={user.id} />
                    </div>
                );
            case 'leaderboard':
                return (
                    <div>
                        <h2 className="text-2xl font-black uppercase mb-6">Ranking</h2>
                        <Leaderboard />
                    </div>
                );
            case 'overview':
            default:
                return (
                    <>
                        {/* Profile Header & Stats */}
                        <ProfileHeader profile={userProfile} />
                        <UserStats stats={userProfile} theme="light" />

                        {/* Action Buttons Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                            {/* Edit Profile Card */}
                            <div
                                onClick={() => setActiveTab('edit_profile')}
                                className="bg-white p-6 shadow-sm border border-gray-100 group hover:border-brand-orange transition-colors cursor-pointer"
                            >
                                <div className="bg-gray-50 w-12 h-12 flex items-center justify-center mb-4 group-hover:bg-brand-orange group-hover:text-white transition-colors">
                                    <Edit2 size={24} />
                                </div>
                                <h3 className="text-xl font-bold uppercase mb-2">Editar Perfil</h3>
                                <p className="text-gray-500 text-sm">Modificar foto, bio y datos personales.</p>
                            </div>

                            {/* Friends Card */}
                            <div
                                onClick={() => setActiveTab('friends')}
                                className="bg-white p-6 shadow-sm border border-gray-100 group hover:border-brand-orange transition-colors cursor-pointer"
                            >
                                <div className="bg-gray-50 w-12 h-12 flex items-center justify-center mb-4 group-hover:bg-brand-orange group-hover:text-white transition-colors">
                                    <Users size={24} />
                                </div>
                                <h3 className="text-xl font-bold uppercase mb-2">Amigos</h3>
                                <p className="text-gray-500 text-sm">Gestiona tus amistades y solicitudes.</p>
                            </div>

                            {/* Badges Card */}
                            <div
                                onClick={() => setActiveTab('badges')}
                                className="bg-white p-6 shadow-sm border border-gray-100 group hover:border-brand-orange transition-colors cursor-pointer"
                            >
                                <div className="bg-gray-50 w-12 h-12 flex items-center justify-center mb-4 group-hover:bg-brand-orange group-hover:text-white transition-colors">
                                    <Award size={24} />
                                </div>
                                <h3 className="text-xl font-bold uppercase mb-2">Logros</h3>
                                <p className="text-gray-500 text-sm">Consulta tus medallas y progreso.</p>
                            </div>

                            {/* Leaderboard Card */}
                            <div
                                onClick={() => setActiveTab('leaderboard')}
                                className="bg-white p-6 shadow-sm border border-gray-100 group hover:border-brand-orange transition-colors cursor-pointer"
                            >
                                <div className="bg-gray-50 w-12 h-12 flex items-center justify-center mb-4 group-hover:bg-brand-orange group-hover:text-white transition-colors">
                                    <Trophy size={24} />
                                </div>
                                <h3 className="text-xl font-bold uppercase mb-2">Ranking</h3>
                                <p className="text-gray-500 text-sm">Compite con otros usuarios.</p>
                            </div>

                            {/* Events Card */}
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

                            {/* Settings Card */}
                            <div
                                onClick={() => setActiveModal('settings')}
                                className="bg-white p-6 shadow-sm border border-gray-100 group hover:border-brand-orange transition-colors cursor-pointer"
                            >
                                <div className="bg-gray-50 w-12 h-12 flex items-center justify-center mb-4 group-hover:bg-brand-orange group-hover:text-white transition-colors">
                                    <Settings size={24} />
                                </div>
                                <h3 className="text-xl font-bold uppercase mb-2">Configuración</h3>
                                <p className="text-gray-500 text-sm">Visibilidad, contraseña y preferencias.</p>
                            </div>
                        </div>

                        {/* Upcoming Events */}
                        <div>
                            <h3 className="text-xl font-black uppercase mb-6">Próximos Eventos</h3>
                            {upcomingEvents.length > 0 ? (
                                <div className="grid gap-4">
                                    {upcomingEvents.map((reg) => (
                                        <div key={reg.id} className="bg-white border border-gray-100 p-6 flex justify-between items-center shadow-sm">
                                            <div>
                                                <h4 className="font-bold uppercase text-lg">{reg.events.title}</h4>
                                                <p className="text-sm text-gray-500">
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
                    </>
                );
        }
    };

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
                        <button
                            onClick={() => setActiveTab('overview')}
                            className={`hidden md:flex items-center text-sm font-bold uppercase transition-colors ${activeTab === 'overview' ? 'text-brand-orange' : 'text-gray-500 hover:text-brand-black'}`}
                        >
                            <LayoutDashboard size={18} className="mr-2" />
                            Resumen
                        </button>
                        <button
                            onClick={() => setActiveTab('friends')}
                            className={`hidden md:flex items-center text-sm font-bold uppercase transition-colors ${activeTab === 'friends' ? 'text-brand-orange' : 'text-gray-500 hover:text-brand-black'}`}
                        >
                            <Users size={18} className="mr-2" />
                            Amigos
                        </button>
                        <button
                            onClick={() => setActiveTab('badges')}
                            className={`hidden md:flex items-center text-sm font-bold uppercase transition-colors ${activeTab === 'badges' ? 'text-brand-orange' : 'text-gray-500 hover:text-brand-black'}`}
                        >
                            <Award size={18} className="mr-2" />
                            Logros
                        </button>
                        <button
                            onClick={() => setActiveTab('leaderboard')}
                            className={`hidden md:flex items-center text-sm font-bold uppercase transition-colors ${activeTab === 'leaderboard' ? 'text-brand-orange' : 'text-gray-500 hover:text-brand-black'}`}
                        >
                            <Trophy size={18} className="mr-2" />
                            Ranking
                        </button>
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
                {activeTab === 'overview' && (
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
                )}

                {/* Dynamic Content */}
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    {renderContent()}
                </motion.div>
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

                        {activeModal === 'search_friends' ? (
                            <FriendSearchModal onClose={closeModal} currentUserId={user.id} />
                        ) : (
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                className="bg-white p-8 max-w-md w-full relative z-10 shadow-2xl max-h-[90vh] overflow-y-auto"
                            >
                                <button
                                    onClick={closeModal}
                                    className="absolute top-4 right-4 text-gray-400 hover:text-brand-black"
                                >
                                    <X size={24} />
                                </button>

                                {activeModal === 'events' && (
                                    <div>
                                        <h3 className="text-2xl font-black uppercase mb-4">Historial de Eventos</h3>
                                        <div className="space-y-4 max-h-96 overflow-y-auto">
                                            {myEvents.map((reg) => (
                                                <div key={reg.id} className="border-b border-gray-100 pb-4 last:border-0">
                                                    <h4 className="font-bold">{reg.events.title}</h4>
                                                    <p className="text-sm text-gray-500">{new Date(reg.events.date).toLocaleDateString()}</p>
                                                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${reg.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                                        }`}>
                                                        {reg.status === 'confirmed' ? 'Confirmado' : reg.status}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {activeModal === 'subscription' && (
                                    <div>
                                        <h3 className="text-2xl font-black uppercase mb-4">Tu Suscripción</h3>
                                        <div className="bg-gray-50 p-4 mb-4 border-l-4 border-brand-orange">
                                            <p className="font-bold text-lg mb-1">Plan Premium (Promoción Lanzamiento)</p>
                                            <p className="text-sm text-gray-500 mb-2">
                                                ¡Estás de suerte! Durante la fase beta, todas las cuentas disfrutan de los beneficios Premium totalmente <strong>GRATIS</strong>.
                                            </p>
                                            <ul className="text-sm text-gray-500 space-y-1 list-disc list-inside">
                                                <li>Acceso prioritario a eventos</li>
                                                <li>Sin comisiones de gestión</li>
                                                <li>Badges exclusivos</li>
                                            </ul>
                                        </div>
                                        <button disabled className="w-full bg-gray-200 text-gray-500 py-3 font-bold uppercase cursor-not-allowed">
                                            Disfruta tu plan gratuito
                                        </button>
                                    </div>
                                )}

                                {activeModal === 'settings' && (
                                    <div>
                                        <h3 className="text-2xl font-black uppercase mb-6">Configuración</h3>

                                        {/* Visibility Settings */}
                                        <div className="mb-8">
                                            <VisibilitySettings
                                                visibility={userProfile?.visibility || 'members_only'}
                                                onChange={handleVisibilityChange}
                                                theme="light"
                                            />
                                        </div>

                                        <div className="border-t border-gray-100 pt-6">
                                            <h4 className="font-bold uppercase text-gray-500 mb-4 text-sm">Cuenta</h4>
                                            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                                                <div>
                                                    <label className="block text-sm font-bold text-gray-500 mb-1">Email</label>
                                                    <input type="email" value={user.email} disabled className="w-full bg-gray-100 border border-gray-200 p-2 text-gray-500" />
                                                </div>
                                                <button className="w-full border-2 border-brand-black text-brand-black py-3 font-bold uppercase hover:bg-brand-black hover:text-white transition-colors">
                                                    Cambiar Contraseña
                                                </button>
                                            </form>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        )}
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
