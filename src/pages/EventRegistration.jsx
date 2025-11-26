import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, MapPin, Clock, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.png';
import { supabase } from '../lib/supabase';
import EventAttendeesList from '../components/EventAttendeesList';

const EventRegistration = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [submitted, setSubmitted] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        lunch: false
    });

    const [eventDetails, setEventDetails] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const { data, error } = await supabase
                    .from('events')
                    .select('*')
                    .eq('id', id)
                    .single();

                if (error) throw error;
                setEventDetails(data);
            } catch (error) {
                console.error('Error fetching event:', error);
                navigate('/');
            } finally {
                setLoading(false);
            }
        };
        fetchEvent();
    }, [id, navigate]);

    // Auto-fill if user is logged in
    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                name: user.name || '',
                email: user.email || ''
            }));
        }
    }, [user]);

    if (loading) return <div className="min-h-screen flex items-center justify-center">Cargando...</div>;
    if (!eventDetails) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!user) {
            alert('Debes iniciar sesión para apuntarte a un evento.');
            navigate('/login');
            return;
        }

        try {
            const { error } = await supabase
                .from('registrations')
                .insert([
                    {
                        user_id: user.id,
                        event_id: eventDetails.id,
                        lunch_option: formData.lunch,
                        status: 'confirmed'
                    }
                ]);

            if (error) {
                if (error.code === '23505') { // Unique violation
                    alert('¡Ya estás apuntado a este evento!');
                } else {
                    throw error;
                }
            } else {
                setSubmitted(true);
            }
        } catch (error) {
            console.error('Error registering:', error);
            alert('Hubo un error al realizar la inscripción.');
        }
    };

    const handleChange = (e) => {
        const { id, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [id === 'lunch' ? 'lunch' : id]: type === 'checkbox' ? checked : value
        }));
    };

    if (submitted) {
        return (
            <div className="min-h-screen bg-brand-black text-white flex flex-col items-center justify-center p-4">
                <CheckCircle className="text-brand-orange w-20 h-20 mb-6" />
                <h1 className="text-4xl font-black uppercase mb-4 text-center">¡Estás dentro!</h1>
                <p className="text-gray-400 text-center max-w-md mb-8">
                    Te hemos apuntado a la lista. Prepárate para sudar y almorzar como es debido.
                </p>
                <Link
                    to="/"
                    className="bg-white text-brand-black px-8 py-3 font-bold uppercase hover:bg-brand-orange hover:text-white transition-colors"
                >
                    Volver al Inicio
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Simple Header */}
            <header className="bg-brand-black py-4 px-6 flex justify-between items-center">
                <Link to="/" className="text-white hover:text-brand-orange transition-colors">
                    <ArrowLeft size={24} />
                </Link>
                <img src={logo} alt="ESWODZAR" className="h-8 invert" />
                <div className="w-6"></div> {/* Spacer for centering */}
            </header>

            <div className="flex-grow flex flex-col md:flex-row max-w-6xl mx-auto w-full p-4 md:p-8 gap-8">
                {/* Cover Image */}
                {eventDetails.cover_image && (
                    <div className="w-full mb-8 h-64 md:h-96 relative overflow-hidden shadow-sm">
                        <img
                            src={eventDetails.cover_image}
                            alt={eventDetails.title}
                            className="w-full h-full object-cover"
                        />
                    </div>
                )}

                <div className="flex flex-col md:flex-row gap-8">
                    {/* Event Info */}
                    <div className="md:w-1/3 bg-white p-8 shadow-sm h-fit sticky top-8">
                        <h2 className="text-brand-orange font-bold tracking-widest uppercase text-sm mb-2">Estás apuntándote a</h2>
                        <h1 className="text-3xl font-black uppercase mb-6 leading-none">{eventDetails.title}</h1>

                        <div className="space-y-4 text-gray-600">
                            <div className="flex items-center">
                                <Calendar className="w-5 h-5 mr-3 text-brand-black" />
                                <span>{new Date(eventDetails.date).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
                            </div>
                            <div className="flex items-center">
                                <Clock className="w-5 h-5 mr-3 text-brand-black" />
                                <span>{eventDetails.time.slice(0, 5)}</span>
                            </div>
                            <div className="flex items-center">
                                <MapPin className="w-5 h-5 mr-3 text-brand-black" />
                                <span>{eventDetails.location}</span>
                            </div>
                        </div>

                        <div className="mt-8 pt-8 border-t border-gray-100">
                            <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Precio</p>
                            <p className="text-2xl font-bold">{eventDetails.price}</p>
                        </div>

                        <div className="mt-8 pt-8 border-t border-gray-100">
                            <EventAttendeesList eventId={eventDetails.id} currentUserId={user?.id} />
                        </div>
                    </div>

                    {/* Registration Form */}
                    <div className="md:w-2/3 bg-white p-8 shadow-sm">
                        <h2 className="text-2xl font-bold uppercase mb-6">Tus Datos</h2>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="name" className="block text-sm font-bold text-gray-700 uppercase mb-2">Nombre Completo</label>
                                <input
                                    type="text"
                                    id="name"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full bg-gray-50 border-b-2 border-gray-200 p-3 focus:outline-none focus:border-brand-orange transition-colors"
                                    placeholder="Ej. Vicentín Van Gogh"
                                />
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-bold text-gray-700 uppercase mb-2">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full bg-gray-50 border-b-2 border-gray-200 p-3 focus:outline-none focus:border-brand-orange transition-colors"
                                    placeholder="tu@email.com"
                                />
                            </div>

                            <div>
                                <label htmlFor="phone" className="block text-sm font-bold text-gray-700 uppercase mb-2">Teléfono (WhatsApp)</label>
                                <input
                                    type="tel"
                                    id="phone"
                                    required
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="w-full bg-gray-50 border-b-2 border-gray-200 p-3 focus:outline-none focus:border-brand-orange transition-colors"
                                    placeholder="+34 600 000 000"
                                />
                            </div>

                            <div className="pt-4">
                                <label className="flex items-center space-x-3 cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        id="lunch"
                                        checked={formData.lunch}
                                        onChange={handleChange}
                                        className="w-5 h-5 text-brand-orange border-gray-300 rounded focus:ring-brand-orange"
                                    />
                                    <span className="text-gray-700 group-hover:text-brand-black transition-colors">
                                        Me quedo al <strong>Almuerzo</strong> (Importante para reservar mesa)
                                    </span>
                                </label>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-brand-black text-white py-4 font-black uppercase tracking-wider hover:bg-brand-orange transition-colors mt-8"
                            >
                                Confirmar Asistencia
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventRegistration;
