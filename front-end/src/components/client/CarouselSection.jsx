import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';

export default function CarouselSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [allImages, setAllImages] = useState([]);
  const [filteredImages, setFilteredImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [progress, setProgress] = useState(0);
  
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const autoSlideTimer = useRef(null);
  const progressInterval = useRef(null);
  const SERVER_URL = import.meta.env.VITE_SERVER_URL;

  // Detect device type
  useEffect(() => {
    const checkDevice = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  // Fetch images - SIMPLIFIED
  const fetchImages = async () => {
    try {
      const res = await axios.get(`${SERVER_URL}/carousel`);
      const fetchedImages = Array.isArray(res.data) ? res.data : [];
      setAllImages(fetchedImages);
    } catch (error) {
      console.error("Error fetching carousel images:", error);
      toast.error('Failed to fetch carousel images!');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  // Filter by device type - CORRECTED
  useEffect(() => {
    if (allImages.length === 0) return;
    
    const device = isMobile ? 'mobile' : 'desktop';
    
    const filtered = allImages.filter((img) => {
      // Handle both lowercase and capitalized deviceType
      const imgDeviceType = img.deviceType?.toLowerCase() || '';
      return imgDeviceType === device;
    });
    
    
    setFilteredImages(filtered);
    setCurrentSlide(0);
    setProgress(0);
  }, [allImages, isMobile]);

  // Auto-rotate with progress - WORKS ON ALL DEVICES
  useEffect(() => {
    // Clear existing timers
    if (autoSlideTimer.current) clearTimeout(autoSlideTimer.current);
    if (progressInterval.current) clearInterval(progressInterval.current);
    
    // Don't auto-slide if only one image
    if (filteredImages.length <= 1) return;
    
    const slideDuration = 5000; // 5 seconds
    
    // Progress animation
    setProgress(0);
    progressInterval.current = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          return 100;
        }
        return prev + (100 / (slideDuration / 100)); // Smooth progress
      });
    }, 100);
    
    // Auto slide timer
    autoSlideTimer.current = setTimeout(() => {
      nextSlide();
    }, slideDuration);
    
    return () => {
      if (autoSlideTimer.current) clearTimeout(autoSlideTimer.current);
      if (progressInterval.current) clearInterval(progressInterval.current);
    };
  }, [currentSlide, filteredImages]); // Removed isMobile condition

  const goToSlide = (index) => {
    setCurrentSlide(index);
    setProgress(0); // Reset progress when manually navigating
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % filteredImages.length);
    setProgress(0);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + filteredImages.length) % filteredImages.length);
    setProgress(0);
  };

  // Improved swipe handlers
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    
    // Pause auto-slide during swipe
    if (autoSlideTimer.current) clearTimeout(autoSlideTimer.current);
    if (progressInterval.current) clearInterval(progressInterval.current);
  };

  const handleTouchEnd = (e) => {
    touchEndX.current = e.changedTouches[0].clientX;
    handleSwipe();
  };

  const handleSwipe = () => {
    const minSwipeDistance = 50;
    const diff = touchStartX.current - touchEndX.current;

    if (Math.abs(diff) < minSwipeDistance) {
      // Restart auto-slide if no swipe
      if (filteredImages.length > 1) {
        const slideDuration = 5000;
        const remainingTime = ((100 - progress) / 100) * slideDuration;
        
        progressInterval.current = setInterval(() => {
          setProgress(prev => {
            if (prev >= 100) {
              nextSlide();
              return 0;
            }
            return prev + (100 / (slideDuration / 100));
          });
        }, 100);
        
        autoSlideTimer.current = setTimeout(() => {
          nextSlide();
        }, remainingTime);
      }
      return;
    }

    if (diff > 0) {
      nextSlide(); // Swiped left → next
    } else {
      prevSlide(); // Swiped right → previous
    }
  };

  // Pause on hover (desktop only)
  const handleMouseEnter = () => {
    if (autoSlideTimer.current) clearTimeout(autoSlideTimer.current);
    if (progressInterval.current) clearInterval(progressInterval.current);
  };

  const handleMouseLeave = () => {
    if (filteredImages.length > 1) {
      const slideDuration = 5000;
      const remainingTime = ((100 - progress) / 100) * slideDuration;
      
      progressInterval.current = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            nextSlide();
            return 0;
          }
          return prev + (100 / (slideDuration / 100));
        });
      }, 100);
      
      autoSlideTimer.current = setTimeout(() => {
        nextSlide();
      }, remainingTime);
    }
  };

  // Safe image URL construction
  const getImageUrl = (imagePath) => {
    if (!imagePath) return '';
    
    try {
      if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
        return imagePath;
      }
      
      // Handle both absolute and relative paths
      const base = SERVER_URL.replace(/\/$/, '');
      const path = imagePath.replace(/^\//, '');
      return `${base}/${path}`;
    } catch (error) {
      toast.error('Error constructing image URL:', error);
      return '';
    }
  };

  // Loading state
  if (loading) {
    return (
      <section className="flex items-center justify-center h-screen bg-black text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="relative w-14 h-14">
            <div className="absolute inset-0 border-4 border-gray-700 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-t-[#d4af37] border-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-lg font-semibold mt-3 text-[#d4af37] tracking-wide">
            Loading carousel...
          </p>
        </div>
      </section>
    );
  }

  // Empty state with helpful message
  if (filteredImages.length === 0) {
    return (
      <section className="flex flex-col items-center justify-center h-screen bg-black text-white p-4">
        <p className="text-xl mb-2">No carousel images available for {isMobile ? 'mobile' : 'desktop'}.</p>
        <p className="text-gray-400 text-sm mb-4">
          Expected device type: <span className="text-white font-bold">{isMobile ? 'mobile' : 'desktop'}</span>
        </p>
        
        <button 
          onClick={fetchImages}
          className="mt-4 px-4 py-2 bg-[#d4af37] text-black rounded hover:bg-yellow-600 transition-colors"
        >
          Refresh
        </button>
      </section>
    );
  }

  return (
    <section 
      className="relative h-screen"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Swipeable Image Container */}
      <div
        className="relative h-full w-full"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        style={{ touchAction: 'pan-y' }}
      >
        {filteredImages.map((img, index) => (
          <div
            key={img._id || img.id || index}
            className={`absolute inset-0 transition-opacity duration-700 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          >
            <img
              src={getImageUrl(img.image)}
              alt={img.title || 'Carousel image'}
              className="w-full h-full object-cover"
              loading={index === 0 ? "eager" : "lazy"}
              onError={(e) => {
                toast.error('Failed to load image:', img.image);
                e.target.style.opacity = '0.5';
                e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMjIyIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiNmZmYiIGZvbnQtc2l6ZT0iMTIiPkltYWdlIE5vdCBGb3VuZDwvdGV4dD48L3N2Zz4=';
              }}
            />
            
           
          </div>
        ))}
      </div>

      {/* Progress Bar */}
      {filteredImages.length > 1 && (
        <div className="absolute top-4 left-4 right-4 z-20">
          <div className="flex space-x-1">
            {filteredImages.map((_, index) => (
              <div key={index} className="flex-1 h-1 bg-gray-700/50 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-300 ${
                    index === currentSlide 
                      ? 'bg-[#d4af37]' 
                      : index < currentSlide 
                        ? 'bg-gray-400' 
                        : 'bg-transparent'
                  }`}
                  style={{
                    width: index === currentSlide ? `${progress}%` : 
                           index < currentSlide ? '100%' : '0%'
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Navigation Arrows */}
      {filteredImages.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all duration-200 focus:outline-none hover:scale-110 active:scale-95"
            aria-label="Previous slide"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all duration-200 focus:outline-none hover:scale-110 active:scale-95"
            aria-label="Next slide"
          >
            <ChevronRight size={24} />
          </button>
        </>
      )}

      {/* Dots Indicator */}
      {filteredImages.length > 1 && (
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2">
          {filteredImages.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2.5 h-2.5 md:w-3 md:h-3 rounded-full transition-all duration-200 ${
                index === currentSlide
                  ? 'bg-[#d4af37] scale-125'
                  : 'bg-white/50 hover:bg-white/80'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

    
    </section>
  );
}