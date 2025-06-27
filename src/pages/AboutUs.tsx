
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const AboutUs = () => {
  return (
    <div className="min-h-screen dark-tech-bg px-4 py-20">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <Link to="/" className="inline-block mb-8">
            <Button variant="outline" className="text-white border-white/40 hover:bg-white/10">
              ← Back to Home
            </Button>
          </Link>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">About Us</h1>
          <p className="text-xl text-white/70">Learn more about The House Of Traders</p>
        </div>
        
        <div className="glass-card p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Our Mission</h2>
          <p className="text-white/80 mb-6 leading-relaxed">
            At The House Of Traders, we believe that every trader deserves access to powerful tools that can help them 
            analyze their performance, understand their psychology, and improve their trading results. TRADEMIND is our 
            solution to bridge the gap between trading and self-improvement.
          </p>
          
          <h2 className="text-2xl font-bold text-white mb-4">What We Do</h2>
          <p className="text-white/80 mb-6 leading-relaxed">
            We develop cutting-edge trading journal software that goes beyond basic trade tracking. Our platform 
            combines advanced analytics, psychological insights, and AI-powered feedback to help traders master 
            both their strategies and their minds.
          </p>
          
          <h2 className="text-2xl font-bold text-white mb-4">Our Vision</h2>
          <p className="text-white/80 leading-relaxed">
            To become the most trusted platform for traders who are serious about improving their performance 
            and achieving consistent profitability through disciplined trading and continuous self-reflection.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
