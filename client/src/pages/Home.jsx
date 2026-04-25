import React, { useState, useEffect } from 'react';
import { Leaf, Flower, User, Truck, ArrowRight, Check, ShoppingBag, Gift, CalendarClock } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/* ───────── Welcome Overlay ───────── */
const WelcomeOverlay = ({ onEnter }) => {
  const [visible, setVisible] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      handleEnter();
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  const handleEnter = () => {
    setFadeOut(true);
    setTimeout(() => {
      setVisible(false);
      onEnter();
    }, 800);
  };

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-bloom-green cursor-pointer transition-all duration-800 ${fadeOut ? 'opacity-0 -translate-y-full' : 'opacity-100'}`}
      onClick={handleEnter}
      style={{ transition: 'opacity .8s ease, transform .8s ease' }}
    >
      {/* Decorative circles */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-white/5 blur-[120px]"></div>
      <div className="absolute bottom-[-15%] right-[-15%] w-[50%] h-[50%] rounded-full bg-bloom-orange/10 blur-[100px]"></div>

      {/* Floating petals animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-3 h-3 bg-white/10 rounded-full"
            style={{
              left: `${15 + i * 15}%`,
              top: `${10 + (i % 3) * 30}%`,
              animation: `float ${3 + i * 0.5}s ease-in-out infinite alternate`,
              animationDelay: `${i * 0.3}s`
            }}
          ></div>
        ))}
      </div>

      <div className="relative z-10 text-center px-6 max-w-2xl">
        {/* Logo */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/10 backdrop-blur-md mb-6 ring-2 ring-white/20 shadow-2xl">
            <Flower className="text-white" size={32} />
          </div>
        </div>

        <h1 className="text-6xl md:text-8xl font-serif font-bold text-white mb-6 tracking-tight leading-[1.05]"
            style={{ animation: 'fadeInUp .8s ease-out' }}>
          Bloom<span className="text-bloom-orange">Supply</span>
        </h1>

        <p className="text-lg md:text-xl text-white/60 font-medium mb-12 max-w-lg mx-auto leading-relaxed italic font-serif"
           style={{ animation: 'fadeInUp .8s ease-out .2s both' }}>
          The Architectural Standard for Fresh Flower Commerce
        </p>

        <button
          onClick={handleEnter}
          className="bg-bloom-orange text-white px-12 py-5 rounded-2xl font-bold text-sm uppercase tracking-[.3em] hover:brightness-110 transition-all shadow-2xl shadow-bloom-orange/30 group"
          style={{ animation: 'fadeInUp .8s ease-out .4s both' }}
        >
          Enter Conservatory
          <ArrowRight className="inline-block ml-3 group-hover:translate-x-1 transition-transform" size={18} />
        </button>

        <div className="mt-16 flex justify-center gap-12 text-white/30"
             style={{ animation: 'fadeInUp .8s ease-out .6s both' }}>
          <div className="text-center">
            <div className="text-2xl font-serif font-bold text-white/50">500+</div>
            <div className="text-[9px] uppercase tracking-[.3em] font-bold mt-1">Products</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-serif font-bold text-white/50">50+</div>
            <div className="text-[9px] uppercase tracking-[.3em] font-bold mt-1">Growers</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-serif font-bold text-white/50">24h</div>
            <div className="text-[9px] uppercase tracking-[.3em] font-bold mt-1">Fresh Delivery</div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          from { transform: translateY(0) scale(1); opacity: 0.3; }
          to { transform: translateY(-40px) scale(1.5); opacity: 0.1; }
        }
      `}</style>
    </div>
  );
};

