
import React from 'react';

const AboutPage: React.FC = () => {
  const milestones = [
    { date: 'March 29, 2019', title: 'Company Founded', desc: 'Conceived the vision for fair pet insurance and aligned with registered FSPs for regulatory compliance.' },
    { date: '2019', title: 'Strategic Partnerships', desc: 'Signed critical agreements with providers and insurers to build a robust medical network.' },
    { date: '2020', title: 'Innovation & UX', desc: 'Developed our proprietary platform and digital tools tailored specifically for South African pet owners.' },
    { date: 'August 31, 2020', title: 'Pioneer Launch', desc: 'Entered the market with two innovative health policies, securing our first contract on day one.' },
    { date: 'December 07, 2021', title: 'Go Live', desc: 'Launched our high-performance Premium Economy tariff, redefining affordability in pet care.' }
  ];

  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="bg-gray-50 pt-20 pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-8 max-w-4xl mx-auto leading-tight">
            We created the pet insurance <span className="text-primary underline decoration-primary/30 decoration-8 underline-offset-8">owners were looking for</span>.
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed mb-12">
            Through listening to thousands of cat and dog owners, we've helped thousands find cover and created innovative tools for a better customer experience.
          </p>
          <div className="inline-flex items-center gap-2 bg-white px-6 py-3 rounded-full shadow-sm border text-sm font-bold text-gray-700">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            Fintech Innovation at Heart
          </div>
        </div>
      </section>

      {/* Founder Section */}
      <section className="py-24 bg-white -mt-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&q=80&w=1000" 
                alt="Vet Care" 
                className="rounded-[60px] shadow-2xl relative z-10"
              />
              <div className="absolute -bottom-10 -right-10 bg-primary text-white p-10 rounded-[40px] shadow-2xl z-20 hidden md:block max-w-xs">
                <p className="text-lg font-bold mb-2 italic">"We fix the things people hate about traditional policies."</p>
                <span className="text-sm opacity-80">— Akhona Ngwane, CEO</span>
              </div>
            </div>
            
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold mb-6">Our Philosophy</h2>
                <p className="text-gray-600 leading-relaxed text-lg">
                  We launched our pet insurance cover after listening to thousands of pet owners. As a result, our insurance has features that are new to the market and address the gaps in traditional coverage.
                </p>
              </div>
              <div className="space-y-4">
                <p className="text-gray-600 leading-relaxed">
                  Our rapid growth has seen co-founder <span className="font-bold text-gray-900 underline decoration-primary/20 decoration-4">Akhona Ngwane (CEO)</span> build a team spanning three offices, acquiring leading providers to ensure Petcovered® remains the gold standard.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  Petcovered® is proudly underwritten by <span className="font-bold">Genric Insurance</span>, ensuring financial stability and peace of mind for every claim.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="py-24 bg-primary/5">
        <div className="max-w-7xl mx-auto px-4 text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Disruptive Technology</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Technology is at the heart of our offering. We are at the forefront of fintech innovation in South Africa.
          </p>
        </div>
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="bg-white p-8 rounded-[32px] shadow-sm border border-white hover:border-primary/20 transition-all">
              <h3 className="text-xl font-bold mb-3 flex items-center gap-3">
                <span className="text-2xl">⚡</span> Quick & Easy Systems
              </h3>
              <p className="text-gray-600">Our systems are built to make things quicker and easier for customers. From instant quotes to digital claim submissions.</p>
            </div>
            <div className="bg-white p-8 rounded-[32px] shadow-sm border border-white hover:border-primary/20 transition-all">
              <h3 className="text-xl font-bold mb-3 flex items-center gap-3">
                <span className="text-2xl">💎</span> Transparent Pricing
              </h3>
              <p className="text-gray-600">We are dedicated to improving prices and expanding what people can get cover for through data-driven insights.</p>
            </div>
          </div>
          <div className="relative">
             <img 
                src="https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80&w=1000" 
                alt="Technology" 
                className="rounded-[60px] shadow-xl grayscale hover:grayscale-0 transition-all duration-700"
              />
          </div>
        </div>
      </section>

      {/* Journey Timeline */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-20">
            <span className="text-primary font-bold tracking-widest text-xs uppercase">Building a Better World</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-4">Our Creative Journey</h2>
          </div>
          
          <div className="relative">
            {/* Horizontal Line (Desktop) */}
            <div className="hidden lg:block absolute top-1/2 left-0 w-full h-0.5 bg-gray-100 -translate-y-1/2"></div>
            
            <div className="grid lg:grid-cols-5 gap-8">
              {milestones.map((m, i) => (
                <div key={i} className="relative group text-center lg:text-left">
                  <div className="hidden lg:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-white border-4 border-primary rounded-full z-10 transition-transform group-hover:scale-150"></div>
                  <div className="bg-gray-50 rounded-3xl p-6 hover:bg-white hover:shadow-xl transition-all border border-transparent hover:border-gray-100 lg:h-full">
                    <span className="text-xs font-black text-primary mb-2 block">{m.date}</span>
                    <h4 className="font-bold text-gray-900 mb-3">{m.title}</h4>
                    <p className="text-xs text-gray-500 leading-relaxed">{m.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Reputation Section */}
      <section className="py-24 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
            {[
              { title: 'Massive Network', desc: 'Nationwide network of healthcare providers & access to any hospital.', icon: '🌍' },
              { title: 'Affordable', desc: 'Plans created to suit your family and budget without compromising quality.', icon: '💰' },
              { title: 'Flexible', desc: 'Benefits and cover that suit your unique lifestyle. Choose what you need.', icon: '🛠️' },
              { title: 'Reputable', desc: 'Trusted by thousands. Managed and underwritten by FSP experts.', icon: '🛡️' }
            ].map((v, i) => (
              <div key={i} className="space-y-4 text-center md:text-left">
                <span className="text-4xl">{v.icon}</span>
                <h3 className="text-xl font-bold">{v.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
