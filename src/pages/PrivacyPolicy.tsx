
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen dark-tech-bg px-4 py-20">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <Link to="/" className="inline-block mb-8">
            <Button variant="outline" className="text-white border-white/40 hover:bg-white/10">
              ← Back to Home
            </Button>
          </Link>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">Privacy Policy</h1>
          <p className="text-xl text-white/70">How we protect and handle your data</p>
        </div>
        
        <div className="glass-card p-8 space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Information We Collect</h2>
            <p className="text-white/80 mb-4">
              We collect information you provide directly to us, such as when you create an account, 
              use our services, or contact us for support.
            </p>
            <ul className="text-white/70 space-y-2">
              <li>• Account information (email, username)</li>
              <li>• Trading data and journal entries</li>
              <li>• Usage analytics and performance metrics</li>
              <li>• Communication preferences</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">How We Use Your Information</h2>
            <p className="text-white/80 mb-4">
              We use the information we collect to provide, maintain, and improve our services:
            </p>
            <ul className="text-white/70 space-y-2">
              <li>• To provide and operate TRADEMIND services</li>
              <li>• To analyze your trading performance and provide insights</li>
              <li>• To communicate with you about updates and support</li>
              <li>• To improve our platform and develop new features</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Data Security</h2>
            <p className="text-white/80">
              We implement appropriate technical and organizational measures to protect your personal 
              information against unauthorized access, alteration, disclosure, or destruction. All data 
              is encrypted both in transit and at rest.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Contact Us</h2>
            <p className="text-white/80">
              If you have any questions about this Privacy Policy, please contact us at{' '}
              <a href="mailto:Thehouseoftraders69@gmail.com" className="text-purple-400 hover:text-purple-300">
                Thehouseoftraders69@gmail.com
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
