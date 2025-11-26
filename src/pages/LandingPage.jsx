import React from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import Header from '../components/Header';
import Hero from '../components/Hero';
import Mission from '../components/Mission';
import Events from '../components/Events';
import Gallery from '../components/Gallery';
import Community from '../components/Community';
import FAQ from '../components/FAQ';
import Footer from '../components/Footer';
import CommunityInvite from '../components/CommunityInvite';

const LandingPage = () => {
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    return (
        <>
            <motion.div
                className="fixed top-0 left-0 right-0 h-1.5 bg-brand-orange origin-left z-[100]"
                style={{ scaleX }}
            />
            <Header />
            <main>
                <Hero />
                <Mission />
                <Events />
                <Gallery />
                <Community />
                <CommunityInvite />
                <FAQ />
            </main>
            <Footer />
        </>
    );
};

export default LandingPage;
