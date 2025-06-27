
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const TermsConditions = () => {
  return (
    <div className="min-h-screen dark-tech-bg px-4 py-20">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <Link to="/" className="inline-block mb-8">
            <Button variant="outline" className="text-white border-white/40 hover:bg-white/10">
              ← Back to Home
            </Button>
          </Link>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">Terms & Conditions</h1>
          <p className="text-xl text-white/70">Our terms of service and user agreement</p>
        </div>
        
        <div className="glass-card p-8 space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Acceptance of Terms</h2>
            <p className="text-white/80">
              By accessing and using TRADEMIND, you accept and agree to be bound by the terms 
              and provision of this agreement.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Use License</h2>
            <p className="text-white/80 mb-4">
              Permission is granted to temporarily download one copy of TRADEMIND per device for 
              personal, non-commercial transitory viewing only.
            </p>
            <ul className="text-white/70 space-y-2">
              <li>• This license shall automatically terminate if you violate any restrictions</li>
              <li>• You may not modify or copy the materials</li>
              <li>• You may not use the materials for commercial purposes</li>
              <li>• You may not reverse engineer any software contained on our platform</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">User Accounts</h2>
            <p className="text-white/80">
              You are responsible for maintaining the confidentiality of your account and password 
              and for restricting access to your computer. You agree to accept responsibility for 
              all activities that occur under your account.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Disclaimer</h2>
            <p className="text-white/80">
              TRADEMIND is a trading journal and analysis tool. It does not provide financial advice. 
              All trading involves risk, and past performance does not guarantee future results.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Contact Information</h2>
            <p className="text-white/80">
              If you have any questions about these Terms and Conditions, please contact us at{' '}
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

export default TermsConditions;
