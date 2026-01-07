
import React from 'react';

const ClaimsPage: React.FC = () => {
  const steps = [
    {
      number: 1,
      title: "Tell us what happened",
      desc: "Complete our simple online form, providing as much detail about your pet's condition or the accident as possible.",
      icon: "📋"
    },
    {
      number: 2,
      title: "Upload Vet Invoices",
      desc: "Simply take a photo or upload clear, legible digital invoices from your veterinarian.",
      icon: "📸"
    },
    {
      number: 3,
      title: "Confirmation",
      desc: "Check your email inbox for a confirmation from us. We'll let you know your claim is safe in our hands.",
      icon: "📧"
    },
    {
      number: 4,
      title: "Review & Verify",
      desc: "Our friendly consultants will review the details and may call you to verify specifics for a faster payout.",
      icon: "📞"
    },
    {
      number: 5,
      title: "Boom! Paid.",
      desc: "Once approved, your claim is typically paid directly into your account within 5 working days.",
      icon: "💰"
    }
  ];

  return (
    <div className="animate-fade-in pb-20">
      {/* Hero */}
      <section className="bg-primary/5 pt-20 pb-24 text-center">
        <div className="max-w-7xl mx-auto px-4">
          <span className="text-primary font-bold tracking-[0.2em] text-xs uppercase mb-4 block">Hassle-Free Process</span>
          <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-6">How to Claim</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Our claim process is designed to be as easy as possible so you can focus on what matters most: your pet's recovery.
          </p>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-24 max-w-5xl mx-auto px-4">
        <div className="grid gap-8 relative">
          {/* Vertical line connector for desktop */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gray-100 -translate-x-1/2 -z-10"></div>
          
          {steps.map((step, i) => (
            <div 
              key={step.number} 
              className={`flex flex-col md:flex-row items-center gap-8 ${
                i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
              }`}
            >
              <div className="md:w-1/2 flex justify-center md:justify-end md:px-12 text-center md:text-right">
                {i % 2 === 0 ? (
                   <div className="space-y-2">
                    <h3 className="text-2xl font-bold text-gray-900">{step.title}</h3>
                    <p className="text-gray-500 leading-relaxed">{step.desc}</p>
                   </div>
                ) : (
                  <div className="text-6xl bg-white w-24 h-24 rounded-[32px] shadow-xl border-2 border-primary/10 flex items-center justify-center transform hover:scale-110 transition-transform">
                    {step.icon}
                  </div>
                )}
              </div>

              <div className="relative flex-shrink-0 z-20">
                <div className="w-12 h-12 rounded-full bg-primary text-white font-black flex items-center justify-center shadow-lg shadow-primary/30 ring-8 ring-white">
                  {step.number}
                </div>
              </div>

              <div className="md:w-1/2 flex justify-center md:justify-start md:px-12 text-center md:text-left">
                {i % 2 !== 0 ? (
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold text-gray-900">{step.title}</h3>
                    <p className="text-gray-500 leading-relaxed">{step.desc}</p>
                  </div>
                ) : (
                  <div className="text-6xl bg-white w-24 h-24 rounded-[32px] shadow-xl border-2 border-primary/10 flex items-center justify-center transform hover:scale-110 transition-transform">
                    {step.icon}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Link Section */}
      <section className="max-w-4xl mx-auto px-4 mt-12">
        <div className="bg-white border-2 border-dashed border-gray-200 rounded-[40px] p-12 text-center">
          <h2 className="text-2xl font-bold mb-4">Have more questions?</h2>
          <p className="text-gray-500 mb-8 leading-relaxed">
            If you need help with a specific claim or want to track an existing one, 
            our team is standing by to help.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
             <a href="mailto:hello@petcovered.co.za" className="bg-gray-100 text-gray-700 px-8 py-3 rounded-2xl font-bold hover:bg-gray-200 transition-colors">
                Email Support
             </a>
             <a href="tel:0101094015" className="bg-primary text-white px-8 py-3 rounded-2xl font-bold hover:opacity-90 transition-opacity">
                Call 087 655 0525
             </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ClaimsPage;