/* ───────── Hero Section ───────── */
const Hero = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleCtaClick = () => {
    if (user) {
      if (user.role === 'customer') navigate('/marketplace');
      else if (user.role === 'grower') navigate('/grower/dashboard');
      else if (user.role === 'vendor') navigate('/vendor/dashboard');
    } else {
      navigate('/marketplace');
    }
  };

  return (
    <section className="relative h-[85vh] bg-bloom-green text-white overflow-hidden">
      <div className="absolute inset-0 bg-black/40 z-10"></div>
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=1600&h=1200&fit=crop"
          alt="Greenhouse"
          className="w-full h-full object-cover blur-[2px]"
        />
      </div>
      <div className="relative z-20 max-w-7xl mx-auto px-6 h-full flex flex-col justify-center">
        <h1 className="text-5xl md:text-7xl font-serif font-bold leading-tight max-w-3xl">
          From Farm to Doorstep — <br/>
          Fresh Flower Commerce <br/>
          Simplified
        </h1>
        <p className="mt-6 text-lg text-gray-200 max-w-2xl leading-relaxed">
          The preferred architectural standard for floral supply chains. Delivering handcrafted beauty directly from our select markets.
        </p>
        <div className="mt-10 flex flex-wrap gap-4">
          <button
            onClick={handleCtaClick}
            className="bg-bloom-orange text-white px-8 py-4 rounded-lg font-bold hover:brightness-110 transition-all shadow-lg shadow-bloom-orange/30"
          >
            Shop Flowers
          </button>
          <Link
            to="/login?tab=register&role=grower"
            className="bg-white text-bloom-green px-8 py-4 rounded-lg font-bold hover:bg-gray-100 transition-all font-sans"
          >
            List a Flower
          </Link>
          <Link
            to="/login"
            className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-8 py-4 rounded-lg font-bold hover:bg-white/20 transition-all font-sans"
          >
            Portal Access
          </Link>
        </div>
      </div>
    </section>
  );
};

