import { useState, useEffect } from "react";
import axios from "axios"; // ✅ Import axios
import Swal from "sweetalert2"; // ✅ Optional but needed if using Swal
import {
  Upload,
  Trash2,
  ImageIcon,
  Plus,
  ChevronLeft,
  ChevronRight,
  X,
  Monitor,
  Smartphone,
} from "lucide-react";


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

  // ✅ Fetch ALL images — FIXED: no .json() needed with axios
  const fetchImages = async () => {
    try {
      const res = await axios.get(`${SERVER_URL}/carousel`);
      setImages(res.data); // ✅ axios already parses JSON

      // Reset slide index if needed
      if (res.data.length === 0) {
        setCurrentSlide(0);
      } else if (currentSlide >= res.data.length) {
        setCurrentSlide(res.data.length - 1);
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
    images.forEach((img) => {
      if (img.image) {
        const image = new Image();
        image.src = `${SERVER_URL}/${img.image.replace(/^\/?/, "")}`;
      }
    });
  }, [images, SERVER_URL]);

  // Auto-slide
  useEffect(() => {
    if (!autoSlideEnabled || images.length === 0) return;

    const intervalId = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % images.length);
    }, 1500);

    return () => clearInterval(intervalId);
  }, [images.length, autoSlideEnabled]);



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

      await axios.post(`${SERVER_URL}/carousel`, formData);

      // ✅ Use Swal after successful upload
      Swal.fire({
        title: "Uploaded Successfully!",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });

      setFile(null);
      setTitle("");
      setPreview(null);
      fetchImages();
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Error uploading image");
    } finally {
      setLoading(false);
    }
  };


const handleDelete = async (id, imageTitle) => {
  // Show confirmation dialog
  const result = await Swal.fire({
    title: "Are you sure?",
    text: `You won't be able to revert this! Delete "${imageTitle}"?`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#6b7280",
    confirmButtonText: "Yes, delete it!",
    cancelButtonText: "Cancel",
    reverseButtons: true,
    focusCancel: true,
  });

  if (result.isConfirmed) {
    try {
      // Show loading indicator
      Swal.fire({
        title: "Deleting...",
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      // Perform deletion
      await axios.delete(`${SERVER_URL}/carousel/${id}`);

      // Update state
      const updatedImages = images.filter((img) => img.id !== id);
      setImages(updatedImages);

      // Adjust current slide if needed
      if (updatedImages.length === 0) {
        setCurrentSlide(0);
      } else if (currentSlide >= updatedImages.length) {
        setCurrentSlide(updatedImages.length - 1);
      }

      // Show success message
      await Swal.fire({
        title: "Deleted!",
        text: `"${imageTitle}" has been deleted.`,
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
        timerProgressBar: true,
      });
    } catch (err) {
      console.error("Error deleting image:", err);
      // Show error message
      await Swal.fire({
        title: "Failed to delete!",
        text: "An error occurred while deleting the image. Please try again.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  }
};
 

  const nextSlide = () => {
    if (images.length === 0) return;
    setCurrentSlide((prev) => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    if (images.length === 0) return;
    setCurrentSlide((prev) => (prev - 1 + images.length) % images.length);
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

    if (isLeftSwipe) nextSlide();
    if (isRightSwipe) prevSlide();

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
              <h2 className="text-xl font-semibold text-slate-800">All Carousel Images</h2>
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

            <div
              className="relative overflow-hidden rounded-xl bg-black w-full min-h-[350px] aspect-[16/9] sm:aspect-[4/3] md:aspect-video flex items-center justify-center"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <div
                className="flex w-full h-full"
                style={{
                  transform: `translateX(-${currentSlide * 100}%)`,
                  transition: 'transform 0.5s ease-in-out',
                }}
              >
                {images.map((img) => (
                  <div
                    key={img.id}
                    className="w-full flex-shrink-0 h-full flex items-center justify-center relative"
                  >
                    <img
                      src={`${SERVER_URL}/${img.image.replace(/^\/?/, '')}`}
                      alt={img.title}
                      className="max-w-full max-h-full object-contain"
                      loading="lazy"
                    />
                    <div className="absolute top-3 right-3 flex flex-col gap-2 z-30">
                      <button
                        onClick={() => handleDelete(img.id, img.title)}
                        className="p-2 bg-red-500/90 hover:bg-red-600 text-white rounded-full shadow-md transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
                        aria-label="Delete image"
                        title="Delete this image"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Title & Device Tag - Bottom Left */}
                    <div className="absolute bottom-3 left-3 bg-black/70 text-white px-2.5 py-1.5 rounded text-sm font-medium backdrop-blur-sm">
                      {img.title} 
                         {img.deviceType === 'mobile' ? (
                        <div className ='flex'>
                          <Smartphone className="w-4 h-4 text-blue-600" /> 
                          <span>Mobile</span>
                        </div>
                        ) : (
                          <div className = 'flex'>

                            <Monitor className="w-4 h-4 text-green-600" />
                            <span>Desktop</span>
                          </div>
                        )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Navigation Arrows (outside image slides) */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={prevSlide}
                    className="absolute left-3 top-1/2 -translate-y-1/2 z-30 bg-white/90 hover:bg-white text-slate-800 p-2 rounded-full shadow-lg transition-all hover:scale-105 focus:outline-none"
                    aria-label="Previous slide"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={nextSlide}
                    className="absolute right-3 top-1/2 -translate-y-1/2 z-30 bg-white/90 hover:bg-white text-slate-800 p-2 rounded-full shadow-lg transition-all hover:scale-105 focus:outline-none"
                    aria-label="Next slide"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
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