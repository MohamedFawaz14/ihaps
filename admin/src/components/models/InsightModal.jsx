import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { toast } from "sonner@2.0.3";
import axios from "axios";

export default function InsightModal({ isOpen, onClose, onSave, insight }) {
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    category: "General",
    author: "Admin",
    imageFile: null,
    imagePreview: ""
  });
   const SERVER_URL = import.meta.env.VITE_SERVER_URL;
  useEffect(() => {
    if (insight) {
      setFormData({
        title: insight.title,
        excerpt: insight.excerpt,
        category: insight.category || "General",
        author: insight.author || "Admin",
        imageFile: null,
        imagePreview: insight.image 
        ? `${SERVER_URL}${insight.image}`
        : ""
      });
    } else {
      setFormData({
        title: "",
        excerpt: "",
        category: "General",
        author: "Admin",
        imageFile: null,
        imagePreview: ""
      });
    }
  }, [insight]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.excerpt) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("excerpt", formData.excerpt);
      data.append("category", formData.category);
      data.append("author", formData.author);
      if (formData.imageFile) data.append("image", formData.imageFile);

      let res;
      if (insight?.id) {
        res = await axios.put(`${SERVER_URL}/insights/${insight.id}`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        res = await axios.post(`${SERVER_URL}/insights`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      onSave(res.data);
      toast.success("Insight saved successfully!");
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Failed to save insight");
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50" onClick={onClose} />
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md bg-white rounded-lg shadow-xl">
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-primary">Add / Edit Insight</h2>
          <button onClick={onClose}><X className="w-5 h-5 text-gray-500" /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-primary">Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full border rounded-md px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-primary">Description</label>
            <textarea
              value={formData.excerpt}
              onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
              className="w-full border rounded-md px-3 py-2 min-h-[100px]"
            />
          </div>

          <div>
            <label className="block text-primary">Category</label>
            <input
              type="text"
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
              className="w-full border rounded-md px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-primary">Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                setFormData(prev => ({ ...prev, imageFile: file, imagePreview: URL.createObjectURL(file) }));
              }}
              className="w-full border rounded-md px-3 py-2"
            />
            {formData.imagePreview && (
              <img src={formData.imagePreview} alt="Preview" className="mt-2 w-full h-40 object-cover rounded-md"/>
            )}
          </div>

          <div className="flex justify-end space-x-3">
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded-md
            hover:bg-red-500 hover:text-white
            ">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-accent text-primary rounded-md
            hover:bg-amber-400 hover:text-white
            ">Save</button>
          </div>
        </form>
      </div>
    </>
  );
}
