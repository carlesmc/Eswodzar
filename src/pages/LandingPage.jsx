import React from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import Mission from '../components/Mission';
import Events from '../components/Events';
import Gallery from '../components/Gallery';
import Community from '../components/Community';
import FAQ from '../components/FAQ';
import Footer from '../components/Footer';

const LandingPage = () => {
    return (
        <>
            <Header />
            <main>
                <Hero />
                <Mission />
                <Events />
                <Gallery />
                <Community />
                <FAQ />
            </main>
            <Footer />
        </>
    );
};

export default LandingPage;
