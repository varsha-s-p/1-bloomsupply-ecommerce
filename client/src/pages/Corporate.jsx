import React from 'react';
import { 
  Building2, 
  PartyPopper, 
  Gift, 
  CalendarClock, 
  Truck, 
  UserCheck, 
  ArrowRight,
  ShieldCheck,
  Globe2,
  Phone
} from 'lucide-react';

const ServiceCard = ({ icon: Icon, title, description, features }) => (
  <div className="bg-white p-10 rounded-[48px] border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500 group relative overflow-hidden">
    <div className="w-16 h-16 rounded-2xl bg-bloom-green/5 flex items-center justify-center text-bloom-green mb-8 group-hover:bg-bloom-green group-hover:text-white transition-all">
      <Icon size={28} />
    </div>
    <h3 className="text-2xl font-serif font-bold text-bloom-green mb-4">{title}</h3>
    <p className="text-gray-400 text-sm leading-relaxed mb-8 opacity-80">{description}</p>
    <ul className="space-y-3">
      {features.map((f, i) => (
        <li key={i} className="flex items-center gap-2 text-[11px] font-bold text-bloom-green uppercase tracking-wider">
          <div className="w-1.5 h-1.5 rounded-full bg-bloom-orange"></div>
          {f}
        </li>
      ))}
    </ul>
    <div className="absolute top-0 right-0 w-32 h-32 bg-bloom-green/5 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-bloom-orange/10 transition-colors"></div>
  </div>
);

