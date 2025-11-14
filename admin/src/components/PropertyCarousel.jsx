import { useState, useEffect } from "react";
import { Upload, Trash2, ImageIcon, Plus, ChevronLeft, ChevronRight, X, Monitor, Smartphone } from "lucide-react";

export default function PropertyCarousel() {
  const [images, setImages] = useState([]);
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [autoSlideEnabled, setAutoSlideEnabled] = useState(false);
  
  const SERVER_URL = import.meta.env.VITE_SERVER_URL;

  // Fetch ALL images
  const fetchImages = async () => {
    try {
      const res = await fetch(`${SERVER_URL}/carousel`);
      const data = await res.json();
      setImages(data);

      if (images.length === 0) {
        setCurrentSlide(0);
      } else if (currentSlide >= images.length) {
        setCurrentSlide(images.length - 1);
      }
    } catch (error) {
      console.error("Error fetching images:", error);
      setImages([]);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  // Preload images
  useEffect(() => {
    images.forEach(img => {
      if (img.image) {
        const image = new Image();
        image.src = `${SERVER_URL}/${img.image.replace(/^\/?/, '')}`;
      }
    });
  }, [images]);

  // Auto-slide functionality (optional)
  useEffect(() => {
    if (!autoSlideEnabled || images.length === 0) return;
    
    const intervalId = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % images.length);
    }, 1500);
    
    return () => clearInterval(intervalId);
  }, [images.length, autoSlideEnabled]);

  // Toggle device type
  const toggleDeviceType = async (id, currentType) => {
    const newType = currentType === "mobile" ? "desktop" : "mobile";
    
    try {
      // Optimistic UI update
      setImages(prev => 
        prev.map(img => img.id === id ? { ...img, deviceType: newType } : img)
      );
      
      // Uncomment for real API call:
      // await fetch(`${SERVER_URL}/carousel/${id}`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ deviceType: newType })
      // });
      
      console.log(`Updated device type for ${id} to ${newType}`);
    } catch (err) {
      console.error("Failed to update device type:", err);
      // Revert on error
      setImages(prev => 
        prev.map(img => img.id === id ? { ...img, deviceType: currentType } : img)
      );
      alert("Failed to update device type");
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(selectedFile);
    } else {
      setPreview(null);
    }
  };

  const handleAdd = async (selectedDeviceType) => {
    if (!file) {
      alert("Please select an image");
      return;
    }
    if (!title.trim()) {
      alert("Please enter a title");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("image", file);
      formData.append("title", title);
      formData.append("deviceType", selectedDeviceType);
      
      // Uncomment for real API call:
      // await fetch(`${SERVER_URL}/carousel`, {
      //   method: 'POST',
      //   body: formData
      // });
      
      // Mock success
      console.log("Image uploaded successfully");
      alert("Uploaded Successfully!");
      
      setFile(null);
      setTitle("");
      setPreview(null);
      fetchImages();
    } catch (error) {
      alert("Error uploading image");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, imageTitle) => {
    const confirmed = window.confirm(`Are you sure you want to delete "${imageTitle}"?`);
    
    if (confirmed) {
      try {
        // Uncomment for real API call:
        // await fetch(`${SERVER_URL}/carousel/${id}`, { method: 'DELETE' });
        
        setImages(prev => prev.filter(img => img.id !== id));
        
        // Adjust current slide if necessary
        if (currentSlide >= images.length - 1 && currentSlide > 0) {
          setCurrentSlide(prev => Math.max(0, prev - 1));
        }
        
        alert(`Deleted "${imageTitle}" successfully!`);
      } catch (err) {
        console.error("Error deleting image:", err);
        alert("Failed to delete property image.");
      }
    }
  };

  const nextSlide = () => {
    if (images.length === 0) return;
    setCurrentSlide(prev => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    if (images.length === 0) return;
    setCurrentSlide(prev => (prev - 1 + images.length) % images.length);
  };

  const handleTouchStart = (e) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 75;
    const isRightSwipe = distance < -75;
    
    if (isLeftSwipe) {
      nextSlide();
    }
    if (isRightSwipe) {
      prevSlide();
    }
    
    setTouchStart(0);
    setTouchEnd(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
            <ImageIcon className="w-8 h-8 text-blue-600" />
            Property Carousel Manager
          </h1>
          <p className="text-slate-600 mt-2">
            Manage all images • <span className="font-medium">{images.length} total</span>
          </p>
        </div>

        {/* Carousel Display */}
        {images.length > 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-slate-800">
                All Carousel Images
              </h2>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoSlideEnabled}
                  onChange={(e) => setAutoSlideEnabled(e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="text-sm text-slate-600">Auto-slide</span>
              </label>
            </div>
            
            <div className="relative">
              <div
                className="relative overflow-hidden rounded-xl bg-black w-full h-[60vh] sm:h-[70vh] md:h-[80vh] flex items-center justify-center"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                <div
                  className="flex transition-transform ease-in-out duration-500"
                  style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                  {images.map((img) => (
                    <div key={img.id} className="min-w-full flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 relative">
                      {img.image && img.image.trim() !== "" ? (
                        <img
                          src={`${SERVER_URL}/${img.image.replace(/^\/?/, '')}`}
                          alt={img.title}
                          className="max-h-[80vh] w-auto object-contain mx-auto"
                          style={{ maxWidth: '100%' }}
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            const fallback = e.currentTarget.parentNode.querySelector('.fallback');
                            if (fallback) {
                              fallback.style.display = 'flex';
                            }
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center fallback">
                          <span className="text-gray-400 text-lg">No Image Available</span>
                        </div>
                      )}

                      <button
                        onClick={() => handleDelete(img.id, img.title)}
                        className="absolute top-4 right-4 bg-red-600 hover:bg-red-700 text-white p-2 rounded-full shadow-lg transition-all hover:scale-110 z-10"
                        aria-label="Delete image"
                      >
                        <X className="w-5 h-5" />
                      </button>
                      
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                        <div 
                          onClick={() => toggleDeviceType(img.id, img.deviceType)}
                          className="flex items-center gap-2 mb-2 cursor-pointer group"
                        >
                          {img.deviceType === "mobile" ? (
                            <Smartphone className="w-4 h-4 text-blue-300 group-hover:text-blue-200" />
                          ) : (
                            <Monitor className="w-4 h-4 text-green-300 group-hover:text-green-200" />
                          )}
                          <span className={`text-xs font-semibold uppercase ${
                            img.deviceType === "mobile" 
                              ? "text-blue-200 group-hover:text-blue-100" 
                              : "text-green-200 group-hover:text-green-100"
                          } transition-colors`}>
                            {img.deviceType}
                          </span>
                          <span className="text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                            (click to toggle)
                          </span>
                        </div>
                        <h3 className="text-white text-2xl font-bold">{img.title}</h3>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Navigation Buttons */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={prevSlide}
                      className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-white text-slate-800 p-3 rounded-full shadow-lg transition-all hover:scale-110"
                      aria-label="Previous slide"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                      onClick={nextSlide}
                      className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-white text-slate-800 p-3 rounded-full shadow-lg transition-all hover:scale-110"
                      aria-label="Next slide"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  </>
                )}
              </div>

              {/* Dots Navigation */}
              {images.length > 1 && (
                <div className="flex justify-center gap-2 mt-4">
                  {images.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentSlide(idx)}
                      className={`transition-all ${
                        idx === currentSlide 
                          ? "w-8 bg-blue-600" 
                          : "w-2 bg-slate-300 hover:bg-slate-400"
                      } h-2 rounded-full`}
                      aria-label={`Go to slide ${idx + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8 text-center py-12">
            <ImageIcon className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-slate-700 mb-2">No images found</h3>
            <p className="text-slate-500">Add your first carousel image below</p>
          </div>
        )}

        {/* Upload Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Add New Property Image
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Property Title
                </label>
                <input
                  type="text"
                  placeholder="e.g., Modern Villa in Downtown"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Upload Image
                </label>
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="flex items-center justify-center gap-2 w-full px-4 py-3 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition"
                  >
                    <Upload className="w-5 h-5 text-slate-600" />
                    <span className="text-slate-600">
                      {file ? file.name : "Choose an image file"}
                    </span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Device Type
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => handleAdd("mobile")}
                    disabled={loading || !file || !title.trim()}
                    className="flex flex-col items-center justify-center gap-2 p-4 border-2 rounded-lg hover:border-blue-500 transition bg-blue-50/50 hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Smartphone className="w-6 h-6 text-blue-600" />
                    <span className="font-medium">Mobile</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAdd("desktop")}
                    disabled={loading || !file || !title.trim()}
                    className="flex flex-col items-center justify-center gap-2 p-4 border-2 rounded-lg hover:border-green-500 transition bg-green-50/50 hover:bg-green-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Monitor className="w-6 h-6 text-green-600" />
                    <span className="font-medium">Desktop</span>
                  </button>
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  Choose where this image will be displayed
                </p>
              </div>
            </div>

            <div className="flex items-center justify-center">
              {preview ? (
                <div className="w-full">
                  <p className="text-sm font-medium text-slate-700 mb-2">Preview</p>
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full h-64 object-cover rounded-lg shadow-md"
                  />
                </div>
              ) : (
                <div className="w-full h-64 bg-slate-100 rounded-lg flex items-center justify-center border-2 border-dashed border-slate-300">
                  <div className="text-center">
                    <ImageIcon className="w-12 h-12 text-slate-400 mx-auto mb-2" />
                    <p className="text-slate-500">Image preview will appear here</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}