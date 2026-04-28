import React from 'react';

const TopBanner = () => {
  const messages = [
    '🚚 Free All India Delivery Above ₹999',
    '🌸 100% Fresh Flowers Guaranteed',
    '💳 Secure Payments | COD Available',
    '🎁 Special Discounts on Bulk Orders'
  ];

  return (
    <div className="bg-primary text-white overflow-hidden relative" style={{ height: '36px' }}>
      <div className="flex items-center h-full whitespace-nowrap" style={{ animation: 'marquee 25s linear infinite' }}>
        {[...messages, ...messages].map((msg, i) => (
          <span key={i} className="text-[11px] tracking-wide mx-10 opacity-70 font-light">{msg}</span>
        ))}
      </div>
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
};

export default TopBanner;
