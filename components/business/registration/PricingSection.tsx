'use client';
import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';

export function PricingSection() {
  const [isAnnual, setIsAnnual] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleProSubscription = async () => {
    setLoading(true);
    const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY as string);
    // Implement Stripe checkout
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-center items-center gap-4">
        <span className={!isAnnual ? 'font-bold' : ''}>Monthly</span>
        <button
          onClick={() => setIsAnnual(!isAnnual)}
          className="w-14 h-8 bg-gray-200 rounded-full p-1 duration-300 ease-in-out"
        >
          <div
            className={`w-6 h-6 bg-white rounded-full shadow-md transform duration-300 ${
              isAnnual ? 'translate-x-6' : ''
            }`}
          />
        </button>
        <span className={isAnnual ? 'font-bold' : ''}>
          Annual (37% off)
        </span>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Free Plan */}
        <div className="border rounded-lg p-6">
          <h3 className="text-xl font-bold">Free</h3>
          <p className="text-2xl font-bold mt-4">$0</p>
          <button className="btn btn-secondary w-full mt-6">
            Choose Free Plan
          </button>
        </div>

        {/* Pro Plan */}
        <div className="border rounded-lg p-6 bg-blue-50">
          <h3 className="text-xl font-bold">Pro</h3>
          <p className="text-2xl font-bold mt-4">
            ${isAnnual ? '29' : '47'}/mo
          </p>
          <button
            className="btn btn-primary w-full mt-6"
            onClick={handleProSubscription}
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Choose Pro Plan'}
          </button>
        </div>
      </div>
    </div>
  );
} 