
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Plus, Leaf, Car, Shield, Users, Footprints, Droplets, Store, Lightbulb, Home, Sparkles ,X} from 'lucide-react';
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

export default function ProjectModal({ isOpen, onClose, onSave, editProject }) {
  const [deletedImages, setDeletedImages] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    plotType: "",
    pricePerSquareFoot: "",
    status: "On-Going",
    description: "",
    mainImageFile: null,
    imagesFiles: [],
    mainImagePreview: "",
    imagesPreview: [],
    amenities: [
      { icon: "TreePine", name: "Eco-Friendly Design", selected: false },
      { icon: "Car", name: "Underground Parking", selected: false },
      { icon: "Shield", name: "Gated Security", selected: false },
      { icon: "Wifi", name: "Smart Community", selected: false },
      { icon: "Home", name: "Community Center", selected: false },
      { icon: "Ruler", name: "Walking Trails", selected: false },
      { icon: "Droplet", name: "Water Features", selected: false },
      { icon: "ShoppingCart", name: "Retail Spaces", selected: false },
      { icon: "Lightbulb", name: "Smart Lighting", selected: false }
    ],
    specifications: {
      TotalArea: "",
      PlotSizes: "",
      RoadWidth: "",
      WaterSupply: "",
      Electricity: "",
      Approval: ""
    }
  });
   const SERVER_URL = import.meta.env.VITE_SERVER_URL;
   const getAmenityIcon = (amenityName) => {
    const name = amenityName.toLowerCase();
    for (const [key, Icon] of Object.entries(amenityIcons)) {
      if (name.includes(key)) return Icon;
    }
    return amenityIcons.default;
  };

  useEffect(() => {
    if (editProject) {
      setFormData(prev => ({
        ...prev,
        ...editProject,
        mainImageFile: null,
        imagesFiles: [],
        mainImagePreview: editProject.mainImage,
        imagesPreview: editProject.images || [],
        amenities: prev.amenities.map(a => ({
          ...a,
          selected: editProject.amenities?.some(ea => ea.name === a.name)
        }))
      }));
    }
  }, [editProject]);

  useEffect(() => {
  return () => {
    formData.imagesPreview.forEach(url => URL.revokeObjectURL(url));
    if (formData.mainImagePreview && formData.mainImagePreview.startsWith("blob:")) {
      URL.revokeObjectURL(formData.mainImagePreview);
    }
  };
}, []);


  const handleSubmit = async (e) => {
  e.preventDefault();

  const data = new FormData();
  data.append("name", formData.name);
  data.append("location", formData.location);
  data.append("plotType", formData.plotType);
  data.append("pricePerSquareFoot", formData.pricePerSquareFoot);
  data.append("status", formData.status);
  data.append("description", formData.description);
  data.append("amenities", JSON.stringify(formData.amenities.filter(a => a.selected)));
  data.append("specifications", JSON.stringify(formData.specifications));

  // Main image
  if (formData.mainImageFile) data.append("mainImage", formData.mainImageFile);

  // Sub images - only new files
  formData.imagesFiles.forEach(f => data.append("images", f));

  // Include previous images that were not deleted
  const oldImages = formData.imagesPreview.filter(url => !formData.imagesFiles.includes(url) && !deletedImages.includes(url));
  data.append("existingImages", JSON.stringify(oldImages));

  // Deleted images
  if (deletedImages.length > 0) {
    data.append("deletedImages", JSON.stringify(deletedImages));
  }

  try {
    if (editProject) {
      await axios.put(`${SERVER_URL}/projects/${editProject.id}`, data, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      toast.success("Project updated!");
    } else {
      await axios.post(`${SERVER_URL}/projects`, data, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      toast.success("Project added!");
    }
    onSave();
  } catch (err) {
    console.error(err);
    toast.error("Failed to save project");
  }
};


const handleDeleteSubImage = (index) => {
  const toDelete = formData.imagesPreview[index];
  setDeletedImages(prev => [...prev, toDelete]);

  setFormData(prev => {
    const newImagesFiles = prev.imagesFiles.filter((_, i) => i !== index);
    const newImagesPreview = prev.imagesPreview.filter((_, i) => i !== index);

    if (toDelete.startsWith("blob:")) URL.revokeObjectURL(toDelete);

    return { ...prev, imagesFiles: newImagesFiles, imagesPreview: newImagesPreview };
  });
};



const handleDeleteMainImage = () => {
  if (formData.mainImagePreview.startsWith("/uploads")) {
    setDeletedImages(prev => [...prev, formData.mainImagePreview]);
  }
  setFormData(prev => ({ ...prev, mainImageFile: null, mainImagePreview: "" }));
};


const handleMainImageChange = (e) => {
  const file = e.target.files[0];
  if (formData.mainImagePreview && formData.mainImagePreview.startsWith("/uploads")) {
    setDeletedImages(prev => [...prev, formData.mainImagePreview]);
  }
  setFormData(prev => ({ ...prev, mainImageFile: file, mainImagePreview: URL.createObjectURL(file) }));
};


  const handleImagesChange = (e) => {
  const files = Array.from(e.target.files);

  setFormData(prev => {
    const newFiles = [...prev.imagesFiles, ...files];
    const newPreviews = [
      ...prev.imagesPreview,
      ...files.map(f => URL.createObjectURL(f))
    ];

    return {
      ...prev,
      imagesFiles: newFiles,
      imagesPreview: newPreviews
    };
  });
};

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50" onClick={onClose} />
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-3xl bg-white rounded-lg shadow-xl overflow-y-auto max-h-[90vh] p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{editProject ? "Edit Project" : "Add Project"}</h2>
          <button onClick={onClose}><X className="w-5 h-5" /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {["name","location","plotType"].map(field => (
            <div key={field}>
              <label className="font-semibold">{field.charAt(0).toUpperCase() + field.slice(1)}</label>
              <input type="text" value={formData[field]} onChange={e => setFormData(prev => ({ ...prev, [field]: e.target.value }))} className="border p-2 w-full rounded-md"/>
            </div>
          ))}

          <div>
            <label className="font-semibold">Price/Sq.ft</label>
            <input type="number" value={formData.pricePerSquareFoot} onChange={e => setFormData(prev => ({ ...prev, pricePerSquareFoot: e.target.value }))} className="border p-2 w-full rounded-md"/>
          </div>

          <div>
            <label className="font-semibold">Status</label>
            <select value={formData.status} onChange={e => setFormData(prev => ({ ...prev, status: e.target.value }))} className="border p-2 w-full rounded-md">
              <option>On-Going</option>
              <option>Up-Coming</option>
              <option>Sold Out</option>
            </select>
          </div>

          <div>
            <label className=" font-semibold  ">Description</label>
            <textarea value={formData.description} onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))} className="border my-2 p-3 w-full rounded-md" />
          </div>

         <div>
  <div className="space-y-2">
  <label className="font-semibold  text-lg ">Main Image</label>
  <div className="relative">
    <input
      type="file"
      accept="image/*"
      onChange={handleMainImageChange}
      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer  z-10"
      id="main-image-upload"
      
    />
    <div className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-6 w-full bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
      <div className="text-center">
        <div className="mx-auto w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <p className="text-gray-600 font-medium">Click to upload image</p>
        <p className="text-gray-400 text-sm mt-1">PNG, JPG, GIF up to 10MB</p>
      </div>
    </div>
  </div>
