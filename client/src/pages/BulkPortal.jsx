import React from 'react';
import { 
  BarChart3, 
  Truck, 
  Headset, 
  ArrowRight,
  TrendingUp,
  Clock,
  Download,
  CheckCircle2
} from 'lucide-react';
import { Link } from 'react-router-dom';

const FeatureCard = ({ icon: Icon, title, description }) => (
  <div className="flex flex-col items-start p-8 bg-white rounded-3xl border border-gray-100 shadow-sm transition-all hover:shadow-md h-full">
    <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-bloom-green mb-6">
      <Icon size={24} />
    </div>
    <h3 className="text-lg font-bold text-bloom-green mb-2 tracking-tight">{title}</h3>
    <p className="text-sm text-gray-500 leading-relaxed font-medium">{description}</p>
  </div>
);

const PriceRow = ({ name, subtitle, standard, volume, enterprise, status }) => (
  <div className="grid grid-cols-1 md:grid-cols-5 gap-4 py-6 border-b border-gray-50 items-center hover:bg-gray-50/50 transition-colors px-4 rounded-xl group">
    <div className="md:col-span-1 flex items-center gap-4">
      <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 shrink-0">
        <img src="https://images.unsplash.com/photo-1591886103814-616147485303?w=50&h=50&fit=crop" alt={name} className="w-full h-full object-cover" />
      </div>
      <div>
        <div className="text-xs font-bold text-bloom-green">{name}</div>
        <div className="text-[10px] text-gray-400 font-medium italic">{subtitle}</div>
      </div>
    </div>
    <div className="text-center font-bold text-bloom-green text-sm">{standard}</div>
    <div className="text-center font-bold text-bloom-orange text-sm">{volume}</div>
    <div className="text-center font-bold text-bloom-green text-sm">{enterprise}</div>
    <div className="flex justify-center">
      <div className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest ${status === 'In Stock' ? 'bg-green-50 text-green-600' : 'bg-gray-50 text-gray-400'}`}>
        {status}
      </div>
    </div>
  </div>
);

const BulkPortal = () => {
  return (
    <div className="bg-white min-h-screen">
      
      {/* Hero Section */}
      <section className="relative bg-bloom-cream/30 py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center relative z-10">
          <div className="lg:col-span-6">
            <div className="text-[10px] font-bold text-bloom-orange uppercase tracking-[0.2em] mb-4">B2B Wholesale Portal</div>
            <h1 className="text-6xl font-serif font-bold text-bloom-green mb-8 leading-tight">
              The Architect's <br />Bulk Portal
            </h1>
            <p className="text-lg text-gray-400 leading-relaxed max-w-lg mb-10 font-medium italic">
              Engineered for event planners and floral wholesalers. Scale your supply with industrial precision and guaranteed logistics.
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="bg-bloom-green text-white px-8 py-4 rounded-xl font-bold text-sm hover:brightness-110 transition-all shadow-lg shadow-bloom-green/20">
                Apply for Wholesale
              </button>
              <button className="bg-white border-2 border-gray-100 text-bloom-green px-8 py-4 rounded-xl font-bold text-sm hover:bg-gray-50 transition-all">
                Download Catalog
              </button>
            </div>
          </div>
          <div className="lg:col-span-6 relative">
            <div className="aspect-[4/3] rounded-[40px] overflow-hidden shadow-2xl relative z-10">
              <img src="https://images.unsplash.com/photo-1542332213-9b5a5a3fad35?w=1000&h=800&fit=crop" className="w-full h-full object-cover" alt="Nursery" />
            </div>
            <div className="absolute -top-10 -right-10 w-64 h-64 bg-bloom-accent/20 rounded-full blur-3xl z-0"></div>
          </div>
        </div>
      </section>

      {/* Feature Section */}
      <section className="py-24 max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        <FeatureCard 
          icon={BarChart3}
          title="Tiered Volume Pricing"
          description="Automated price breaks that reward scale. The more your stack demands, the lower your margin grows."
        />
        <FeatureCard 
          icon={Truck}
          title="Priority Fulfillment"
          description="Dedicated cold-chain logistics. Your stems are prioritized in our queue and arrive in peak market-freshness."
        />
        <FeatureCard 
          icon={Headset}
          title="Dedicated Concierge"
          description="A single point of contact for sourcing rare varieties and managing complex multi-destination shipments."
        />
      </section>

      {/* Market Price Index */}
      <section className="py-24 bg-bloom-cream/20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-12">
            <h2 className="text-3xl font-serif font-bold text-bloom-green mb-4">Market Price Index</h2>
            <p className="text-sm text-gray-400 font-medium italic">Live wholesale rates for your seasonal selections.</p>
          </div>

          <div className="bg-white rounded-[32px] overflow-hidden border border-gray-100 shadow-sm p-4">
            <div className="grid grid-cols-5 gap-4 py-4 px-4 border-b border-gray-100 text-[10px] font-bold text-gray-300 uppercase tracking-widest italic">
              <div>Botanical Variety</div>
              <div className="text-center">Standard (1-50)</div>
              <div className="text-center">Volume (51-200)</div>
              <div className="text-center">Enterprise (200+)</div>
              <div className="text-center">Status</div>
            </div>
            <div className="space-y-1 mt-2">
              <PriceRow 
                name="Ranunculus 'Hanoi'"
                subtitle="Heritage Botanical"
                standard="$4.50 / stem"
                volume="$3.75 / stem"
                enterprise="$3.10 / stem"
                status="In Stock"
              />
              <PriceRow 
                name="Peony 'Sarah Bernhardt'"
                subtitle="The Vellum Glasshouse"
                standard="$8.75 / stem"
                volume="$6.50 / stem"
                enterprise="$5.50 / stem"
                status="In Stock"
              />
              <PriceRow 
                name="King Protea 'Blush-Build'"
                subtitle="Verdant Ridge Co."
                standard="$18.50 / bundle"
                volume="$14.00 / bundle"
                enterprise="$11.50 / bundle"
                status="In Stock"
              />
              <PriceRow 
                name="Silver Dollar Eucalyptus"
                subtitle="Field 04"
                standard="$28.00 / bunch"
                volume="$22.00 / bunch"
                enterprise="$18.50 / bunch"
                status="Limited"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Wholesale Curations */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl font-serif font-bold text-bloom-green mb-4">Wholesale Curations</h2>
            <p className="text-sm text-gray-400 font-medium italic">Bulk bundles optimized for seasonal design.</p>
          </div>
          <Link to="/marketplace" className="text-[10px] font-bold text-bloom-green border-b-2 border-bloom-green pb-1 uppercase tracking-widest hover:text-bloom-orange hover:border-bloom-orange transition-all">View All Bundles</Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[600px]">
          <div className="lg:col-span-8 relative rounded-[40px] overflow-hidden group">
            <img src="https://images.unsplash.com/photo-1526047932273-341f2a7631f9?w=1000&h=800&fit=crop" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Curation" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <div className="absolute bottom-10 left-10 text-white">
              <h3 className="text-4xl font-serif font-bold mb-2">The Cold Storage Series</h3>
              <p className="text-sm text-gray-200 uppercase tracking-widest font-bold">Standard vetted logistics - 32 Designs Approved</p>
              <button className="mt-6 flex items-center gap-2 bg-white text-bloom-green px-6 py-2 rounded-lg text-xs font-bold">
                Build My Sequence <ArrowRight size={14} />
              </button>
            </div>
          </div>
          <div className="lg:col-span-4 flex flex-col gap-8">
            <div className="flex-1 relative rounded-[40px] overflow-hidden group">
              <img src="https://images.unsplash.com/photo-1518133910546-b6c2fb7d79e3?w=500&h=400&fit=crop" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Curation" />
              <div className="absolute inset-0 bg-black/30"></div>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center p-6">
                <h4 className="text-xl font-bold mb-1">Field Fresh Selects</h4>
                <p className="text-[10px] uppercase font-bold tracking-widest text-gray-300">Direct From Source</p>
              </div>
            </div>
            <div className="flex-1 relative rounded-[40px] overflow-hidden group">
              <img src="https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=500&h=400&fit=crop" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Curation" />
              <div className="absolute inset-0 bg-black/30"></div>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center p-6">
                <h4 className="text-xl font-bold mb-1">Specialty Botanical</h4>
                <p className="text-[10px] uppercase font-bold tracking-widest text-gray-300">Architectural Varieties</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-bloom-green py-32 text-center text-white">
        <div className="max-w-2xl mx-auto px-6">
          <h2 className="text-5xl font-serif font-bold mb-8 leading-tight">Secure Your Supply Chain for the Season</h2>
          <p className="text-lg text-bloom-accent/80 mb-12 font-medium italic">
            Verify your business account today to unlock tiered pricing, live availability, and dedicated sourcing for your upcoming requirements.
          </p>
          <button className="bg-bloom-orange text-white px-12 py-5 rounded-2xl font-bold text-lg hover:brightness-110 transition-all shadow-xl shadow-black/20">
            Apply for Wholesale
          </button>
        </div>
      </section>

    </div>
  );
};

export default BulkPortal;
