import React, { useState, useEffect } from 'react'; 
import { useParams, Link } from 'react-router-dom';
import { Plus, Leaf, Car, Shield, Users, Footprints, Droplets, Store, Lightbulb, Home, Sparkles, MapPin, ArrowLeft } from 'lucide-react';
import axios from 'axios';

const amenityIcons = {
  'eco-friendly': Leaf,
  'eco': Leaf,
  'green': Leaf,
  'underground parking': Car,
  'parking': Car,
  'gated security': Shield,
  'security': Shield,
  'gated': Shield,
  'smart community': Users,
  'community center': Home,
  'community': Home,
  'center': Home,
  'walking trails': Footprints,
  'walking': Footprints,
  'trails': Footprints,
  'water features': Droplets,
  'water': Droplets,
  'fountain': Droplets,
  'retail spaces': Store,
  'retail': Store,
  'shopping': Store,
  'smart lighting': Lightbulb,
  'lighting': Lightbulb,
  'smart': Lightbulb,
  'default': Sparkles
};


export default function ProjectDetailsPage() {
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(false); 
  const { id } = useParams();

  const SERVER_URL = import.meta.env.VITE_SERVER_URL;

  const getAmenityIcon = (amenityName) => {
    const name = amenityName.toLowerCase();
    for (const [key, Icon] of Object.entries(amenityIcons)) {
      if (name.includes(key)) return Icon;
    }
    return amenityIcons.default;
  };

  const fetchProject = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${SERVER_URL}/projects/${id}`);
      setProject(res.data);
      setError(false);
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchProject();
  }, [id]);


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-300 border-t-[#d4af37] rounded-full animate-spin mx-auto mb-4"></div>
          <h1 className="text-xl text-[#00217c]">Loading project...</h1>
        </div>
      </div>
    );
  }


  if (error || !project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl mb-4 text-[#00217c]">Project Not Found</h1>
          <Link to="/projects" className="text-[#d4af37] hover:underline">
            Back to Projects
          </Link>
        </div>
      </div>
    );
  }


 <div>
      {/* Hero Section */}
      <div className="relative h-96 overflow-hidden">
        <img
          src={`${SERVER_URL}${project.mainImage}`}
          alt={project.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <Link 
              to="/projects" 
              className="inline-flex items-center text-white mb-4 hover:text-[#d4af37] transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Projects
            </Link>
            <h1 className="text-5xl md:text-6xl text-white mb-4">{project.name}</h1>
            <div className="flex items-center text-white text-xl">
              <MapPin className="w-6 h-6 mr-2 text-[#d4af37]" />
              {project.location}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Project Gallery */}
            <div className="mb-12">
              <h2 className="text-3xl mb-6 text-[#1e3a8a]">Project Gallery</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {project.images?.map((image, index) => (
                  <div key={index} className="relative h-48 rounded-lg overflow-hidden">
                    <img
                      src={`${SERVER_URL}${image}`}
                      alt={`${project.name} - Image ${index + 1}`}
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="mb-12">
              <h2 className="text-3xl mb-6 text-[#1e3a8a]">About This Project</h2>
              <p className="text-gray-600 text-lg leading-relaxed">{project.description}</p>
            </div>

            {/* Amenities */}
            <div className="mb-12">
              <h2 className="text-3xl mb-6 text-[#1e3a8a]">Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {project.amenities?.map((amenity, index) => {
                  const Icon = getAmenityIcon(amenity.name);
                  return (
                    <div key={index} className="text-center bg-white p-6 rounded-xl shadow-lg">
                      {Icon && <Icon className="w-8 h-8 text-[#d4af37] mx-auto mb-3" />}
                      <p className="text-gray-700 font-medium">{amenity.name}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8 sticky top-24">
              <div className="text-center mb-6">
                <h3 className="text-2xl mb-2 text-[#1e3a8a]">{project.name}</h3>
              </div>

              {/* Specifications */}
              <div className="mb-6">
                <h4 className="font-semibold text-[#1e3a8a] mb-3">Specifications</h4>
                <div className="space-y-2">
                  {Object.entries(project.specifications || {}).map(([key, value]) => {
                    if (key === "id") return null;
                    const formatKey = (str) =>
                      str.replace(/([A-Z])/g, " $1").replace(/^./, char => char.toUpperCase()).trim();
                    return (
                      <div key={key} className="flex justify-between">
                        <span className="text-gray-600">{formatKey(key)}:</span>
                        <span className="text-gray-800 font-medium">{value}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
}
