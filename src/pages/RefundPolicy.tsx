
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const RefundPolicy = () => {
  return (
    <div className="min-h-screen dark-tech-bg px-4 py-20">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <Link to="/" className="inline-block mb-8">
            <Button variant="outline" className="text-white border-white/40 hover:bg-white/10">
              ← Back to Home
            </Button>
          </Link>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">Refund Policy</h1>
          <p className="text-xl text-white/70">Cancellation and refund information</p>
        </div>
        
        <div className="glass-card p-8 space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Subscription Cancellation</h2>
            <p className="text-white/80 mb-4">
              You can cancel your subscription at any time through your account settings. 
              Your subscription will remain active until the end of your current billing period.
            </p>
            <ul className="text-white/70 space-y-2">
              <li>• No charges will occur after cancellation</li>
              <li>• You retain access to premium features until period end</li>
              <li>• Your data will be preserved for 30 days after cancellation</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Refund Eligibility</h2>
            <p className="text-white/80 mb-4">
              We offer refunds under the following conditions:
            </p>
            <ul className="text-white/70 space-y-2">
              <li>• Technical issues preventing platform use for more than 72 hours</li>
              <li>• Billing errors or duplicate charges</li>
              <li>• Refund requests within 2 days of initial subscription</li>
              <li>• Unauthorized charges (with proper documentation)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Refund Process</h2>
            <p className="text-white/80 mb-4">
              To request a refund:
            </p>
            <ol className="text-white/70 space-y-2 list-decimal list-inside">
              <li>Contact our support team with your refund request</li>
              <li>Provide your account email and reason for refund</li>
              <li>Allow 3-5 business days for review</li>
              <li>Approved refunds will be processed within 7-10 business days</li>
            </ol>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Non-Refundable Items</h2>
            <ul className="text-white/70 space-y-2">
              <li>• Subscriptions used for more than 30 days</li>
              <li>• Data export or backup services</li>
              <li>• Violations of terms of service</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Contact for Refunds</h2>
            <p className="text-white/80">
              For refund requests, please contact us at{' '}
              <a href="mailto:Thehouseoftraders69@gmail.com" className="text-purple-400 hover:text-purple-300">
                Thehouseoftraders69@gmail.com
              </a>{' '}
              with "REFUND REQUEST" in the subject line.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default RefundPolicy;
