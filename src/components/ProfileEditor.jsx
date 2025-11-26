import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Save, X } from 'lucide-react';
import ProfilePhotoUpload from './ProfilePhotoUpload';
import VisibilitySettings from './VisibilitySettings';

const ProfileEditor = ({ profile, onSave, onCancel }) => {
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        bio: '',
        fitness_level: 'beginner',
        visibility: 'members_only',
        profile_photo_url: ''
    });

    useEffect(() => {
        if (profile) {
            setFormData({
                first_name: profile.first_name || '',
                last_name: profile.last_name || '',
                bio: profile.bio || '',
                fitness_level: profile.fitness_level || 'beginner',
                visibility: profile.visibility || 'members_only',
                profile_photo_url: profile.profile_photo_url || ''
            });
        }
    }, [profile]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePhotoUpload = (url) => {
        setFormData(prev => ({ ...prev, profile_photo_url: url }));
    };

    const handleVisibilityChange = (value) => {
        setFormData(prev => ({ ...prev, visibility: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        try {
            const { error } = await supabase
                .from('user_profiles')
                .update({
                    first_name: formData.first_name,
                    last_name: formData.last_name,
                    bio: formData.bio,
                    fitness_level: formData.fitness_level,
                    visibility: formData.visibility,
                    profile_photo_url: formData.profile_photo_url,
                    updated_at: new Date()
                })
                .eq('id', profile.id);

            if (error) throw error;
            onSave();
        } catch (error) {
            alert('Error updating profile: ' + error.message);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="bg-white rounded-none shadow-sm border border-gray-100 p-8">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-black uppercase text-brand-black">Editar Perfil</h2>
                <button
                    onClick={onCancel}
                    className="text-gray-400 hover:text-brand-black"
                >
                    <X className="w-6 h-6" />
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Photo Upload */}
                <div className="text-center">
                    <ProfilePhotoUpload
                        url={formData.profile_photo_url}
                        onUpload={handlePhotoUpload}
                    />
                    <p className="text-sm text-gray-500 mt-2">
                        Click en la cámara para cambiar tu foto
                    </p>
                </div>

                {/* Basic Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-bold uppercase text-gray-500 mb-1">
                            Nombre
                        </label>
                        <input
                            type="text"
                            name="first_name"
                            value={formData.first_name}
                            onChange={handleChange}
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-brand-black focus:ring-2 focus:ring-brand-orange focus:border-transparent outline-none"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold uppercase text-gray-500 mb-1">
                            Apellido
                        </label>
                        <input
                            type="text"
                            name="last_name"
                            value={formData.last_name}
                            onChange={handleChange}
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-brand-black focus:ring-2 focus:ring-brand-orange focus:border-transparent outline-none"
                        />
                    </div>
                </div>

                {/* Bio */}
                <div>
                    <label className="block text-sm font-bold uppercase text-gray-500 mb-1">
                        Bio (max 200 caracteres)
                    </label>
                    <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        maxLength={200}
                        rows={3}
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-brand-black focus:ring-2 focus:ring-brand-orange focus:border-transparent outline-none"
                        placeholder="Cuéntanos un poco sobre ti..."
                    />
                    <div className="text-right text-xs text-gray-400 mt-1">
                        {formData.bio.length}/200
                    </div>
                </div>

                {/* Fitness Level */}
                <div>
                    <label className="block text-sm font-bold uppercase text-gray-500 mb-2">
                        Nivel de Fitness
                    </label>
                    <div className="grid grid-cols-3 gap-4">
                        {['beginner', 'intermediate', 'advanced'].map((level) => (
                            <button
                                key={level}
                                type="button"
                                onClick={() => handleChange({ target: { name: 'fitness_level', value: level } })}
                                className={`p-3 rounded-lg border text-sm font-bold uppercase transition-colors ${formData.fitness_level === level
                                        ? 'bg-brand-orange text-white border-brand-orange'
                                        : 'bg-gray-50 text-gray-500 border-gray-200 hover:border-gray-300'
                                    }`}
                            >
                                {level === 'beginner' && 'Principiante'}
                                {level === 'intermediate' && 'Intermedio'}
                                {level === 'advanced' && 'Avanzado'}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Visibility */}
                <VisibilitySettings
                    visibility={formData.visibility}
                    onChange={handleVisibilityChange}
                    theme="light"
                />

                {/* Submit Buttons */}
                <div className="flex justify-end gap-4 pt-4 border-t border-gray-100">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-6 py-2 rounded-lg text-gray-500 hover:text-brand-black font-bold uppercase transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={saving}
                        className="bg-brand-orange hover:bg-orange-600 text-white px-8 py-2 rounded-lg font-bold uppercase transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {saving ? (
                            <>Guardando...</>
                        ) : (
                            <>
                                <Save className="w-5 h-5" />
                                Guardar Cambios
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ProfileEditor;
