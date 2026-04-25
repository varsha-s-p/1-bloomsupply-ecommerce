import React from 'react';
import { 
  Check, 
  Building2,
  Package,
  Truck,
  Gem,
  Zap,
  Users,
  ShieldCheck
} from 'lucide-react';

const PlanCard = ({ tier, price, description, features, highlighted = false }) => (
  <div className={`p-8 rounded-[40px] flex flex-col h-full transition-all duration-500 hover:shadow-2xl ${highlighted ? 'bg-bloom-green text-white shadow-2xl scale-105 border-none z-10' : 'bg-white text-bloom-green border border-gray-100 shadow-sm'}`}>
    <div className="aspect-[4/3] rounded-3xl overflow-hidden mb-8 shadow-inner bg-gray-50">
      <img 
        src={
          tier === "Studio Tier" ? "/assets/studio.png" :
          tier === "Atelier Tier" ? "/assets/atelier.png" :
          "/assets/estate.png"
        } 
        className="w-full h-full object-cover hover:scale-110 transition-transform duration-1000" 
        alt={tier} 
      />
    </div>
    
    {highlighted && (
      <div className="bg-bloom-orange text-white text-[9px] font-bold uppercase tracking-[.25em] px-4 py-1.5 rounded-full self-start mb-4 shadow-lg shadow-bloom-orange/30">
        Limited
      </div>
    )}
    
    <h3 className="text-2xl font-serif font-bold mb-3 tracking-tight">{tier}</h3>
    <div className={`text-xs mb-8 font-medium leading-relaxed ${highlighted ? 'text-bloom-accent/70' : 'text-gray-400'}`}>{description}</div>
    
    <div className="flex items-baseline gap-2 mb-10">
      <span className="text-5xl font-serif font-bold">${price}</span>
      <span className={`text-[9px] font-bold uppercase tracking-[.3em] ${highlighted ? 'text-bloom-accent/50' : 'text-gray-300'}`}>/ delivery</span>
    </div>

    <ul className="space-y-4 mb-12 flex-1">
      {features.map((feature, i) => (
        <li key={i} className="flex items-center gap-3">
          <div className={`shrink-0 ${highlighted ? 'text-bloom-accent' : 'text-bloom-green'}`}>
            {feature.icon || <Check size={14} />}
          </div>
          <span className={`text-[11px] font-bold tracking-tight ${highlighted ? 'text-white' : 'text-gray-600'}`}>{feature.text || feature}</span>
        </li>
      ))}
    </ul>

    <button className={`w-full py-5 rounded-2xl font-bold text-[10px] uppercase tracking-[.3em] transition-all ${highlighted ? 'bg-bloom-green-light text-white hover:brightness-125 shadow-lg shadow-black/20' : 'bg-white border border-gray-100 text-bloom-green hover:bg-gray-50'}`}>
      Select Plan
    </button>
  </div>
);

const Step = ({ number, title, description }) => (
  <div className="flex gap-8 items-start">
    <div className="w-10 h-10 rounded-full bg-bloom-green text-white flex items-center justify-center text-xs font-bold shrink-0 shadow-xl shadow-bloom-green/20">
      {number}
    </div>
    <div>
      <h4 className="text-lg font-serif font-bold text-bloom-green mb-3 tracking-tight">{title}</h4>
      <p className="text-sm text-gray-500 leading-relaxed font-medium max-w-sm">{description}</p>
    </div>
  </div>
);

