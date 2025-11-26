import React, { useState } from 'react';
import { Check, Shield, Briefcase, Zap, Building2, User } from 'lucide-react';

type PlanType = 'INDIVIDUAL' | 'CORPORATE';

interface PricingTier {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  recommended?: boolean;
  color: string;
  buttonText: string;
}

const INDIVIDUAL_PLANS: PricingTier[] = [
  {
    name: 'Starter',
    price: '$0',
    period: '/month',
    description: 'Essential compliance monitoring for freelancers.',
    features: [
      'Basic Regulatory Dashboard',
      'Global Heatmap (Read-only)',
      '1 Document Analysis / week',
      'Community Support'
    ],
    color: 'from-slate-500 to-slate-600',
    buttonText: 'Get Started'
  },
  {
    name: 'Professional',
    price: '$49',
    period: '/month',
    description: 'Advanced tools for consultants and professionals.',
    features: [
      'Unlimited Regulatory Scanning',
      'Policy Drafter (Gemini 3 Pro)',
      'AI Chatbot Access',
      'Document Analyzer (50/mo)',
      'Priority Email Support'
    ],
    recommended: true,
    color: 'from-blue-600 to-cyan-500',
    buttonText: 'Start Free Trial'
  },
  {
    name: 'Elite',
    price: '$99',
    period: '/month',
    description: 'Full AI suite power for heavy users.',
    features: [
      'All Professional Features',
      'Live Assistant (Real-time Audio)',
      'Media Studio (Image & Video)',
      'Advanced Risk Analysis',
      '24/7 Dedicated Support'
    ],
    color: 'from-purple-600 to-pink-500',
    buttonText: 'Upgrade to Elite'
  }
];

const CORPORATE_PLANS: PricingTier[] = [
  {
    name: 'Team',
    price: '$299',
    period: '/month',
    description: 'Compliance automation for small teams.',
    features: [
      '5 User Seats',
      'Centralized Compliance Dashboard',
      'Team Policy Collaboration',
      'API Access (Standard)',
      'Standard SLA'
    ],
    color: 'from-emerald-600 to-teal-500',
    buttonText: 'Try Team Plan'
  },
  {
    name: 'Business',
    price: '$899',
    period: '/month',
    description: 'Scalable solution for growing organizations.',
    features: [
      '20 User Seats',
      'Advanced Reporting & Analytics',
      'Custom Regulatory Feeds',
      'Live API Integration',
      'Dedicated Account Manager'
    ],
    recommended: true,
    color: 'from-amber-600 to-orange-500',
    buttonText: 'Contact Sales'
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    description: 'Tailored security and compliance for global firms.',
    features: [
      'Unlimited Seats',
      'On-Premise Deployment Option',
      'Custom AI Model Training',
      'Audit Logs & SSO',
      'White-glove Onboarding'
    ],
    color: 'from-indigo-600 to-violet-500',
    buttonText: 'Book Demo'
  }
];

export const Subscription: React.FC = () => {
  const [planType, setPlanType] = useState<PlanType>('INDIVIDUAL');
  const plans = planType === 'INDIVIDUAL' ? INDIVIDUAL_PLANS : CORPORATE_PLANS;

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-12">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-bold text-white">Choose Your Plan</h2>
        <p className="text-slate-400 max-w-2xl mx-auto text-lg">
          Whether you're a solo consultant or a global enterprise, ComplyFlow scales with your regulatory needs.
        </p>
        
        {/* Toggle */}
        <div className="flex justify-center mt-8">
          <div className="bg-slate-800/50 p-1 rounded-xl flex items-center border border-white/10 backdrop-blur-md">
            <button
              onClick={() => setPlanType('INDIVIDUAL')}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                planType === 'INDIVIDUAL' 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <User size={18} />
              Individual
            </button>
            <button
              onClick={() => setPlanType('CORPORATE')}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                planType === 'CORPORATE' 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Building2 size={18} />
              Corporate
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan, index) => (
          <div 
            key={index}
            className={`relative glass-panel rounded-2xl p-8 flex flex-col transition-all duration-300 hover:translate-y-[-8px] hover:shadow-2xl hover:shadow-blue-500/10 ${
              plan.recommended ? 'border-blue-500/50 ring-1 ring-blue-500/50' : ''
            }`}
          >
            {plan.recommended && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg shadow-blue-500/30">
                Most Popular
              </div>
            )}

            <div className="mb-8">
              <h3 className="text-xl font-semibold text-white mb-2">{plan.name}</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold text-white">{plan.price}</span>
                <span className="text-slate-400">{plan.period}</span>
              </div>
              <p className="text-slate-400 mt-4 text-sm leading-relaxed">
                {plan.description}
              </p>
            </div>

            <div className="flex-1 space-y-4 mb-8">
              {plan.features.map((feature, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="p-1 rounded-full bg-blue-500/20 text-blue-400 mt-0.5">
                    <Check size={12} strokeWidth={3} />
                  </div>
                  <span className="text-slate-300 text-sm">{feature}</span>
                </div>
              ))}
            </div>

            <button 
              className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all active:scale-95 bg-gradient-to-r ${plan.color} hover:opacity-90`}
            >
              {plan.buttonText}
            </button>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 pt-16 border-t border-white/10">
        <div className="flex items-start gap-4">
            <div className="p-3 bg-green-500/10 rounded-lg text-green-400">
                <Shield size={24} />
            </div>
            <div>
                <h4 className="font-bold text-white mb-1">Enterprise Security</h4>
                <p className="text-sm text-slate-400">SOC2 Type II certified with end-to-end encryption for all data.</p>
            </div>
        </div>
        <div className="flex items-start gap-4">
            <div className="p-3 bg-purple-500/10 rounded-lg text-purple-400">
                <Briefcase size={24} />
            </div>
            <div>
                <h4 className="font-bold text-white mb-1">Expert Consultation</h4>
                <p className="text-sm text-slate-400">Access to legal experts and compliance officers for validation.</p>
            </div>
        </div>
        <div className="flex items-start gap-4">
            <div className="p-3 bg-orange-500/10 rounded-lg text-orange-400">
                <Zap size={24} />
            </div>
            <div>
                <h4 className="font-bold text-white mb-1">Instant Setup</h4>
                <p className="text-sm text-slate-400">Get up and running in minutes with our automated onboarding.</p>
            </div>
        </div>
      </div>
    </div>
  );
};