</div>
  {/* Main Image */}
{formData.mainImagePreview && (
  <div className="relative mt-2">
    <img
      src={
        formData.mainImagePreview.startsWith("http") || formData.mainImagePreview.startsWith("blob:")
          ? formData.mainImagePreview
          : `${SERVER_URL}${formData.mainImagePreview}`
      }
      className="w-full h-48 object-cover rounded-md"
    />
    <button
      type="button"
      onClick={handleDeleteMainImage}
      className="absolute top-2 right-2 bg-red-700  rounded-full p-1 border-2 border-white"
    >
      🗑️
    </button>
  </div>
)}



</div>

<div className="space-y-3">
  <label className="block text-sm font-semibold text-gray-700">Sub Images</label>
  
  {/* Upload Zone */}
  <div className="relative">
    <input
      type="file"
      multiple
      accept="image/*"
      onChange={handleImagesChange}
      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
      
    />
    <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-5 bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
      <div className="p-2 bg-blue-100 rounded-full mb-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
      <p className="text-gray-600 font-medium">Click to upload images</p>
      <p className="text-gray-400 text-xs mt-1">Supports JPG, PNG, GIF • Max 10MB each</p>
    </div>
  </div>

  {/* Sub Image Previews */}
{formData.imagesPreview.length > 0 && (
  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 mt-2">
    {formData.imagesPreview.map((img, i) => (
      <div key={i} className="group relative aspect-square rounded-lg overflow-hidden border border-gray-200 bg-gray-100">
        <img
          src={
            img.startsWith("http") || img.startsWith("blob:")
              ? img
              : `${SERVER_URL}${img}`
          }
          alt={`Project image ${i + 1}`}
          className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
        />
        <button
          type="button"
          onClick={() => handleDeleteSubImage(i)}
          className="absolute top-2 right-2 bg-red-600 text-white p-1.5 rounded-full shadow-md  group-hover:opacity-100 transition-opacity hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 border-2 border-white"
          aria-label={`Remove image ${i + 1}`}
        >
          🗑️
        </button>
      </div>
    ))}
  </div>
)}
</div>




          {/* Amenities */}
          <div>
            <label className="font-semibold">Amenities</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-1">
              {formData.amenities.map((a, i) => {
                   const IconComponent = getAmenityIcon(a.name);
                   return(
                <label key={i} className="flex items-center gap-2 border p-2 rounded-md">
                  <input type="checkbox" checked={a.selected} onChange={e => {
                    const newAmenities = [...formData.amenities];
                    newAmenities[i].selected = e.target.checked;
                    setFormData(prev => ({ ...prev, amenities: newAmenities }));
                  }} />
                  <IconComponent className="w-3.5 h-3.5 text-blue-600" />
                  {a.name}
                </label>
              )})}
            </div>
          </div>

          {/* Specifications */}
          <div>
            <label className="font-semibold">Specifications</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-1">
              {Object.keys(formData.specifications).map(key => (
                <div key={key}>
                  <label>{key}</label>
                  <input type="text" value={formData.specifications[key]} onChange={e => setFormData(prev => ({ ...prev, specifications: { ...prev.specifications, [key]: e.target.value } }))} className="border p-2 w-full rounded-md"/>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded-md
            hover:bg-red-500 hover:text-white">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-accent text-primary rounded-md hover:bg-amber-400 hover:text-white">{editProject ? "Update" : "Add"} Project</button>
          </div>
        </form>
      </div>
    </>
  );
}