const Corporate = () => {
  return (
    <div className="bg-[#fbfcfa] min-h-screen selection:bg-bloom-orange selection:text-white">
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-bloom-green/5 text-bloom-green text-[10px] font-bold uppercase tracking-[.3em] mb-10 border border-bloom-green/10">
          <Building2 size={12} />
          BloomSupply for Business
        </div>
        <h1 className="text-6xl md:text-8xl font-serif font-bold text-bloom-green mb-8 tracking-tight leading-[0.9]">
          Elevate your <span className="italic text-bloom-orange">Business</span> atmosphere.
        </h1>
        <p className="max-w-2xl mx-auto text-lg text-gray-400 font-medium italic opacity-80 leading-relaxed mb-12">
          Architecture-led floral installations for luxury offices, showrooms, and events. Managed by account experts with centralized multi-site billing.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <button className="bg-bloom-green text-white px-12 py-5 rounded-2xl font-bold text-xs uppercase tracking-[.4em] hover:bg-black transition-all shadow-xl shadow-bloom-green/20">
            Request consultation
          </button>
          <button className="flex items-center gap-3 text-[10px] font-bold text-bloom-green uppercase tracking-widest hover:text-bloom-orange transition-colors">
            View Case Studies <ArrowRight size={16} />
          </button>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <ServiceCard 
            icon={CalendarClock}
            title="Weekly Office Rotation"
            description="Recurring high-impact arrangements tailored to your brand aesthetic. Zero-maintenance on-site management."
            features={['Bespoke Design', 'Weekly Refresh', 'Vase Management', 'Refrigerated Delivery']}
          />
          <ServiceCard 
            icon={PartyPopper}
            title="Event Installations"
            description="From product launches to board dinners, our team handles end-to-end floral architecture for your corporate events."
            features={['Creative Direction', 'On-site Styling', 'Scale Installations', 'Post-Event Cleanup']}
          />
          <ServiceCard 
            icon={Gift}
            title="Concierge Gifting"
            description="Automated gifting for clients and team milestones. Centralized portal for bulk ordering and scheduling."
            features={['Bulk Scheduling', 'Custom Notes', 'Portal Access', 'Tax-Efficient Billing']}
          />
        </div>
      </section>

      {/* Trust/Experience Section */}
      <section className="py-32 bg-bloom-green text-white overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div>
              <h2 className="text-5xl font-serif font-bold mb-10 tracking-tight leading-tight">
                Logistics designed for <span className="italic opacity-60">scale.</span>
              </h2>
              <div className="space-y-8">
                <div className="flex gap-6">
                  <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
                    <Truck size={20} />
                  </div>
                  <div>
                    <h4 className="text-lg font-serif font-bold mb-2">Internal Fleet</h4>
                    <p className="text-sm text-white/60 leading-relaxed font-medium">We don't use third-party couriers. Our internal logistics team ensures delicate architectural work arrives in perfect condition.</p>
                  </div>
                </div>
                <div className="flex gap-6">
                  <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
                    <UserCheck size={20} />
                  </div>
                  <div>
                    <h4 className="text-lg font-serif font-bold mb-2">Dedicated Account Managers</h4>
                    <p className="text-sm text-white/60 leading-relaxed font-medium">Single point of contact for all your sites. Personalized service that understands your brand guidelines.</p>
                  </div>
                </div>
                <div className="flex gap-6">
                  <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
                    <ShieldCheck size={20} />
                  </div>
                  <div>
                    <h4 className="text-lg font-serif font-bold mb-2">Centralized Billing</h4>
                    <p className="text-sm text-white/60 leading-relaxed font-medium">Itemized tax-efficient invoicing across multiple office locations. No more scattered expenses.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[4/5] rounded-[60px] overflow-hidden bg-white/5 border border-white/10 shadow-2xl relative group">
                <img src="https://images.unsplash.com/photo-1541746972996-4e0b0f43e02a?w=800&h=1000&fit=crop" className="w-full h-full object-cover group-hover:scale-110 transition-all duration-[5000ms] opacity-80" alt="Office Lobby" />
                <div className="absolute inset-0 bg-gradient-to-t from-bloom-green via-transparent to-transparent"></div>
                <div className="absolute bottom-10 left-10 right-10 p-8 bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10">
                   <div className="text-bloom-accent text-3xl font-serif mb-4 leading-none">“</div>
                   <p className="text-sm italic font-medium mb-6">"BloomSupply transformed our London HQ. The weekly rotation is now part of our team's fundamental culture."</p>
                   <div className="text-[10px] uppercase font-bold tracking-widest text-white/50">Director of Ops, FinCloud LTD</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-[40%] h-full bg-white/5 blur-[120px] rounded-full pointer-events-none"></div>
      </section>

      {/* Global Reach Section */}
      <section className="py-32 px-6 max-w-7xl mx-auto text-center">
        <h2 className="text-4xl font-serif font-bold text-bloom-green mb-6 tracking-tight">Global Support. Local Execution.</h2>
        <p className="max-w-xl mx-auto text-sm text-gray-400 font-medium italic mb-12">One contract for all your global offices. Consistent design quality from Tokyo to New York.</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20 opacity-40 grayscale flex items-center">
           <Globe2 className="mx-auto" size={40} />
           <Building2 className="mx-auto" size={40} />
           <Globe2 className="mx-auto" size={40} />
           <Building2 className="mx-auto" size={40} />
        </div>
        <div className="bg-bloom-cream/50 p-12 rounded-[60px] border border-bloom-accent/20">
           <h3 className="text-2xl font-serif font-bold text-bloom-green mb-8">Ready to transform your space?</h3>
           <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <div className="flex items-center gap-3 px-8 py-5 bg-white rounded-2xl shadow-sm border border-gray-50 group hover:border-bloom-green transition-all cursor-pointer">
                 <Phone size={20} className="text-bloom-orange" />
                 <div className="text-left">
                    <div className="text-[9px] font-bold text-gray-300 uppercase tracking-widest">Speak to Sales</div>
                    <div className="text-xs font-bold text-bloom-green">+1 (800) BLOOM-HQ</div>
                 </div>
              </div>
              <div className="flex items-center gap-3 px-8 py-5 bg-bloom-green rounded-2xl shadow-xl shadow-bloom-green/20 group hover:bg-black transition-all cursor-pointer">
                 <CalendarClock size={20} className="text-white" />
                 <div className="text-left">
                    <div className="text-[9px] font-bold text-white/50 uppercase tracking-widest">Schedule Demo</div>
                    <div className="text-xs font-bold text-white">Book a 15m slot</div>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* Footer Copy */}
      <footer className="py-12 px-6 max-w-7xl mx-auto border-t border-gray-100 mt-20 flex flex-col md:row justify-between items-center gap-8">
         <div className="font-serif text-xl font-bold text-bloom-green">BloomSupply Conservatory</div>
         <div className="flex gap-8 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            <span className="hover:text-bloom-green cursor-pointer">Sustainability</span>
            <span className="hover:text-bloom-green cursor-pointer">Wholesale Terms</span>
            <span className="hover:text-bloom-green cursor-pointer">Privacy</span>
            <span className="hover:text-bloom-green cursor-pointer">Contact</span>
         </div>
         <div className="text-[10px] font-bold text-gray-300 uppercase tracking-widest opacity-50">
            © 2024 BLOOMSUPPLY ARCHITECTURAL CONSERVATORY. ALL RIGHTS RESERVED.
         </div>
      </footer>
    </div>
  );
};

export default Corporate;
