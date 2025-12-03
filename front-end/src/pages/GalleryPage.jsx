import React from 'react';
import GallerySection  from '../components/client/GallerySection.jsx';

export default function GalleryPage() {
  return (
    <div className="">
      <div className="bg-gradient-to-br from-[#fcc100] to-[#ffde23] text-black py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-6xl  text-[#00217c] font-bold">Gallery</h1>
         
        </div>
      </div>
      <GallerySection />
    </div>
  );
}