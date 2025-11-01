import React, { useState, useEffect } from 'react';
import { Home, Search, DollarSign, FileText, Users, Award } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';

const iconMap = { Home, Search, DollarSign, FileText, Users, Award };

export default function ServicesSection() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
   const SERVER_URL = import.meta.env.VITE_SERVER_URL;
  const fetchServices = async () => {
    try {
      const res = await axios.get(`${SERVER_URL}/services`);
      setServices(res.data || []);
    } catch (err) {
      toast.error('Failed to fetch services!', err);
      setServices([]); 
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  if (loading) {
    return (
      <section className="flex items-center justify-center h-screen bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="relative w-14 h-14">
            <div className="absolute inset-0 border-4 border-gray-300 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-t-[#d4af37] border-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-lg font-semibold text-[#1e3a8a]">Loading Services...</p>
        </div>
      </section>
    );
  }

  
  const displayServices = Array.isArray(services) && services.length
  ? services
  : Array.from({ length: 6 }, () => ({
      title: 'Not Available',
      description: 'Service information will be updated soon.',
      iconName: 'FileText',
    }));



  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl mb-6 text-[#1e3a8a]">
            Our Services
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We provide comprehensive real estate services designed to meet all your property needs with excellence and professionalism.
          </p>
        </div>

        {/* Services Grid */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
  {displayServices.map((service, index) => {
    const IconComponent = iconMap[service.iconName] || FileText;
    const colorClass = index % 2 === 0 ? 'bg-[#d4af37]' : 'bg-[#1e3a8a]';

    return (
      <div
        key={index}
        className="group bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden flex flex-col"
        // ↑ Added flex flex-col
      >
        {/* Flex body that expands */}
        <div className="p-8 flex flex-col flex-1">
          <div className={`inline-flex items-center justify-center w-16 h-16 rounded-lg ${colorClass} mb-6 group-hover:scale-110 transition-transform duration-300`}>
            <IconComponent className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl mb-4 text-[#1e3a8a] group-hover:text-[#d4af37] transition-colors duration-300">
            {service.title}
          </h3>
          <p className="text-gray-600 leading-relaxed flex-1">
            {service.description}
          </p>
        </div>

        {/* Hover underline — now always at bottom */}
        <div className={`h-1 ${colorClass} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`}></div>
      </div>
    );
  })}
</div>
      </div>
    </section>
  );
}
