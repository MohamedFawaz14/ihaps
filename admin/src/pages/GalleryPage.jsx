import React from 'react';
import GallerySection  from '../components/client/GallerySection.jsx';

export default function GalleryPage() {
  return (
    <div className="">
      <div className="bg-gradient-to-br from-[#fcc100] to-[#ffde23] text-black py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-6xl mb-6 text-[#00217c] font-bold">Gallery</h1>
          <p className="text-xl md:text-2xl opacity-90 max-w-3xl text-[#001d6d]">
            View our portfolio of completed projects and construction progress.
          </p>
        </div>
      </div>
      <GallerySection />
    </div>
  );
}