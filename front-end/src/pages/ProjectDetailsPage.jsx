import React, { useState, useEffect } from 'react'; 
import { useParams, Link } from 'react-router-dom';
import { Plus, Leaf, Car, Shield, Users, Footprints, Droplets, Store, Lightbulb, Home, Sparkles, MapPin, ArrowLeft,X , ChevronLeft, ChevronRight} from 'lucide-react';
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
  const [error, setError] = useState(null); // Change error state to hold the error message or null
  const { id } = useParams();

  const SERVER_URL = import.meta.env.VITE_SERVER_URL;

  const getAmenityIcon = (amenityName) => {
    const name = amenityName.toLowerCase();
    for (const [key, Icon] of Object.entries(amenityIcons)) {
      if (name.includes(key)) return Icon;
    }
    return amenityIcons.default;
  };

  const [lightboxOpen, setLightboxOpen] = useState(false);
const [lightboxIndex, setLightboxIndex] = useState(0);

const openLightbox = (index) => {
  setLightboxIndex(index);
  setLightboxOpen(true);
};

const closeLightbox = () => {
  setLightboxOpen(false);
};

const nextImage = () => {
  setLightboxIndex((prev) => (prev + 1) % project.images.length);
};

const prevImage = () => {
  setLightboxIndex((prev) => (prev - 1 + project.images.length) % project.images.length);
};

// Close on Escape key
useEffect(() => {
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') nextImage();
    if (e.key === 'ArrowLeft') prevImage();
  };

  if (lightboxOpen) {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }
}, [lightboxOpen]);

  const fetchProject = async () => {
    try {
      setLoading(true);
      setError(null); // Reset any previous error
      setProject(null); // Optional: Clear previous project data if re-fetching

      const res = await axios.get(`${SERVER_URL}/projects/${id}`);
      // The backend should return a 404 status if not found, which will be caught by the catch block
      setProject(res.data);
    } catch (err) {
      console.error("Error fetching project:", err);
      // Check if the error is a 404 (project not found) or another type of error
      if (err.response && err.response.status === 404) {
        setError('Project not found'); // Set a specific error message for 404
      } else {
        setError('An error occurred while fetching the project.'); // Generic error message
      }
    } finally {
      setLoading(false); // Always stop loading after the request completes or fails
    }
  };

  useEffect(() => {
    if (id) fetchProject();
  }, [id]); // Only re-fetch if the 'id' parameter changes


  // 1. Show loading state while fetching
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

  // 2. Show error state only if an actual error occurred (e.g., 404 or network issue)
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl mb-4 text-[#00217c]">{error}</h1> {/* Display the specific error message */}
          <Link to="/projects" className="text-[#d4af37] hover:underline">
            Back to Projects
          </Link>
        </div>
      </div>
    );
  }

  // 3. Show the project content only if loading is done and no error occurred
  // At this point, 'project' should be a valid object (or the error state would have been triggered)

  
  return (
    <div>
      {/* Hero Section */}
      <div className="relative aspect-[4/3] overflow-hidden bg-black">
        {/* Handle potential null mainImage */}
        {project.mainImage && (
          <img
            src={`${SERVER_URL}${project.mainImage}`}
            alt={project.name || "Project Image"}
            className="w-full h-full object-fit object-center"
            onError={(e) => {
              console.error("Main image failed to load:", e.target.src);
              e.target.style.display = 'none'; // Hide broken image
            }}
          />
        )}
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
              {/* Handle potential null/empty images array */}
              {project.images && project.images.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {project.images.map((image, index) => (
                    <div
                    key={index}
                    className="relative aspect-[4/3] rounded-lg overflow-hidden bg-black"
                    onClick={() => openLightbox(index)}
                  >
                    <img
                      src={`${SERVER_URL}${image}`}
                      alt={`${project.name} - Image ${index + 1}`}
                      className="w-full h-full object-fit object-center hover:scale-110 transition-transform duration-300"
                      onError={(e) => {
                        console.error("Gallery image failed to load:", e.target.src);
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No gallery images available.</p>
              )}
            </div>

            {/* Description */}
            <div className="mb-12">
              <h2 className="text-3xl mb-6 text-[#1e3a8a]">About This Project</h2>
              <p className="text-gray-600 text-lg leading-relaxed">{project.description}</p>
            </div>

            {/* Amenities */}
            <div className="mb-12">
              <h2 className="text-3xl mb-6 text-[#1e3a8a]">Amenities</h2>
              {/* Handle potential null/empty amenities array */}
              {project.amenities && project.amenities.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  {project.amenities.map((amenity, index) => {
                    const Icon = getAmenityIcon(amenity.name);
                    return (
                      <div key={index} className="text-center bg-white p-6 rounded-xl shadow-lg">
                        {Icon && <Icon className="w-8 h-8 text-[#d4af37] mx-auto mb-3" />}
                        <p className="text-gray-700 font-medium">{amenity.name}</p>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-gray-500">No amenities listed.</p>
              )}
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
                {/* Handle potential null specifications object */}
                {project.specifications ? (
                  <div className="space-y-2">
                    {Object.entries(project.specifications).map(([key, value]) => {
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
                ) : (
                  <p className="text-gray-500">No specifications available.</p>
                )}
              </div>
            </div>
          </div>

          {/* Display sub-image like caoursel */}
{lightboxOpen && (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 backdrop-blur-sm"
    onClick={closeLightbox}
  >
    {/* Close on click outside image */}
    <div className="relative w-full max-w-6xl h-[90vh] flex items-center">
      {/* Prev Button */}
      {project.images.length > 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            prevImage();
          }}
          className="absolute left-4 z-10 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      )}

      {/* Image */}
      <img
        src={`${SERVER_URL}${project.images[lightboxIndex]}`}
        alt={`${project.name} - Image ${lightboxIndex + 1}`}
        className="w-full h-full object-contain"
        onClick={(e) => e.stopPropagation()} // Prevent closing on image click
      />

      {/* Next Button */}
      {project.images.length > 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            nextImage();
          }}
          className="absolute right-4 z-10 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      )}

      {/* Close Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          closeLightbox();
        }}
        className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Indicator (optional) */}
      {project.images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
          {lightboxIndex + 1} / {project.images.length}
        </div>
      )}
    </div>
  </div>
)}
        </div>
      </div>
    </div>
  );
}