/* ───────── Availability Showcase ───────── */
const AvailabilityShowcase = () => {
  const navigate = useNavigate();
  const services = [
    {
      title: 'The Shop',
      icon: <ShoppingBag size={28} />,
      desc: 'Browse our curated collection of premium flowers, exotic orchids, architectural greens, and designer bouquets.',
      cta: 'Browse Marketplace',
      path: '/marketplace',
      color: 'bg-bloom-green',
      image: 'https://images.unsplash.com/photo-1509610952-e2e6786a9158?w=600&h=400&fit=crop'
    },
    {
      title: 'Bouquets',
      icon: <Gift size={28} />,
      desc: 'Hand-tied designer bouquets crafted by our in-house floral artists. Wedding, birthday, or everyday beauty.',
      cta: 'View Bouquets',
      path: '/marketplace?category=bouquet',
      color: 'bg-bloom-orange',
      image: 'https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=600&h=400&fit=crop'
    },
    {
      title: 'Subscriptions',
      icon: <CalendarClock size={28} />,
      desc: 'Automated botanical rotations delivered on your schedule. Stay fresh without the hassle of reordering.',
      cta: 'View Plans',
      path: '/subscriptions',
      color: 'bg-[#8b4513]',
      image: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?w=600&h=400&fit=crop'
    }
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-xs uppercase tracking-widest text-bloom-orange font-bold mb-2">What We Offer</div>
        <h2 className="text-4xl font-serif font-bold text-bloom-green mb-16">Our Availability</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {services.map((s, i) => (
            <div key={i} className="group cursor-pointer" onClick={() => navigate(s.path)}>
              <div className="relative h-64 rounded-3xl overflow-hidden mb-6 shadow-lg">
                <img src={s.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={s.title} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className={`absolute top-4 left-4 ${s.color} text-white px-4 py-2 rounded-xl flex items-center gap-2`}>
                  {s.icon}
                  <span className="font-bold text-sm">{s.title}</span>
                </div>
              </div>
              <p className="text-sm text-gray-500 leading-relaxed mb-4">{s.desc}</p>
              <button className="text-xs font-bold text-bloom-green flex items-center gap-2 group-hover:text-bloom-orange transition-colors uppercase tracking-widest">
                {s.cta} <ArrowRight size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ───────── Ecosystem ───────── */
const Ecosystem = () => {
  const navigate = useNavigate();
  return (
    <section className="py-24 bg-bloom-cream">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-xs uppercase tracking-widest text-bloom-orange font-bold mb-2">Our Capabilities</div>
        <h2 className="text-4xl font-serif font-bold text-bloom-green mb-12">The Digital Conservatory Ecosystem</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { title: "The Grower", icon: <Leaf />, desc: "Streamlining production for commercial success and sustainable farm crops.", path: '/login?tab=register&role=grower' },
            { title: "The Shop", icon: <Flower />, desc: "Modern procurement tool for retailers, wholesalers, and floral designers.", path: '/login?tab=register&role=vendor' },
            { title: "The Customer", icon: <User />, desc: "Enhancing transparency and trust between buyers and our floral network.", path: '/marketplace' },
            { title: "The Delivery", icon: <Truck />, desc: "Building a resilient logistics infrastructure for rapid farm delivery.", path: '/marketplace' }
          ].map((item, i) => (
            <div
              key={i}
              onClick={() => navigate(item.path)}
              className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="w-12 h-12 bg-green-100 text-bloom-green flex items-center justify-center rounded-xl mb-6 group-hover:bg-bloom-green group-hover:text-white transition-all">
                {item.icon}
              </div>
              <h3 className="text-xl font-bold text-bloom-green mb-4">{item.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ───────── Seasonal Selection ───────── */
const SeasonalSelection = () => (
  <section className="py-24 bg-white">
    <div className="max-w-7xl mx-auto px-6">
      <div className="flex justify-between items-end mb-12">
        <div>
          <div className="text-xs uppercase tracking-widest text-bloom-orange font-bold mb-2">Curated Selections</div>
          <h2 className="text-4xl font-serif font-bold text-bloom-green">Seasonal Architectural Blooms</h2>
        </div>
        <Link to="/marketplace" className="flex items-center gap-2 text-bloom-green font-bold text-sm hover:underline">
          View all selections <ArrowRight size={16} />
        </Link>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <Link to="/marketplace?category=protea" className="lg:col-span-8 relative rounded-3xl overflow-hidden group cursor-pointer h-[600px] block">
          <img src="https://images.unsplash.com/photo-1526047932273-341f2a7631f9?w=1000&h=800&fit=crop" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="King Protea" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          <div className="absolute bottom-8 left-8 text-white">
            <div className="bg-bloom-orange/80 px-4 py-1 rounded-full text-xs font-bold mb-4 inline-block">Featured Collection</div>
            <h3 className="text-3xl font-serif font-bold">King Protea Collection</h3>
            <p className="text-gray-200 mt-2">Durable. Architectural. Elegant.</p>
          </div>
        </Link>
        <div className="lg:col-span-4 flex flex-col gap-8">
          <Link to="/marketplace?category=dahlias" className="relative h-[286px] rounded-3xl overflow-hidden group cursor-pointer block">
            <img src="https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=500&h=400&fit=crop" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Dahlias" />
            <div className="absolute inset-0 bg-black/30"></div>
            <div className="absolute bottom-6 left-6 text-white text-sm">
              <h4 className="font-bold">Sweet Red Dahlias</h4>
              <p className="text-xs text-gray-300">$14.00 / Stem</p>
            </div>
          </Link>
          <Link to="/marketplace?category=tulips" className="relative h-[286px] rounded-3xl overflow-hidden group cursor-pointer block">
            <img src="https://images.unsplash.com/photo-1606041008023-472dfb5e530f?w=500&h=400&fit=crop" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="White Tulips" />
            <div className="absolute inset-0 bg-black/30"></div>
            <div className="absolute bottom-6 left-6 text-white text-sm">
              <h4 className="font-bold">Classic White Tulips</h4>
              <p className="text-xs text-gray-300">$10.00 / Stem</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  </section>
);

/* ───────── Bulk Section ───────── */
const BulkSection = () => {
  const navigate = useNavigate();
  return (
    <section className="py-24 bg-white px-6">
      <div className="max-w-7xl mx-auto rounded-[40px] overflow-hidden grid md:grid-cols-2 bg-bloom-green text-white">
        <div className="p-16 flex flex-col justify-center">
          <div className="text-xs uppercase tracking-widest text-bloom-orange font-bold mb-4">Enterprise Solutions</div>
          <h2 className="text-5xl font-serif font-bold leading-tight mb-8">Scale Your Aesthetic with Bulk Procurement</h2>
          <p className="text-gray-300 mb-10 leading-relaxed max-w-md">
            Managed logistics engine provides green designers and high-volume stores with standard-vetted procurement, access, and climate-controlled logistics network.
          </p>
          <ul className="space-y-4 mb-10">
            {["Fast and Reliable Tracking", "Professional Floral Network", "Access to Exclusive Selections"].map((text, i) => (
              <li key={i} className="flex items-center gap-3 text-sm font-medium">
                <div className="w-5 h-5 bg-bloom-orange rounded-full flex items-center justify-center"><Check size={12} strokeWidth={4} /></div>
                {text}
              </li>
            ))}
          </ul>
          <button
            onClick={() => navigate('/login?tab=register&role=vendor')}
            className="bg-bloom-orange text-white px-10 py-5 rounded-xl font-bold w-fit hover:translate-y-[-2px] transition-all"
          >
            Sign up for Bulk Flow
          </button>
        </div>
        <div className="relative min-h-[500px]">
          <img src="https://images.unsplash.com/photo-1542332213-9b5a5a3fad35?w=800&h=1000&fit=crop" className="absolute inset-0 w-full h-full object-cover" alt="Flower Warehouse" />
          <div className="absolute inset-0 bg-bloom-green/10"></div>
        </div>
      </div>
    </section>
  );
};

/* ───────── Pricing ───────── */
const Pricing = () => {
  const navigate = useNavigate();
  return (
    <section className="py-24 bg-bloom-cream">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <div className="text-xs uppercase tracking-widest text-bloom-orange font-bold mb-2">The Conservatory Club</div>
        <h2 className="text-4xl font-serif font-bold text-bloom-green mb-4">Automated Botanical Rotations</h2>
        <p className="text-gray-500 mb-16 max-w-2xl mx-auto">Sourcing directly through farm-fixed subscription services. Handled by our world-class team of rotating floral curators.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          <div className="bg-white p-12 rounded-[32px] border border-gray-100 flex flex-col">
            <h3 className="font-bold text-gray-500 mb-6 font-serif">Studio Tier</h3>
            <div className="text-4xl font-bold text-bloom-green mb-2">$149<span className="text-sm font-normal text-gray-400">/mo</span></div>
            <p className="text-sm text-gray-400 mb-10 font-serif opacity-70 italic">Friendly, seasonal essentials for small studios and workshops.</p>
            <div className="mt-auto">
              <button onClick={() => navigate('/subscriptions')} className="w-full border-2 border-gray-100 text-bloom-green py-4 rounded-xl font-bold hover:bg-gray-50 uppercase tracking-tighter">Select Studio</button>
            </div>
          </div>

          <div className="bg-bloom-green p-12 rounded-[32px] text-white flex flex-col relative scale-105 shadow-2xl">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-bloom-orange text-[10px] uppercase font-bold tracking-widest px-4 py-1 rounded-full">Popular Choice</div>
            <h3 className="font-bold text-bloom-accent mb-6 font-serif">Atelier Tier</h3>
            <div className="text-4xl font-bold mb-2 text-white">$349<span className="text-sm font-normal text-bloom-accent">/mo</span></div>
            <p className="text-sm text-bloom-accent mb-10 font-serif opacity-70 italic">Advanced, curated selection for designers and medium events.</p>
            <div className="mt-auto">
              <button onClick={() => navigate('/subscriptions')} className="w-full bg-bloom-orange text-white py-4 rounded-xl font-bold hover:brightness-110 uppercase tracking-tighter">Select Atelier</button>
            </div>
          </div>

          <div className="bg-white p-12 rounded-[32px] border border-gray-100 flex flex-col">
            <h3 className="font-bold text-gray-500 mb-6 font-serif">Estate Tier</h3>
            <div className="text-4xl font-bold text-bloom-green mb-2">Custom<span className="text-sm font-normal text-gray-400">/mo</span></div>
            <p className="text-sm text-gray-400 mb-10 font-serif opacity-70 italic">Full-service procurement for large accounts and global brands.</p>
            <div className="mt-auto">
              <button onClick={() => navigate('/subscriptions')} className="w-full border-2 border-gray-100 text-bloom-green py-4 rounded-xl font-bold hover:bg-gray-50 uppercase tracking-tighter">Contact Sales</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

/* ───────── Main Home Component ───────── */
const Home = () => {
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    // Only show welcome once per session
    const shown = sessionStorage.getItem('bloom_welcome_shown');
    if (shown) setShowWelcome(false);
  }, []);

  const handleWelcomeComplete = () => {
    setShowWelcome(false);
    sessionStorage.setItem('bloom_welcome_shown', 'true');
  };

  return (
    <>
      {showWelcome && <WelcomeOverlay onEnter={handleWelcomeComplete} />}
      <Hero />
      <AvailabilityShowcase />
      <Ecosystem />
      <SeasonalSelection />
      <BulkSection />
      <Pricing />
    </>
  );
};

export default Home;
