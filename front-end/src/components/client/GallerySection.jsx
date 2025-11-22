import React, { useState, useEffect } from "react";
import axios from "axios";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import {toast} from 'sonner';
export default function GallerySection() {
  const [galleryImages, setGalleryImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

   const SERVER_URL = import.meta.env.VITE_SERVER_URL;
   const fetchGallery = async () => {
      try {
        const res = await axios.get(`${SERVER_URL}/gallery`);
        setGalleryImages(res.data || []);
      } catch (err) {
        toast.error('Failed to fetch Gallery Images!',err);
      } finally {
        setLoading(false);
      }
    };
  useEffect(() => {
    fetchGallery();
  }, []);

  const openLightbox = (image, index) => {
    setSelectedImage(image);
    setCurrentIndex(index);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  const nextImage = () => {
    const nextIndex = (currentIndex + 1) % galleryImages.length;
    setSelectedImage(galleryImages[nextIndex]);
    setCurrentIndex(nextIndex);
  };

  const prevImage = () => {
    const prevIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
    setSelectedImage(galleryImages[prevIndex]);
    setCurrentIndex(prevIndex);
  };


  if (loading) {
    return (
      <section className="flex items-center justify-center h-screen bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="relative w-14 h-14">
            <div className="absolute inset-0 border-4 border-gray-300 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-t-[#d4af37] border-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-lg font-semibold text-[#1e3a8a]">Loading Gallery...</p>
        </div>
      </section>
    );
  }


  if (!galleryImages.length) {
    return (
      <section className="flex items-center justify-center h-screen bg-gray-50">
        <p className="text-gray-700 text-lg font-medium">No images found in the gallery.</p>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl mb-4 text-[#1e3a8a]">Project Gallery</h2>
          <p className="text-xl text-gray-700">
            Explore our portfolio of completed and ongoing projects
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
       {galleryImages.map((img, index) => (
  <div
    key={img.id}
    className="relative group cursor-pointer rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
    onClick={() => openLightbox(img, index)}
  >
    <div className="w-full aspect-square bg-gray-200 flex items-center justify-center relative">
      {
        img.image && img.image.trim() !== "" ? (
          <img
            src={img.image.startsWith("http")
              ? img.image
              : `${SERVER_URL}/${img.image.replace(/^\/?/, "")}`}
            alt={img.title || "gallery"}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              e.currentTarget.parentNode.querySelector('.fallback').style.display = 'flex';
            }}
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center fallback" style={{ display: 'none' }}> 
            <span className="text-gray-500 text-sm">No Image</span>
          </div>
        )
      }
      <div className="absolute group-hover:bg-opacity-50 transition-all duration-300 flex items-end">
        <div className="p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <span className="inline-block px-2 py-1 bg-[#ffde23] text-black rounded text-xs mb-2 font-medium">
            {img.category}
          </span>
          <h3 className="font-medium">{img.title}</h3>
        </div>
      </div>
    </div>
  </div>
))}
        </div>

        {/* Lightbox */}
        {selectedImage && (
          <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
            <div className="relative max-w-4xl max-h-full">
              <img
                src={selectedImage.image.startsWith("http")
                  ? selectedImage.image
                  : `${SERVER_URL}/${selectedImage.image.replace(/^\/?/, "")}`}
                alt={selectedImage.title || "gallery"}
                className="max-w-full max-h-full object-contain"
              />

              <div className="absolute bottom-4 left-4 text-white">
                <span className="inline-block px-2 py-1 bg-yellow-600 text-black rounded text-xs mb-2 font-medium">
                  {selectedImage.category}
                </span>
                <h3 className="text-lg font-medium">{selectedImage.title}</h3>
              </div>

              <button
                onClick={closeLightbox}
                className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors duration-200"
              >
                <X className="h-8 w-8 text-white border-1 border-black rounded-full" />
              </button>

              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 transition-colors duration-200"
              >
                <ChevronLeft className="h-8 w-8 text-white border-1 border-black rounded-full" />
              </button>

              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 transition-colors duration-200"
              >
                <ChevronRight className="h-8 w-8 text-white border-1 border-black rounded-full" />
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
