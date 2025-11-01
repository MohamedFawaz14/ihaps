import { useState, useEffect } from 'react';
import axios from 'axios';
import ServiceModal from './models/ServiceModal.jsx';
import Swal from 'sweetalert2';
import {
  Home, Scale, Search, FileText, Building, DollarSign, Phone, Users, Trash2, Edit,Briefcase,Plus
} from 'lucide-react';
import NavBar from './NavBar.jsx';

const iconMap = { Home, Scale, Search, FileText, Building, DollarSign, Phone, Users };

export default function ServicesPage() {
  const [services, setServices] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
   const SERVER_URL = import.meta.env.VITE_SERVER_URL;
  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const res = await axios.get(`${SERVER_URL}/services`);
      setServices(res.data);
    } catch (err) {
      console.error('Error fetching services:', err);
    }
  };

  const handleSave = async (service) => {
    try {
      if (editingService?.id) {
        const res = await axios.put(`${SERVER_URL}/services/${editingService.id}`, service);
        setServices(prev => prev.map(s => s.id === res.data.id ? res.data : s));
      } else {
        const res = await axios.post(`${SERVER_URL}/services`, service);
        setServices(prev => [...prev, res.data]);
      }
      setIsModalOpen(false);
      setEditingService(null);
    } catch (err) {
      console.error('Error saving service:', err);
    }
  };

  const handleDeleteService = (id, title) => {
    Swal.fire({
      title: `Are you sure you want to delete "${title}"?`,
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#00008B",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${SERVER_URL}/services/${id}`);
          setServices(prev => prev.filter(s => s.id !== id));
          Swal.fire("Deleted!", `Service "${title}" has been deleted.`, "success");
        } catch (err) {
          console.error('Error deleting service:', err);
          Swal.fire("Error!", "Failed to delete service.", "error");
        }
      }
    });
  };

  const categories = Array.from(new Set(services.map(s => s.category)));

  return (
    // ✅ Wrap in flex container (like other fixed-sidebar layouts)
    <div className="flex h-screen bg-gray-50">
      <NavBar />
      
      <main className="flex-1 overflow-y-auto p-6 ml-0 md:ml-80 mt-10">
        <div className="space-y-6">
          {/* Header Section */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-amber-500 rounded-2xl blur-2xl opacity-20"></div>
            <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-blue-100">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg">
                      <Briefcase className="w-6 h-6 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-amber-500 bg-clip-text text-transparent">
                      Our Services
                    </h1>
                  </div>
                  <p className="text-gray-600 ml-14">Manage and showcase your real estate services</p>
                </div>
                <button
                  onClick={() => { setEditingService(null); setIsModalOpen(true); }}
                  className="group relative overflow-hidden bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 font-medium"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    <Plus className="w-5 h-5" />
                    Add Service
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-amber-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
              </div>
            </div>
          </div>

          {/* Services by category */}
          {categories.map((category, categoryIndex) => {
            const categoryServices = services.filter(s => s.category === category);
            return (
              <div key={category || 'uncategorized'} className="space-y-4">
                {/* Category Header */}
                <div className="flex items-center gap-3">
                  <div className="h-1 w-12 bg-gradient-to-r from-blue-600 to-amber-500 rounded-full"></div>
                  <h2 className="text-2xl font-bold text-gray-800">{category}</h2>
                  <div className="h-1 flex-1 bg-gradient-to-r from-amber-500 to-transparent rounded-full"></div>
                </div>

                {/* Services Grid */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {categoryServices.map((service, index) => {
    const Icon = iconMap[service.iconName] || Home;
    const isGold = index % 2 === 1;
    const iconBgColor = isGold
      ? "bg-gradient-to-br from-amber-400 to-yellow-400"
      : "bg-gradient-to-br from-blue-600 to-blue-700";

    return (
      <div
        key={service.id}
        className="group relative bg-white rounded-2xl border-2 border-blue-100 hover:border-blue-300 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col"
        // ↑ Added flex flex-col
      >
        {/* Main content area — grows to fill space */}
        <div className="relative p-6 flex flex-col flex-1">
          {/* Action Buttons */}
          <div className="absolute top-4 right-4 flex gap-2  group-hover:opacity-100 transition-opacity duration-300 z-10">
            <button
              onClick={() => {
                setEditingService(service);
                setIsModalOpen(true);
              }}
              className="p-2 bg-yellow-400 hover:bg-yellow-600 text-white rounded-lg transition-colors shadow-md hover:shadow-lg"
              title="Edit"
            >
              ✏️
            </button>
            <button
              onClick={() => handleDeleteService(service.id, service.title)}
              className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors shadow-md hover:shadow-lg"
              title="Delete"
            >
              🗑️
            </button>
          </div>

          {/* Icon and Title */}
          <div className="flex items-start mt-8 gap-4 mb-4">
            <div
              className={`${iconBgColor} rounded-xl w-14 h-14 flex items-center justify-center shadow-lg flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}
            >
              <Icon className="w-7 h-7 text-white" />
            </div>
            <div className="flex-1 pt-1">
              <h3 className="text-xl font-bold text-blue-900 group-hover:text-amber-600 transition-colors duration-300 leading-tight">
                {service.title}
              </h3>
            </div>
          </div>

          {/* Description — allowed to grow */}
          <div className="pl-0 mt-auto">
            <p className="text-gray-600 leading-relaxed text-sm">
              {service.description}
            </p>
          </div>
        </div>

        {/* ✅ Decorative hover line at true bottom of card */}
        <div className="h-1 bg-gradient-to-r from-transparent via-blue-300 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
    );
  })}
</div>
              </div>
            );
          })}

          <ServiceModal
            isOpen={isModalOpen}
            onClose={() => { setIsModalOpen(false); setEditingService(null); }}
            onSave={handleSave}
            service={editingService}
          />
        </div>
      </main>
    </div>
  );
}
