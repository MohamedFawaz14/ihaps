import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

export default function CarouselSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [allImages, setAllImages] = useState([]);
  const [filteredImages, setFilteredImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
   const SERVER_URL = import.meta.env.VITE_SERVER_URL;

  // Detect mobile
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Fetch images
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await axios.get(`${SERVER_URL}/carousel`);
        setAllImages(Array.isArray(res.data) ? res.data : []);
      } catch {
        toast.error("Failed to load carousel.");
      } finally {
        setLoading(false);
      }
    };
    fetchImages();
  }, []);

  // Filter by device
  useEffect(() => {
    const device = isMobile ? "mobile" : "desktop";
    const filtered = allImages.filter(img => img.deviceType === device);
    setFilteredImages(filtered);
    setCurrentSlide(0);
  }, [allImages, isMobile]);

  // Auto slide (desktop only)
  useEffect(() => {
    if (filteredImages.length <= 1 || isMobile) return;
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % filteredImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [filteredImages, isMobile]);

  const nextSlide = () => setCurrentSlide(prev => (prev + 1) % filteredImages.length);
  const prevSlide = () => setCurrentSlide(prev => (prev - 1 + filteredImages.length) % filteredImages.length);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    touchEndX.current = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 50) diff > 0 ? nextSlide() : prevSlide();
  };

  if (loading) {
    return (
      <section className="w-full aspect-[4/5] sm:aspect-[16/9] md:aspect-[21/9] bg-black flex items-center justify-center text-white">
        Loading...
      </section>
    );
  }

  if (filteredImages.length === 0) {
    return (
      <section className="w-full aspect-[4/5] sm:aspect-[16/9] md:aspect-[21/9] bg-black flex items-center justify-center text-white">
        No images.
      </section>
    );
  }

  return (
    <section className="relative w-full aspect-[4/5] sm:aspect-[16/9] md:aspect-[21/9] bg-black overflow-hidden">
      <div
        className="w-full h-full"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        style={{ touchAction: 'pan-y' }}
      >
        {filteredImages.map((img, index) => {
          const src = img.image.startsWith('http')
            ? img.image
            : `${SERVER_URL}${img.image.startsWith('/') ? '' : '/'}${img.image}`;

          return (
            <div
              key={img.id}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
              }`}
            >
              <img
                src={src}
                alt={img.title || "Carousel image"}
                className="w-full h-full object-cover object-center"
                loading="lazy"
              />
            </div>
          );
        })}
      </div>

      {/* ✅ SHOW NAVIGATION BUTTONS ON ALL DEVICES (including mobile) */}
      {filteredImages.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 z-20 bg-black/60 hover:bg-black/80 text-white p-2.5 rounded-full transition-all focus:outline-none "
            aria-label="Previous slide"
          >
            <ChevronLeft size={20} className="sm:size-5" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 z-20 bg-black/60 hover:bg-black/80 text-white p-2.5 rounded-full transition-all focus:outline-none "
            aria-label="Next slide"
          >
            <ChevronRight size={20} className="sm:size-5" />
          </button>
        </>
      )}
    </section>
  );
}