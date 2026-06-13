import React from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import HeroSection from '../components/landing/HeroSection';
import ImpactStats from '../components/landing/ImpactStats';
import HowItWorks from '../components/landing/HowItWorks';
import Personas from '../components/landing/Personas';

export default function Landing() {
  return (
    <div className="min-h-screen bg-surface-container-lowest font-body-md text-on-surface">
      <Header />
      <main>
        <HeroSection />
        <ImpactStats />
        <HowItWorks />
        <Personas />
      </main>
      <Footer />
    </div>
  );
}
