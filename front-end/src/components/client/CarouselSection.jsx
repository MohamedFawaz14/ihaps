import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

export default function CarouselSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [allImages, setAllImages] = useState([]);
  const [filteredImages, setFilteredImages] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const progressAnimationRef = useRef(null);
  const startTimeRef = useRef(0);
  const animationDuration = 5000; // 5 seconds per slide
  
  const SERVER_URL = import.meta.env.VITE_SERVER_URL;

  const fetchImages = async () => {
    try {
      const res = await axios.get(`${SERVER_URL}/carousel`);
      const images = Array.isArray(res.data) ? res.data : [];
      setAllImages(images);
    } catch {
      toast.error("Failed to load carousel.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  // Filter images - show all images on all devices
  useEffect(() => {
    setFilteredImages(allImages);
    setCurrentSlide(0);
  }, [allImages]);

  // Handle auto-slide with smooth progress animation
  useEffect(() => {
    // Don't auto-slide if only one image
    if (filteredImages.length <= 1) {
      stopProgressAnimation();
      return;
    }

    // Start progress animation
    startProgressAnimation();

    return () => {
      stopProgressAnimation();
    };
  }, [currentSlide, filteredImages]);

  // Smooth animation using requestAnimationFrame
  const startProgressAnimation = () => {
    // Cancel any existing animation
    if (progressAnimationRef.current) {
      cancelAnimationFrame(progressAnimationRef.current);
    }

    startTimeRef.current = performance.now();

    const animate = (currentTime) => {
      const elapsed = currentTime - startTimeRef.current;
      const progress = Math.min((elapsed / animationDuration) * 100, 100);

      // Update visual progress indicator
      const activeIndicator = document.querySelector(`.progress-indicator-${currentSlide}`);
      if (activeIndicator) {
        activeIndicator.style.width = `${progress}%`;
      }

      // Check if animation is complete
      if (elapsed >= animationDuration) {
        // Move to next slide
        setCurrentSlide(prev => (prev + 1) % filteredImages.length);
      } else {
        // Continue animation
        progressAnimationRef.current = requestAnimationFrame(animate);
      }
    };

    progressAnimationRef.current = requestAnimationFrame(animate);
  };

  const stopProgressAnimation = () => {
    if (progressAnimationRef.current) {
      cancelAnimationFrame(progressAnimationRef.current);
      progressAnimationRef.current = null;
    }
  };

  const nextSlide = () => {
    setCurrentSlide(prev => (prev + 1) % filteredImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide(prev => (prev - 1 + filteredImages.length) % filteredImages.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    touchEndX.current = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX.current;
    
    // Swipe threshold
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
  };

  if (loading) {
    return (
      <section className="w-full aspect-4/5 md:aspect-[21/9] bg-black flex items-center justify-center text-white">
        <div className="animate-pulse">Loading carousel...</div>
      </section>
    );
  }

  if (filteredImages.length === 0) {
    return (
      <section className="w-full aspect-4/5 md:aspect-[21/9] bg-black flex items-center justify-center text-white">
        No images available.
      </section>
    );
  }

  return (
    <section 
      className="relative w-full aspect-4/5 md:aspect-[21/9] bg-black overflow-hidden"
    >
      {/* Main Carousel Container */}
      <div
        className="w-full h-full relative"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        style={{ touchAction: 'pan-y' }}
      >
        {filteredImages.map((img, index) => {
          let src = '#';
          try {
            src = img.image?.startsWith('http')
              ? img.image
              : `${SERVER_URL}${img.image?.startsWith('/') ? '' : '/'}${img.image || ''}`;
          } catch (error) {
            console.warn('Invalid image URL:', img.image);
          }

          return (
            <div
              key={img.id || index}
              className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
                index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              <img
                src={src}
                alt={img.title || `Carousel image ${index + 1}`}
                className="w-full h-full object-cover object-center"
                loading="lazy"
                decoding="async"
                onError={(e) => {
                  e.target.style.opacity = '0';
                  console.error('Failed to load image:', src);
                }}
              />
            </div>
          );
        })}
      </div>

      {/* Progress Indicators */}
      {filteredImages.length > 1 && (
        <div className="absolute bottom-3 sm:bottom-4 left-1/2 transform -translate-x-1/2 z-20 w-11/12 max-w-xl px-4">
          <div className="flex space-x-1.5 sm:space-x-2">
            {filteredImages.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className="flex-1 h-1 sm:h-1.5 bg-gray-600/40 rounded-full overflow-hidden cursor-pointer transition-all hover:bg-gray-500/60 active:scale-95"
                aria-label={`Go to slide ${index + 1}`}
              >
                <div className="relative h-full w-full">
                  {/* Completed progress for past slides */}
                  <div 
                    className={`absolute inset-0 bg-white transition-all duration-300 ${
                      index < currentSlide ? 'w-full' : 'w-0'
                    }`} 
                  />
                  
                  {/* Current slide progress animation */}
                  <div 
                    className={`progress-indicator-${index} absolute inset-0 bg-white ${
                      index === currentSlide ? 'opacity-100' : 'opacity-0'
                    }`}
                    style={{ width: '0%', transition: 'none' }}
                  />
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      {filteredImages.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-2 sm:left-3 md:left-4 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-black/70 text-white p-2 sm:p-2.5 md:p-3 rounded-full transition-all focus:outline-none hover:scale-105 active:scale-95 backdrop-blur-sm"
            aria-label="Previous slide"
          >
            <ChevronLeft size={16} className="sm:size-5 md:size-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-2 sm:right-3 md:right-4 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-black/70 text-white p-2 sm:p-2.5 md:p-3 rounded-full transition-all focus:outline-none hover:scale-105 active:scale-95 backdrop-blur-sm"
            aria-label="Next slide"
          >
            <ChevronRight size={16} className="sm:size-5 md:size-6" />
          </button>
        </>
      )}
    </section>
  );
}