import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  User2, Sprout, Store, ArrowRight, Mail, Lock, ShieldCheck,
  Phone, MapPin, Building, Truck as TruckIcon, Leaf, Award
} from 'lucide-react';

const Login = () => {
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') === 'register' ? 'register' : 'login';
  const initialRole = searchParams.get('role') || 'customer';

  const [tab, setTab] = useState(initialTab);
  const [role, setRole] = useState(initialRole);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');

  // Vendor fields
  const [shopName, setShopName] = useState('');
  const [shopAddress, setShopAddress] = useState('');
  const [shopCity, setShopCity] = useState('');
  const [shopPhone, setShopPhone] = useState('');
  const [deliveryAvailable, setDeliveryAvailable] = useState(false);

  // Grower fields
  const [farmName, setFarmName] = useState('');
  const [farmAddress, setFarmAddress] = useState('');
  const [farmCity, setFarmCity] = useState('');
  const [farmPhone, setFarmPhone] = useState('');
  const [specialties, setSpecialties] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const { login, register, user } = useAuth();

  useEffect(() => {
    if (user) {
      if (user.role === 'customer') navigate('/dashboard');
      else if (user.role === 'grower') navigate('/grower/dashboard');
      else if (user.role === 'vendor') navigate('/vendor/dashboard');
    }
  }, [user, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const userData = await login(email, password);
      if (userData.role === 'customer') navigate('/dashboard');
      else if (userData.role === 'grower') navigate('/grower/dashboard');
      else if (userData.role === 'vendor') navigate('/vendor/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const formData = {
        name, email, password, role, phone, address, city, state, pincode,
        shopName, shopAddress, shopCity, shopPhone, deliveryAvailable,
        farmName, farmAddress, farmCity, farmPhone,
        specialties: specialties ? specialties.split(',').map(s => s.trim()) : []
      };

      const userData = await register(formData);
      if (userData.role === 'customer') navigate('/dashboard');
      else if (userData.role === 'grower') navigate('/grower/dashboard');
      else if (userData.role === 'vendor') navigate('/vendor/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const roles = [
    { id: 'customer', label: 'Customer', icon: User2, desc: 'Shop premium florals' },
    { id: 'grower', label: 'Grower', icon: Sprout, desc: 'Manage your farm' },
    { id: 'vendor', label: 'Vendor', icon: Store, desc: 'Manage your shop' },
  ];

  const InputField = ({ icon: Icon, label, type = 'text', value, onChange, placeholder, required = true }) => (
    <div className="space-y-2">
      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">{label}</label>
      <div className="relative group">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-bloom-green transition-colors">
          <Icon size={16} />
        </div>
        <input
          type={type}
          required={required}
          placeholder={placeholder}
          className="w-full bg-gray-50/50 border-2 border-gray-50 rounded-2xl py-3 pl-11 pr-4 text-sm focus:outline-none focus:border-bloom-green focus:bg-white transition-all font-medium text-bloom-green"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#fbfcfa] flex flex-col items-center justify-center p-6 selection:bg-bloom-orange selection:text-white relative overflow-hidden font-sans">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-bloom-green/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-bloom-orange/5 rounded-full blur-[150px]"></div>
      </div>

      <div className={`w-full ${tab === 'register' ? 'max-w-[1100px]' : 'max-w-[1000px]'} bg-white rounded-[60px] shadow-[0_32px_80px_rgba(0,0,0,0.06)] border border-gray-100 flex overflow-hidden relative z-10`}>

        {/* Left Side: Visual */}
        <div className="hidden lg:flex w-2/5 bg-bloom-green p-16 flex-col justify-between relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-4xl font-serif font-bold text-white mb-6 leading-tight">
              {tab === 'login' ? 'Welcome back to the portal.' : 'Join the BloomSupply ecosystem.'}
            </h2>
            <p className="text-white/70 text-lg font-medium italic font-serif leading-relaxed">
              {tab === 'login'
                ? 'Connect with artisan growers, manage your boutique shop, or discover the perfect arrangement.'
                : 'Register as a customer, vendor, or grower and start your floral journey today.'}
            </p>
          </div>

          <div className="mt-auto relative z-10">
            <div className="flex items-center gap-4 text-white/50 mb-8">
              <ShieldCheck size={24} />
              <span className="text-[10px] uppercase tracking-[.4em] font-bold">Encrypted & Secure</span>
            </div>
            <div className="text-[10px] text-white/30 font-bold uppercase tracking-widest">
              Demo: customer@bloom.com / password123
            </div>
          </div>

          <div className="absolute bottom-[-20%] right-[-20%] w-[80%] h-[80%] border-[40px] border-white/5 rounded-full blur-3xl"></div>
          <div className="absolute top-[10%] left-[10%] w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
        </div>

        {/* Right Side: Form */}
        <div className="w-full lg:w-3/5 p-10 lg:p-14 overflow-y-auto max-h-[90vh]">
          <div className="mb-8">
            <div className="font-serif text-3xl font-bold text-bloom-green mb-2">BloomSupply</div>

            {/* Tab Toggle */}
            <div className="flex gap-1 bg-gray-50 p-1 rounded-2xl mb-8 max-w-xs">
              <button
                onClick={() => { setTab('login'); setError(''); }}
                className={`flex-1 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${tab === 'login' ? 'bg-white text-bloom-green shadow-sm' : 'text-gray-400 hover:text-bloom-green'}`}
              >
                Login
              </button>
              <button
                onClick={() => { setTab('register'); setError(''); }}
                className={`flex-1 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${tab === 'register' ? 'bg-white text-bloom-green shadow-sm' : 'text-gray-400 hover:text-bloom-green'}`}
              >
                Register
              </button>
            </div>

            {/* Role Selector */}
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4 block">Select your role</label>
            <div className="grid grid-cols-3 gap-3 mb-6">
              {roles.map((r) => (
                <button
                  key={r.id}
                  onClick={() => setRole(r.id)}
                  className={`flex flex-col items-center gap-2 p-3 rounded-2xl border-2 transition-all duration-300 ${
                    role === r.id
                    ? 'border-bloom-green bg-bloom-green/5 text-bloom-green shadow-lg shadow-bloom-green/10'
                    : 'border-gray-50 bg-gray-50/50 text-gray-400 hover:border-gray-200 hover:bg-white'
                  }`}
                >
                  <r.icon size={18} />
                  <span className="text-[9px] font-bold uppercase tracking-widest">{r.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-6 text-xs font-medium">
              {error}
            </div>
          )}

          {/* LOGIN FORM */}
          {tab === 'login' && (
            <form onSubmit={handleLogin} className="space-y-5">
              <InputField icon={Mail} label="Email" type="email" value={email} onChange={setEmail} placeholder="name@company.com" />
              <InputField icon={Lock} label="Password" type="password" value={password} onChange={setPassword} placeholder="••••••••" />

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-bloom-green text-white py-4 rounded-2xl font-bold text-xs uppercase tracking-[.3em] flex items-center justify-center gap-3 hover:bg-black transition-all shadow-xl shadow-bloom-green/20 mt-6 relative overflow-hidden"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-white animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="w-2 h-2 rounded-full bg-white animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-2 h-2 rounded-full bg-white animate-bounce"></div>
                  </div>
                ) : (
                  <>Enter {role.charAt(0).toUpperCase() + role.slice(1)} Portal <ArrowRight size={16} /></>
                )}
              </button>
            </form>
          )}

          {/* REGISTER FORM */}
          {tab === 'register' && (
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <InputField icon={User2} label="Full Name" value={name} onChange={setName} placeholder="John Doe" />
                <InputField icon={Mail} label="Email" type="email" value={email} onChange={setEmail} placeholder="name@company.com" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <InputField icon={Lock} label="Password" type="password" value={password} onChange={setPassword} placeholder="Min 6 characters" />
                <InputField icon={Phone} label="Phone" value={phone} onChange={setPhone} placeholder="9876543210" />
              </div>
              <InputField icon={MapPin} label="Address" value={address} onChange={setAddress} placeholder="Street address" />
              <div className="grid grid-cols-3 gap-4">
                <InputField icon={Building} label="City" value={city} onChange={setCity} placeholder="City" />
                <InputField icon={Building} label="State" value={state} onChange={setState} placeholder="State" required={false} />
                <InputField icon={MapPin} label="Pincode" value={pincode} onChange={setPincode} placeholder="400001" required={false} />
              </div>

              {/* Vendor Extra Fields */}
              {role === 'vendor' && (
                <div className="mt-4 p-5 bg-bloom-cream/50 rounded-2xl border border-bloom-accent/20 space-y-4">
                  <div className="text-[10px] font-bold text-bloom-orange uppercase tracking-widest flex items-center gap-2">
                    <Store size={14} /> Vendor Details
                  </div>
                  <InputField icon={Building} label="Shop Name" value={shopName} onChange={setShopName} placeholder="My Flower Shop" />
                  <div className="grid grid-cols-2 gap-4">
                    <InputField icon={MapPin} label="Shop Address" value={shopAddress} onChange={setShopAddress} placeholder="Shop location" />
                    <InputField icon={Building} label="Shop City" value={shopCity} onChange={setShopCity} placeholder="City" />
                  </div>
                  <InputField icon={Phone} label="Shop Phone" value={shopPhone} onChange={setShopPhone} placeholder="Shop contact number" />
                  <label className="flex items-center gap-3 cursor-pointer mt-2">
                    <div
                      onClick={() => setDeliveryAvailable(!deliveryAvailable)}
                      className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors ${deliveryAvailable ? 'bg-bloom-green' : 'bg-gray-200'}`}
                    >
                      <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${deliveryAvailable ? 'right-0.5' : 'left-0.5'}`}></div>
                    </div>
                    <span className="text-xs font-bold text-gray-600 flex items-center gap-2"><TruckIcon size={14} /> Delivery Available</span>
                  </label>
                </div>
              )}

              {/* Grower Extra Fields */}
              {role === 'grower' && (
                <div className="mt-4 p-5 bg-bloom-cream/50 rounded-2xl border border-bloom-accent/20 space-y-4">
                  <div className="text-[10px] font-bold text-bloom-orange uppercase tracking-widest flex items-center gap-2">
                    <Leaf size={14} /> Grower Details
                  </div>
                  <InputField icon={Leaf} label="Farm Name" value={farmName} onChange={setFarmName} placeholder="My Farm" />
                  <div className="grid grid-cols-2 gap-4">
                    <InputField icon={MapPin} label="Farm Address" value={farmAddress} onChange={setFarmAddress} placeholder="Farm location" />
                    <InputField icon={Building} label="Farm City" value={farmCity} onChange={setFarmCity} placeholder="City" />
                  </div>
                  <InputField icon={Phone} label="Farm Phone" value={farmPhone} onChange={setFarmPhone} placeholder="Farm contact number" />
                  <InputField icon={Award} label="Specialties (comma-separated)" value={specialties} onChange={setSpecialties} placeholder="Roses, Tulips, Orchids" required={false} />
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-bloom-green text-white py-4 rounded-2xl font-bold text-xs uppercase tracking-[.3em] flex items-center justify-center gap-3 hover:bg-black transition-all shadow-xl shadow-bloom-green/20 mt-6"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-white animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="w-2 h-2 rounded-full bg-white animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-2 h-2 rounded-full bg-white animate-bounce"></div>
                  </div>
                ) : (
                  <>Create {role.charAt(0).toUpperCase() + role.slice(1)} Account <ArrowRight size={16} /></>
                )}
              </button>
            </form>
          )}

          <p className="mt-6 text-center text-[10px] text-gray-300 font-bold uppercase tracking-widest">
            {tab === 'login' ? 'Demo: customer@bloom.com / vendor@bloom.com / grower@bloom.com' : 'All fields help us personalize your experience'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