const Subscriptions = () => {
  return (
    <div className="bg-[#fdfaf6] min-h-screen selection:bg-bloom-orange selection:text-white pb-20">
      
      {/* Hero Section */}
      <section className="bg-white py-24 sm:py-32 overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="relative z-10">
            <div className="text-[10px] font-bold text-bloom-orange uppercase tracking-[.5em] mb-10">The Conservatory Subscription</div>
            <h1 className="text-6xl sm:text-7xl font-serif font-bold text-bloom-green mb-10 leading-[1.05] tracking-tight">
              Automated <br />Botanical Rotations
            </h1>
            <p className="text-lg text-gray-500 font-medium mb-12 max-w-lg leading-relaxed">
              Ensure freshness on your schedule. Build a rotational collection of architectural selections, delivered with meticulous precision to your doorstep.
            </p>
            <div className="flex flex-col sm:flex-row gap-5">
              <button className="bg-bloom-green text-white px-12 py-5 rounded-2xl font-bold text-[10px] uppercase tracking-[.3em] hover:bg-bloom-green-light transition-all shadow-xl shadow-bloom-green/20">
                Join Now
              </button>
              <button className="bg-white border-2 border-gray-100 text-bloom-green px-12 py-5 rounded-2xl font-bold text-[10px] uppercase tracking-[.3em] hover:bg-gray-50 transition-all">
                View Samples
              </button>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-[4/5] rounded-[60px] overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.12)] relative z-10 group bg-gray-50">
              <img 
                src="/assets/hero.png" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[3000ms]" 
                alt="Botanical Rotation" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-bloom-green/10 to-transparent"></div>
            </div>
            {/* Geometric accents */}
            <div className="absolute -top-20 -right-20 w-80 h-80 bg-bloom-accent/20 rounded-full -z-10 blur-[100px] opacity-40"></div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-32 max-w-7xl mx-auto px-6">
        <div className="mb-24 flex flex-col md:flex-row md:items-end justify-between gap-10">
          <div>
            <h2 className="text-5xl font-serif font-bold text-bloom-green mb-6 tracking-tight">Curated Delivery Plans</h2>
            <p className="text-base text-gray-400 font-medium italic max-w-xl leading-relaxed">
              Scale your atmosphere exactly as needed. Every rotation is uniquely designed by our architectural analysts for your environment.
            </p>
          </div>
          
          <div className="bg-white p-2 rounded-full border border-gray-100 inline-flex shadow-sm">
            <button className="bg-bloom-green text-white px-8 py-3 rounded-full text-[9px] font-bold uppercase tracking-widest transition-all">Show Weekly</button>
            <button className="text-gray-300 font-bold text-[9px] uppercase tracking-widest px-8 py-3 hover:text-bloom-green transition-colors">Show Monthly (Save 15%)</button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 items-stretch">
          <PlanCard 
            tier="Studio Tier"
            price="45"
            description="Weekly sculptural floral essentials for entryways, workspaces, or side tables."
            features={[
              { text: "5-7 Seasonal Stems", icon: <Package size={14} /> },
              { text: "Curated Glass Vase included", icon: <Gem size={14} /> },
              { text: "Base Quality Flora", icon: <ShieldCheck size={14} /> }
            ]}
          />
          <PlanCard 
            tier="Atelier Tier"
            highlighted={true}
            price="85"
            description="Elevated botanical arrangements designed for dining centers and aesthetic focal points."
            features={[
              { text: "12-15 Premium Stems", icon: <Package size={14} /> },
              { text: "Exclusive Ceramic Staging", icon: <Gem size={14} /> },
              { text: "Pre-Delivery Tracking", icon: <Truck size={14} /> },
              { text: "Pro-Botanical Hand-Pick", icon: <ShieldCheck size={14} /> }
            ]}
          />
          <PlanCard 
            tier="Estate Tier"
            price="180"
            description="Exhibition-level architectural florals tailored for reception areas and large living spaces."
            features={[
              { text: "25+ Grandiose Stems", icon: <Package size={14} /> },
              { text: "Artist Series Vases", icon: <Gem size={14} /> },
              { text: "Bespoke On-Site Setup", icon: <Users size={14} /> },
              { text: "Priority Premium Support", icon: <Zap size={14} /> }
            ]}
          />
        </div>
      </section>

      {/* The Subscription Cycle */}
      <section className="py-32 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <div className="order-2 lg:order-1">
            <h3 className="text-4xl font-serif font-bold text-bloom-green mb-16 tracking-tight">The Subscription Cycle</h3>
            <div className="space-y-16">
              <Step 
                number="01" 
                title="Select & Frequency" 
                description="Choose your tier and set your delivery frequency. Our system takes note of your preferred architectural style and color palette." 
              />
              <Step 
                number="02" 
                title="Mechanical Preparation" 
                description="Our designers assemble your arrangement in our temperature-controlled atelier using the morning's freshest market arrivals." 
              />
              <Step 
                number="03" 
                title="Sustained Fresh" 
                description="We deliver your rotation using our fleet of refrigerated vans, ensuring zero shock to the floral lifecycle from our door to yours." 
              />
            </div>
          </div>
          <div className="relative order-1 lg:order-2">
            <div className="aspect-square rounded-[80px] overflow-hidden shadow-2xl relative group bg-gray-50">
              <img 
                src="/assets/cycle.png" 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[3000ms]" 
                alt="Arranging" 
              />
            </div>
            {/* Testimonial Overlay */}
            <div className="absolute -bottom-12 -left-12 bg-white p-10 rounded-[40px] shadow-[0_20px_50px_rgba(0,0,0,0.1)] max-w-[320px] border border-gray-50 z-20">
              <div className="text-bloom-orange text-4xl font-serif mb-2 leading-none">“</div>
              <p className="text-sm text-bloom-green font-bold leading-relaxed italic mb-6">
                The rotation ensures my office always feels alive. I can't live without my weekly BloomSupply.
              </p>
              <div className="text-[10px] font-bold text-gray-300 uppercase tracking-[.4em]">— RENEE WEISS, DESIGNER</div>
            </div>
          </div>
        </div>
      </section>

      {/* Corporate Botanical Solutions */}
      <section className="py-32 max-w-7xl mx-auto px-6">
        <div className="bg-bloom-green rounded-[60px] p-12 lg:p-24 text-white flex flex-col lg:flex-row justify-between items-center gap-16 relative overflow-hidden shadow-2xl shadow-bloom-green/30">
          <div className="relative z-10 lg:max-w-xl text-center lg:text-left">
            <h2 className="text-5xl font-serif font-bold mb-8 tracking-tight">Corporate Botanical Solutions</h2>
            <p className="text-lg text-bloom-accent/80 font-medium italic mb-12 leading-relaxed">
              Transition your office atmosphere with recurring high-impact installations. Bespoke on-site management, centralized billing, and dedicated account experts.
            </p>
            <button className="bg-white text-bloom-green px-12 py-5 rounded-2xl font-bold text-[10px] uppercase tracking-[.3em] hover:brightness-110 shadow-xl shadow-black/20 transition-all">
              Request a Case Study
            </button>
          </div>

          <div className="grid grid-cols-2 gap-6 relative z-10 w-full lg:w-auto">
            <div className="bg-white/5 border border-white/10 rounded-[32px] p-8 backdrop-blur-md hover:bg-white/10 transition-all group">
              <div className="text-4xl font-serif font-bold mb-2 group-hover:text-bloom-accent transition-colors">500+</div>
              <div className="text-[10px] text-bloom-accent/60 font-bold uppercase tracking-widest">Active Clients</div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-[32px] p-8 backdrop-blur-md hover:bg-white/10 transition-all group">
              <div className="text-4xl font-serif font-bold mb-2 group-hover:text-bloom-accent transition-colors">Weekly</div>
              <div className="text-[10px] text-bloom-accent/60 font-bold uppercase tracking-widest">Reliability</div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-[32px] p-8 backdrop-blur-md hover:bg-white/10 transition-all group">
              <div className="text-4xl font-serif font-bold mb-2 group-hover:text-bloom-accent transition-colors">31h</div>
              <div className="text-[10px] text-bloom-accent/60 font-bold uppercase tracking-widest">Portal Access</div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-[32px] p-8 backdrop-blur-md hover:bg-white/10 transition-all group">
              <div className="text-4xl font-serif font-bold mb-2 group-hover:text-bloom-accent transition-colors">Tax</div>
              <div className="text-[10px] text-bloom-accent/60 font-bold uppercase tracking-widest">Efficient Billing</div>
            </div>
          </div>
          
          {/* Decorative element */}
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-bloom-accent/10 rounded-full blur-[120px] -mr-80 -mt-80"></div>
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-white/5 rounded-full blur-[100px] -ml-40 -mb-40"></div>
        </div>
      </section>

      {/* Atmospheric CTA */}
      <section className="py-40 text-center px-6">
        <h2 className="text-5xl font-serif font-bold text-bloom-green mb-12 tracking-tight">Really to elaborate your atmosphere?</h2>
        <div className="flex flex-col sm:flex-row justify-center gap-6">
          <button className="bg-bloom-green text-white px-12 py-5 rounded-2xl font-bold text-[10px] uppercase tracking-[.3em] hover:bg-bloom-green-light transition-all shadow-xl shadow-bloom-green/20">
            Join Now
          </button>
          <button className="bg-white text-bloom-green px-12 py-5 rounded-2xl font-bold text-[10px] uppercase tracking-[.3em] hover:bg-gray-50 transition-all border border-gray-100 shadow-sm">
            Manage Plans
          </button>
        </div>
      </section>

    </div>
  );
};

export default Subscriptions;


