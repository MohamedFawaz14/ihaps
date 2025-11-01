import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';

export default function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState([]);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [loading, setLoading] = useState(true);
  const SERVER_URL = import.meta.env.VITE_SERVER_URL;
  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const res = await axios.get(`${SERVER_URL}/testimonials`);
         if (Array.isArray(res.data)) {
          setTestimonials(res.data || []);
        } 
        
      } catch (err) {
        toast.error('Failed to fetch testimonials!', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTestimonials();
  }, []);

  const nextTestimonial = () => {
    if (testimonials.length) {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }
  };

  const prevTestimonial = () => {
    if (testimonials.length) {
      setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-5 h-5 ${index < rating ? 'fill-[#d4af37] text-[#d4af37]' : 'text-gray-300'}`}
      />
    ));
  };

  // Loader
  if (loading) {
    return (
      <section className="flex items-center justify-center h-screen bg-[#1e3a8a]">
        <div className="flex flex-col items-center gap-3">
          <div className="relative w-14 h-14">
            <div className="absolute inset-0 border-4 border-gray-300 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-t-[#d4af37] border-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-lg font-semibold text-white">Loading Testimonials...</p>
        </div>
      </section>
    );
  }

  const current = testimonials[currentTestimonial] || {};

  return (
    <section className="py-20 bg-[#1e3a8a] relative overflow-hidden ">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#d4af37] rounded-full transform -translate-x-48 -translate-y-48"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#d4af37] rounded-full transform translate-x-48 translate-y-48"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl mb-6 text-white">What Our Clients Say</h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Don't just take our word for it. Here's what our satisfied clients have to say about their experience with us.
          </p>
        </div>

        {/* Testimonial Carousel */}
        <div className="relative max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="p-8 md:p-12">
              {/* Quote Icon */}
              <div className="flex justify-center mb-8">
                <Quote className="w-12 h-12 text-[#d4af37]" />
              </div>

              {/* Testimonial Content */}
              <div className="text-center px-6 sm:px-8 md:px-0 max-w-full md:max-w-2xl mx-auto">
                <p className="text-xl md:text-2xl text-gray-700 leading-relaxed mb-8">
                  "{current.quote || current.content || 'No testimonial content available.'}"
                </p>

                {/* Rating */}
                <div className="flex justify-center mb-6">
                  {renderStars(current.rating || 0)}
                </div>

                {/* Client Info */}
                <div className="flex items-center justify-center space-x-4">
                  <div className="text-left">
                    <h4 className="text-lg text-[#1e3a8a]">{current.name || 'Anonymous'}</h4>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Navigation Arrows */}
          {testimonials.length > 1 && (
            <div >
              <button
              onClick={prevTestimonial}
              className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 bg-[#d4af37] hover:bg-[#b8941f] text-white p-3 rounded-full transition-colors duration-200 shadow-lg z-10"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={nextTestimonial}
              className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 bg-[#d4af37] hover:bg-[#b8941f] text-white p-3 rounded-full transition-colors duration-200 shadow-lg z-10"
            >
              <ChevronRight size={24} />
            </button>

            </div>
          )}

          {/* Dots Indicator */}
          <div className="flex justify-center mt-8 space-x-3">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentTestimonial(index)}
                className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                  index === currentTestimonial
                    ? 'bg-[#d4af37]'
                    : 'bg-white/50 hover:bg-white/70'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
