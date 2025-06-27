
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const ContactUs = () => {
  return (
    <div className="min-h-screen dark-tech-bg px-4 py-20">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <Link to="/" className="inline-block mb-8">
            <Button variant="outline" className="text-white border-white/40 hover:bg-white/10">
              ← Back to Home
            </Button>
          </Link>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">Contact Us</h1>
          <p className="text-xl text-white/70">Get in touch with our team</p>
        </div>
        
        <div className="glass-card p-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">Get Support</h2>
              <p className="text-white/80 mb-6">
                Have questions about TRADEMIND? Need help with your account? We're here to help!
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">📧</span>
                  <div>
                    <p className="text-white font-semibold">Email Support</p>
                    <a 
                      href="mailto:Thehouseoftraders69@gmail.com" 
                      className="text-purple-400 hover:text-purple-300 transition-colors"
                    >
                      Thehouseoftraders69@gmail.com
                    </a>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <span className="text-2xl">💬</span>
                  <div>
                    <p className="text-white font-semibold">Discord Community</p>
                    <p className="text-white/60">Coming soon</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">Response Time</h2>
              <p className="text-white/80 mb-4">
                We typically respond to all inquiries within 24-48 hours during business days.
              </p>
              
              <h3 className="text-lg font-semibold text-white mb-2">What to include in your message:</h3>
              <ul className="text-white/70 space-y-1">
                <li>• Your account email (if applicable)</li>
                <li>• Detailed description of your issue</li>
                <li>• Screenshots (if relevant)</li>
                <li>• Your subscription plan</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
