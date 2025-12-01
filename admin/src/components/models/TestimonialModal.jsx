import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { toast } from 'sonner';

export default function TestimonialModal({ isOpen, onClose, onSave, testimonial }) {
  const [formData, setFormData] = useState({
    name: '',
    quote: '',
    rating: 5
  });

  // Load data if editing
  useEffect(() => {
    if (testimonial) setFormData(testimonial);
    else setFormData({ name: '', quote: '', rating: 5 });
  }, [testimonial]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.quote) {
      toast.error('Please fill in all required fields');
      return;
    }
    onSave({
      ...formData,
      date: new Date().toISOString().split('T')[0],
      verified: formData.verified || false
    });
    toast.success('Testimonial saved successfully!');
    setFormData({ name: '',quote: '', rating: 5 });
  };

  const handleClose = () => {
    setFormData({ name: '', quote: '', rating: 5 });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50" onClick={handleClose} />
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md bg-white rounded-lg shadow-xl">
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-primary">Add / Edit Testimonial</h2>
          <button onClick={handleClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-2">
            <label className="text-primary block">Client Name *</label>
            <input
              className="w-full px-3 py-2 border rounded-md"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Client Name"
            />
          </div>

          

          <div className="space-y-2">
            <textarea
              className="w-full px-3 py-2 border rounded-md min-h-[100px]"
              value={formData.quote}
              onChange={(e) => setFormData(prev => ({ ...prev, quote: e.target.value }))}
              placeholder="Testimonial"
            />
          </div>

          <div className="space-y-2">
            <label className="text-primary block">Rating</label>
            <select
              className="w-full px-3 py-2 border rounded-md"
              value={formData.rating}
              onChange={(e) => setFormData(prev => ({ ...prev, rating: parseInt(e.target.value) }))}
            >
              {[5,4,3,2,1].map(r => <option key={r} value={r}>{r} Stars</option>)}
            </select>
          </div>

          <div className="flex justify-end space-x-3">
            <button type="button" onClick={handleClose} className="px-4 py-2 border rounded-md
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
