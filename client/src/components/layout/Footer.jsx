import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Twitter, Mail, MapPin, Phone } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-primary text-white pb-24 lg:pb-0">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 xl:px-20 pt-16 sm:pt-20 pb-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 sm:gap-12 mb-14">
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="font-serif text-2xl font-bold inline-block">
              Bloom<span className="text-accent">Supply</span>
            </Link>
            <p className="text-sm text-white/40 mt-4 leading-relaxed max-w-xs">
              Premium flowers delivered fresh to your doorstep. Bringing nature's beauty to every occasion.
            </p>
            <div className="flex gap-3 mt-6">
              {[Instagram, Facebook, Twitter].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 rounded-full bg-white/8 flex items-center justify-center hover:bg-accent transition-colors">
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-5 text-accent tracking-wide">Quick Links</h4>
            <div className="flex flex-col gap-3.5">
              {[
                { to: '/shop', label: 'Shop All' },
                { to: '/categories', label: 'Categories' },
                { to: '/about', label: 'About Us' },
                { to: '/contact', label: 'Contact' }
              ].map(link => (
                <Link key={link.to} to={link.to} className="text-sm text-white/40 hover:text-accent transition-colors">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-5 text-accent tracking-wide">Help</h4>
            <div className="flex flex-col gap-3.5">
              {[
                { to: '/account/orders', label: 'Track Order' },
                { to: '/refund', label: 'Returns & Refunds' },
                { to: '/privacy', label: 'Privacy Policy' },
                { to: '/refund', label: 'Terms & Conditions' }
              ].map((link, i) => (
                <Link key={i} to={link.to} className="text-sm text-white/40 hover:text-accent transition-colors">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-5 text-accent tracking-wide">Contact</h4>
            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-3 text-sm text-white/40">
                <MapPin size={16} className="mt-0.5 shrink-0" />
                <span>Mumbai, Maharashtra, India</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-white/40">
                <Phone size={16} className="shrink-0" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-white/40">
                <Mail size={16} className="shrink-0" />
                <span>hello@bloomsupply.com</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/8 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-white/25">
            &copy; {new Date().getFullYear()} BloomSupply. All rights reserved.
          </p>
          <div className="flex gap-6 text-xs text-white/25">
            <Link to="/privacy" className="hover:text-accent transition-colors">Privacy</Link>
            <Link to="/refund" className="hover:text-accent transition-colors">Refund</Link>
            <Link to="/contact" className="hover:text-accent transition-colors">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
