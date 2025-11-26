import React from 'react';
import { Globe, Users, Lock } from 'lucide-react';

const VisibilitySettings = ({ visibility, onChange, theme = 'dark' }) => {
    const isLight = theme === 'light';

    const options = [
        {
            value: 'public',
            label: 'Público',
            description: 'Visible para todos',
            icon: Globe
        },
        {
            value: 'members_only',
            label: 'Solo Miembros',
            description: 'Visible solo para usuarios registrados',
            icon: Users
        },
        {
            value: 'private',
            label: 'Privado',
            description: 'Solo tú puedes ver tu perfil',
            icon: Lock
        }
    ];

    const titleClass = isLight ? "text-lg font-bold uppercase text-gray-500" : "text-lg font-medium text-white";

    return (
        <div className="space-y-4">
            <h3 className={titleClass}>Visibilidad del Perfil</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {options.map((option) => {
                    const Icon = option.icon;
                    const isSelected = visibility === option.value;

                    let buttonClass = "flex flex-col items-center p-4 rounded-xl border-2 transition-all ";

                    if (isLight) {
                        buttonClass += isSelected
                            ? 'border-brand-orange bg-brand-orange/10'
                            : 'border-gray-200 bg-gray-50 hover:border-gray-300';
                    } else {
                        buttonClass += isSelected
                            ? 'border-brand-orange bg-brand-orange/10'
                            : 'border-gray-700 bg-gray-800/50 hover:border-gray-600';
                    }

                    const textClass = isLight
                        ? (isSelected ? 'text-brand-black' : 'text-gray-500')
                        : (isSelected ? 'text-white' : 'text-gray-300');

                    return (
                        <button
                            key={option.value}
                            type="button"
                            onClick={() => onChange(option.value)}
                            className={buttonClass}
                        >
                            <Icon className={`w-6 h-6 mb-2 ${isSelected ? 'text-brand-orange' : 'text-gray-400'}`} />
                            <span className={`font-medium ${textClass}`}>
                                {option.label}
                            </span>
                            <span className="text-xs text-gray-500 mt-1 text-center">
                                {option.description}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default VisibilitySettings;
