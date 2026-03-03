import React, { useState, useEffect } from 'react';
import BannerImage from '../../assets/banner.jpg';

const Banner = () => {
  // countdown timer state (expiry 48h from now for demo)
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    // target date 48 hours from component mount
    const target = new Date();
    target.setHours(target.getHours() + 48);

    const update = () => {
      const now = new Date();
      const diff = target - now;
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);
      setTimeLeft({ days, hours, minutes, seconds });
    };
    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section 
      className='relative w-full min-h-[40vh] md:min-h-[50vh] lg:h-[60vh] bg-cover bg-center flex items-center bg-top mt-[70px] sm:mt-[80px] lg:mt-[90px]'
      style={{backgroundImage: `url(${BannerImage})`}}
    >
      {/* Optional overlay for better text readability */}
      <div className='absolute inset-0 bg-black/20'></div>
      
      <div className='relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 w-full'>
        <div className='flex flex-col items-start justify-center space-y-4 sm:space-y-5 lg:space-y-6 '>
          <h1 className='text-red-600 text-3xl sm:text-4xl md:text-5xl lg:text-6xl uppercase font-bold tracking-tight leading-tight'>
            Big Sale!
          </h1>
          
          <h2 className='text-zinc-800 text-xl sm:text-2xl md:text-3xl font-medium'>
            Up to 50% Off - Limited Time Only!
          </h2>
          
          <div className='flex flex-wrap gap-2 sm:gap-3 mt-2 sm:mt-4'>
            <div className='bg-zinc-900 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-md'>
              <span className='text-xl sm:text-2xl md:text-3xl font-bold'>
                {timeLeft.days}d
              </span>
            </div>
            <div className='bg-zinc-900 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-md'>
              <span className='text-xl sm:text-2xl md:text-3xl font-bold'>
                {timeLeft.hours}h
              </span>
            </div>
            <div className='bg-zinc-900 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-md'>
              <span className='text-xl sm:text-2xl md:text-3xl font-bold'>
                {timeLeft.minutes}m
              </span>
            </div>
            <div className='bg-zinc-900 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-md'>
              <span className='text-xl sm:text-2xl md:text-3xl font-bold'>
                {timeLeft.seconds}s
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Banner;