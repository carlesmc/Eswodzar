import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.png';

const Header = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const { user } = useAuth();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Concepto', href: '/#mission' },
        { name: 'Eventos', href: '/#events' },
        { name: 'Galería', href: '/#gallery' },
        { name: 'Comunidad', href: '/#community' },
        { name: 'FAQ', href: '/#faq' },
    ];

    return (
        <header
            className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-brand-black py-4 shadow-lg' : 'bg-brand-black py-6'
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center">
                    {/* Logo */}
                    <div className="flex-shrink-0 flex items-center">
                        <Link to="/" onClick={() => window.scrollTo(0, 0)}>
                            <img
                                src={logo}
                                alt="ESWODZAR"
                                className="h-8 md:h-10 w-auto invert transition-all duration-300"
                            />
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <nav className="hidden md:flex space-x-8 items-center">
                        {navLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.href}
                                className="text-sm font-bold uppercase tracking-wider text-white hover:text-brand-orange transition-colors"
                            >
                                {link.name}
                            </a>
                        ))}

                        {user ? (
                            <Link
                                to="/dashboard"
                                className="flex items-center text-white hover:text-brand-orange transition-colors"
                            >
                                <div className="w-8 h-8 bg-brand-orange rounded-full flex items-center justify-center text-white font-bold mr-2">
                                    {user.name.charAt(0)}
                                </div>
                                <span className="text-sm font-bold uppercase hidden lg:inline">{user.name.split(' ')[0]}</span>
                            </Link>
                        ) : (
                            <Link
                                to="/login"
                                className="px-6 py-2 border-2 border-white text-white text-sm font-bold uppercase tracking-wider hover:bg-white hover:text-brand-black transition-all duration-300"
                            >
                                Iniciar Sesión
                            </Link>
                        )}
                    </nav>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="text-white hover:text-brand-orange transition-colors p-2"
                        >
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden absolute top-full left-0 w-full bg-brand-black border-t border-gray-800 shadow-xl">
                    <div className="px-4 pt-2 pb-8 space-y-2">
                        {navLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.href}
                                onClick={() => setIsOpen(false)}
                                className="block px-3 py-4 text-base font-bold uppercase text-white hover:text-brand-orange border-b border-gray-800"
                            >
                                {link.name}
                            </a>
                        ))}
                        <div className="pt-4">
                            {user ? (
                                <Link
                                    to="/dashboard"
                                    onClick={() => setIsOpen(false)}
                                    className="block w-full text-center px-6 py-3 bg-brand-orange text-white font-bold uppercase tracking-wider"
                                >
                                    Mi Cuenta
                                </Link>
                            ) : (
                                <Link
                                    to="/login"
                                    onClick={() => setIsOpen(false)}
                                    className="block w-full text-center px-6 py-3 border-2 border-white text-white font-bold uppercase tracking-wider hover:bg-white hover:text-brand-black"
                                >
                                    Iniciar Sesión
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Header;
