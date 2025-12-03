import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';

export default function CarouselSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [allImages, setAllImages] = useState([]);
  const [filteredImages, setFilteredImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deviceType, setDeviceType] = useState('desktop');

  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const autoSlideTimer = useRef(null);
  const progressInterval = useRef(null);
  const SERVER_URL = import.meta.env.VITE_SERVER_URL;

  useEffect(() => {
    const updateDeviceType = () => {
      const width = window.innerWidth;
      if (width < 1024) {
        setDeviceType('mobile');
      } else {
        setDeviceType('desktop');
      }
    };

    updateDeviceType();
    window.addEventListener('resize', updateDeviceType);
    return () => window.removeEventListener('resize', updateDeviceType);
  }, []);

  const fetchImages = async () => {
    try {
      const res = await axios.get(`${SERVER_URL}/carousel`);
      const fetchedImages = Array.isArray(res.data) ? res.data : [];
      setAllImages(fetchedImages);
    } catch (error) {
      toast.error('Failed to fetch carousel images!');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  useEffect(() => {
    if (allImages.length === 0) return;

    const effectiveDevice = deviceType === 'desktop' ? 'desktop' : 'mobile';
    const filtered = allImages.filter(img => 
      (img.deviceType || '').toLowerCase().trim() === effectiveDevice
    );

    setFilteredImages(filtered);
    setCurrentSlide(0);
    setProgress(0);
  }, [allImages, deviceType]);

  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (autoSlideTimer.current) clearTimeout(autoSlideTimer.current);
    if (progressInterval.current) clearInterval(progressInterval.current);
    
    if (filteredImages.length <= 1) return;
    
    const slideDuration = 5000;
    const steps = 100;
    setProgress(0);
    
    progressInterval.current = setInterval(() => {
      setProgress(prev => Math.min(prev + 100 / steps, 100));
    }, slideDuration / steps);
    
    autoSlideTimer.current = setTimeout(() => {
      nextSlide();
    }, slideDuration);
    
    return () => {
      if (autoSlideTimer.current) clearTimeout(autoSlideTimer.current);
      if (progressInterval.current) clearInterval(progressInterval.current);
    };
  }, [currentSlide, filteredImages]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
    setProgress(0);
  };

  const nextSlide = () => {
    setCurrentSlide(prev => (prev + 1) % filteredImages.length);
    setProgress(0);
  };

  const prevSlide = () => {
    setCurrentSlide(prev => (prev - 1 + filteredImages.length) % filteredImages.length);
    setProgress(0);
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    if (autoSlideTimer.current) clearTimeout(autoSlideTimer.current);
    if (progressInterval.current) clearInterval(progressInterval.current);
  };

  const handleTouchEnd = (e) => {
    touchEndX.current = e.changedTouches[0].clientX;
    handleSwipe();
  };

  const handleSwipe = () => {
    const minSwipe = 50;
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) < minSwipe) {
      restartAutoSlide();
      return;
    }
    if (diff > 0) nextSlide();
    else prevSlide();
  };

  const restartAutoSlide = () => {
    if (filteredImages.length <= 1) return;
    const slideDuration = 5000;
    const remaining = ((100 - progress) / 100) * slideDuration;
    if (progressInterval.current) clearInterval(progressInterval.current);
    if (autoSlideTimer.current) clearTimeout(autoSlideTimer.current);
    
    setProgress(0);
    progressInterval.current = setInterval(() => {
      setProgress(prev => {
        const newP = prev + 1;
        if (newP >= 100) {
          nextSlide();
          return 0;
        }
        return newP;
      });
    }, 50);
    
    autoSlideTimer.current = setTimeout(nextSlide, remaining);
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return '';
    if (imagePath.startsWith('http')) return imagePath;
    return `${SERVER_URL.replace(/\/$/, '')}/${imagePath.replace(/^\//, '')}`;
  };

  const isDesktop = deviceType === 'desktop';

  if (loading) {
    return (
      <div className="w-full h-screen md:h-[600px] lg:h-[650px] xl:h-[700px]">
        <div className="flex items-center justify-center h-full bg-black text-white">
          <div className="flex flex-col items-center gap-3">
            <div className="relative w-14 h-14">
              <div className="absolute inset-0 border-4 border-gray-700 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-t-[#d4af37] border-transparent rounded-full animate-spin"></div>
            </div>
            <p className="text-lg font-semibold text-[#d4af37]">Loading carousel...</p>
          </div>
        </div>
      </div>
    );
  }

  if (filteredImages.length === 0) {
    return (
      <div className="w-full h-screen md:h-[600px] lg:h-[650px] xl:h-[700px]">
        <div className="flex flex-col items-center justify-center h-full bg-black text-white p-4">
          <p className="text-xl mb-2">No carousel images available.</p>
          <p className="text-gray-400 text-sm mb-4">Screen: {window.innerWidth}px</p>
          <button 
            onClick={fetchImages}
            className="px-4 py-2 bg-[#d4af37] text-black rounded hover:bg-yellow-600 transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative w-full ${
  deviceType === 'mobile' ? 'h-[70vh]' : 'h-screen md:h-[600px] lg:h-[650px] xl:h-[700px]'
}`}>
      {/* Progress indicators */}
      {filteredImages.length > 1 && (
        <div className="absolute bottom-2 sm:bottom-3 left-2 right-2 sm:left-4 sm:right-4 z-20">
          <div className="flex space-x-1">
            {filteredImages.map((_, index) => (
              <div 
                key={index} 
                className="flex-1 h-1 bg-gray-700/50 rounded-full overflow-hidden cursor-pointer"
                onClick={() => goToSlide(index)}
              >
                <div className="relative h-full">
                  <div className={`absolute inset-0 bg-white transition-all duration-300 ${index < currentSlide ? 'w-full' : 'w-0'}`} />
                  <div 
                    className={`absolute inset-0 bg-[#d4af37] ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
                    style={{ 
                      width: index === currentSlide ? `${progress}%` : '0%',
                      transition: 'width 50ms linear'
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Image Container */}
      <div
        className="relative w-full h-full overflow-hidden bg-black"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        style={{ touchAction: 'pan-y' }}
      >
        {filteredImages.map((img, index) => (
          <div
            key={img._id || img.id || index}
            className={`absolute inset-0 transition-opacity duration-500 ${
              index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            <img
            src={getImageUrl(img.image)}
            alt={img.title || 'Carousel image'}
            className="w-full h-full"
            style={{
              objectFit: 'fill',     // ← Show full image without cropping
              objectPosition: 'center', // Center it
              backgroundColor: 'black', // Optional: match your bg so bars blend
            }}
            loading={index === 0 ? "eager" : "lazy"}
            decoding="async"
          />
          </div>
        ))}
      </div>

      {/* Navigation Buttons */}
      {filteredImages.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-1 sm:left-2 md:left-4 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-black/70 text-white p-1.5 sm:p-2 md:p-3 rounded-full transition-all duration-200 focus:outline-none hover:scale-110 active:scale-95"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-1 sm:right-2 md:right-4 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-black/70 text-white p-1.5 sm:p-2 md:p-3 rounded-full transition-all duration-200 focus:outline-none hover:scale-110 active:scale-95"
            aria-label="Next slide"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
          </button>
        </>
      )}
    </div>
  );
}