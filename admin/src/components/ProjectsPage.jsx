import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import ProjectModal from "./models/ProjectModal.jsx";
import NavBar from "./NavBar";
import { Plus, Leaf, Car, Shield, Users, Footprints, Droplets, Store, Lightbulb, Home, Sparkles } from 'lucide-react';

// Icon mapping for amenities
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

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editProject, setEditProject] = useState(null);
   const SERVER_URL = import.meta.env.VITE_SERVER_URL;
  const getAmenityIcon = (amenityName) => {
    const name = amenityName.toLowerCase();
    for (const [key, Icon] of Object.entries(amenityIcons)) {
      if (name.includes(key)) return Icon;
    }
    return amenityIcons.default;
  };

  const fetchProjects = async () => {
    try {
      const res = await axios.get(`${SERVER_URL}/projects`);
      setProjects(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleDelete = async (id, label) => {
    Swal.fire({
      title: `Are you sure you want to delete "${label}"?`,
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#00008B",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${SERVER_URL}/projects/${id}`);
          setProjects(prev => prev.filter(p => p.id !== id));

          Swal.fire({
            title: "Deleted!",
            text: `Project "${label}" has been deleted.`,
            icon: "success",
          });
        } catch (err) {
          console.error('Error deleting project:', err);
          Swal.fire({
            title: "Error!",
            text: "Failed to delete project.",
            icon: "error",
          });
        }
      }
    });
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <NavBar />
      {/* Main Content - Scrollable */}
      <main className="flex-1 overflow-y-auto p-6 ml-0 md:ml-80 mt-10"> 
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-primary">Projects Management</h1>
            <button
              onClick={() => { setEditProject(null); setIsModalOpen(true); }}
              className="bg-accent hover:bg-accent/90 text-primary px-4 py-2 rounded-md flex items-center"
            >
              <Plus className="w-4 h-4 mr-2" /> Add Project
            </button>
          </div>

          {/* Project Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map(project => (
              <div
                key={project.id}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-100 relative"
              >
                {/* Edit/Delete buttons at top-right */}
                <div className="absolute top-3 right-3 flex gap-2 z-10">
                  <button
                    onClick={() => { setEditProject(project); setIsModalOpen(true); }}
                    className="p-2 bg-yellow-400 text-white rounded-full shadow-2xl transition border-white border-3"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDelete(project.id, project.name)}
                    className="p-2 bg-blue-950 text-white rounded-full shadow-md transition border-white border-3"
                  >
                    🗑️
                  </button>
                </div>

                {/* Main Image */}
                {project.mainImage && (
                  <div className="relative h-56 overflow-hidden group">
                    <img
                      src={project.mainImage.startsWith("http") ? project.mainImage : `${SERVER_URL}${project.mainImage}`}
                      alt="Main"
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <h2 className="text-2xl font-bold text-white mb-1 drop-shadow-lg">{project.name}</h2>
                      <p className="text-white/90 text-sm flex items-center gap-1">
                        <span>📍</span> {project.location}
                      </p>
                    </div>
                  </div>
                )}

                <div className="p-5">
                  {/* Price and Type */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full text-sm font-semibold">
                      {project.plotType}
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">Price/Sq.ft</p>
                      <p className="text-lg font-bold text-gray-900">₹{project.pricePerSquareFoot}</p>
                    </div>
                  </div>

                  {/* Gallery */}
                  {project.images?.length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm font-semibold text-gray-700 mb-2">Gallery</p>
                      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
                        {project.images.map((img, i) => (
                          <img
                            key={i}
                            src={img.startsWith("http") ? img : `${SERVER_URL}${img}`}
                            alt={`Sub ${i}`}
                            className="w-20 h-20 object-cover rounded-lg flex-shrink-0 border-2 border-gray-200 hover:border-blue-400 transition-colors cursor-pointer"
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Amenities */}
                  <div className="mb-4">
                    <p className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
                      <Sparkles className="w-4 h-4" /> Amenities
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {project.amenities?.map((a, i) => {
                        const IconComponent = getAmenityIcon(a.name);
                        return (
                          <span key={i} className="bg-gradient-to-r from-blue-50 to-indigo-50 text-gray-700 px-3 py-1.5 rounded-full text-xs flex items-center gap-1.5 border border-blue-100">
                            <IconComponent className="w-3.5 h-3.5 text-blue-600" />
                            {a.name}
                          </span>
                        );
                      })}
                    </div>
                  </div>

                  {/* Specifications */}
                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                      <span className="text-lg">📋</span> 
                      <span>Specifications</span>
                    </p>
                    <div className="bg-gray-50 rounded-lg p-4 space-y-2.5">
                      {project.specifications && Object.entries(project.specifications).map(([key, val]) => (
                        <div 
                          key={key} 
                          className="flex justify-between items-center text-sm py-2 border-b border-gray-200 last:border-b-0"
                        >
                          <span className="text-gray-600 capitalize font-medium">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </span>
                          <span className="text-gray-900 font-semibold">
                            {val}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Modal */}
          {isModalOpen && (
            <ProjectModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              onSave={() => { setIsModalOpen(false); fetchProjects(); }}
              editProject={editProject}
            />
          )}
        </div>
      </main>
    </div>
  );
}