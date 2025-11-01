import React from 'react';
import  OriginSection  from '../components/client/OriginSection';
import AchievementsSection  from '../components/client/AchievementsSection';

export default function AboutPage() {
  return (
    <div className="">
      <div className="bg-gradient-to-br from-[#fcc100] to-[#ffde23] text-black py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-6xl mb-6 font-bold text-[#00217c]">About Us</h1>
          <p className="text-xl md:text-2xl opacity-90 max-w-3xl text-[#001d6d]">
            Learn about our journey, mission, and commitment to creating exceptional housing communities.
          </p>
        </div>
      </div>
      <OriginSection />
      <AchievementsSection />
    </div>
  );
}