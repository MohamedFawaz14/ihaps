import { useState, useEffect } from 'react';
import axios from 'axios';
import TestimonialModal from './models/TestimonialModal.jsx';
import { User, Plus, Star, Trash2, Edit ,MessageSquare} from 'lucide-react';
import Swal from 'sweetalert2';
import NavBar from './NavBar.jsx';

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState(null);
   const SERVER_URL = import.meta.env.VITE_SERVER_URL;
  // Fetch testimonials from backend
  const fetchTestimonials = async () => {
      try {
        const res = await axios.get(`${SERVER_URL}/testimonials`);
        setTestimonials(res.data);
      } catch (err) {
        console.error('Error fetching testimonials:', err);
      }
    };
    
  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handleSave = async (testimonial) => {
    try {
      if (testimonial.id) {
        // Update existing testimonial
        const res = await axios.put(`${SERVER_URL}/testimonials/${testimonial.id}`, testimonial);
        setTestimonials(prev =>
          prev.map(t => (t.id === res.data.id ? res.data : t))
        );
      } else {
        // Add new testimonial
        const res = await axios.post(`${SERVER_URL}/testimonials`, testimonial);
        setTestimonials(prev => [res.data, ...prev]);
      }
      setIsModalOpen(false);
      setEditingTestimonial(null);
    } catch (err) {
      console.error('Error saving testimonial:', err);
    }
  };

  const handleDelete = async (id, name) => {
    Swal.fire({
      title: `Are you sure you want to delete "${name}"?`,
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#00008B",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${SERVER_URL}/testimonials/${id}`);
          setTestimonials(prev => prev.filter(t => t.id !== id));
          Swal.fire({
            title: "Deleted!",
            text: `Testimonial "${name}" has been deleted.`,
            icon: "success",
          });
        } catch (err) {
          console.error('Error deleting testimonial:', err);
          Swal.fire({
            title: "Error!",
            text: "Failed to delete testimonial.",
            icon: "error",
          });
        }
      }
    });
  };

  return (
    
    <div className="flex h-screen">
      <NavBar />
 
      <main className="flex-1 overflow-y-auto p-6 ml-0 md:ml-80 mt-10">
        <div className="space-y-6">
          {/* Header */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-amber-500 rounded-2xl blur-2xl opacity-20"></div>
            <div className="relative  backdrop-blur-sm rounded-2xl p-8 shadow-xl border">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg">
                      <MessageSquare className="w-6 h-6 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-amber-500 bg-clip-text text-transparent">
                      Client Testimonials
                    </h1>
                  </div>
                  <p className="text-gray-600 ml-14">Manage and showcase customer feedback</p>
                </div>
                <button
                  onClick={() => { setEditingTestimonial(null); setIsModalOpen(true); }}
                  className="group relative overflow-hidden bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 font-medium"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    <Plus className="w-5 h-5" />
                    Add Testimonial
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-amber-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
              </div>
            </div>
          </div>

          {/* Testimonials Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {testimonials.map((t, index) => (
              <div 
                key={t.id} 
                className="group relative bg-white rounded-2xl border-2 border-blue-100 hover:border-blue-300 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Gradient Background Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-amber-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                
                
                <div className="relative p-6">
                  {/* Header with Avatar and Actions */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-amber-100 rounded-full flex items-center justify-center shadow-md border-2 border-blue-200">
                          <User className="w-7 h-7 text-blue-600" />
                        </div>
                      <div>
                        <h4 className="text-lg font-semibold text-gray-800">{t.name}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          {/* Star Rating */}
                          <div className="flex">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < t.rating 
                                    ? 'fill-amber-400 text-amber-400' 
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                        
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 mb-7">
                      <button
                        onClick={() => { setEditingTestimonial(t); setIsModalOpen(true); }}
                        className="p-2 bg-yellow-400 hover:bg-yellow-600 text-white rounded-lg transition-colors shadow-md hover:shadow-lg"
                        title="Edit"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDelete(t.id, t.name)}
                        className="p-2 bg-blue-500 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-md hover:shadow-lg"
                        title="Delete"
                      >
                       🗑️
                      </button>
                    </div>
                  </div>

                  {/* Quote */}
                  <blockquote className="relative mb-4 pl-4 border-l-4 border-blue-300">
                    <p className="text-gray-700 italic leading-relaxed">
                      "{t.quote}"
                    </p>
                  </blockquote>

                  {/* Footer Info */}
                  <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                      <span className="text-sm text-gray-600 font-medium">{t.property}</span>
                    </div>
                    <span className="text-sm text-gray-500">{new Date(t.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>

                  {/* Bottom Decorative Line */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-300 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              </div>
            ))}
          </div>

             {/* Empty State */}
          {testimonials.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border-2 border-dashed border-blue-200">
              <div className="p-4 bg-blue-50 rounded-full mb-4">
                <MessageSquare className="w-12 h-12 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No Testimonials Yet</h3>
              <p className="text-gray-500 mb-6">Start collecting customer feedback</p>
              <button
                onClick={() => { setEditingTestimonial(null); setIsModalOpen(true); }}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl font-medium"
              >
                Add Your First Testimonial
              </button>
            </div>
          )}
        
          <TestimonialModal
            isOpen={isModalOpen}
            onClose={() => { setIsModalOpen(false); setEditingTestimonial(null); }}
            onSave={handleSave}
            testimonial={editingTestimonial}
          />
        </div>
     </main>
   </div>
  );
}