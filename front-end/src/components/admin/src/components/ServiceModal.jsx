import { useState, useEffect } from 'react';
import { X, Home, Scale, Search, FileText, Building, DollarSign, Phone, Users } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

const iconOptions = [
  { value: 'Home', label: 'Home', icon: Home },
  { value: 'Scale', label: 'Legal/Scale', icon: Scale },
  { value: 'Search', label: 'Search', icon: Search },
  { value: 'FileText', label: 'Documentation', icon: FileText },
  { value: 'Building', label: 'Building', icon: Building },
  { value: 'DollarSign', label: 'Finance', icon: DollarSign },
  { value: 'Phone', label: 'Support', icon: Phone },
  { value: 'Users', label: 'Team', icon: Users }
];

export default function ServiceModal({ isOpen, onClose, onSave, service }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    iconName: 'Home',
    price: ''
  });

  useEffect(() => {
    if (service) {
      setFormData({
        title: service.title || '',
        description: service.description || '',
        iconName: service.iconName || 'Home',
      });
    } else {
      setFormData({ title: '', description: '', iconName: 'Home', });
    }
  }, [service]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description) {
      toast.error('Please fill in all required fields');
      return;
    }
    onSave(formData);
    toast.success(`Service ${service ? 'updated' : 'added'} successfully!`);
    setFormData({ title: '', description: '', iconName: 'Home', price: '' });
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50" onClick={onClose} />
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md bg-white rounded-lg shadow-xl">
        <div className="p-6 border-b flex justify-between items-center">
          <div>
            <h2 className="text-primary">{service ? 'Edit Service' : 'Add New Service'}</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <input 
            value={formData.title} 
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))} 
            placeholder="Title" className="w-full px-3 py-2 border rounded-md"
          />
          <textarea 
            value={formData.description} 
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))} 
            placeholder="Description" className="w-full px-3 py-2 border rounded-md"
          />
          
          <select 
            value={formData.iconName} 
            onChange={(e) => setFormData(prev => ({ ...prev, iconName: e.target.value }))} 
            className="w-full px-3 py-2 border rounded-md"
          >
            {iconOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
          <div className="flex justify-end space-x-2">
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded-md">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-accent text-primary rounded-md">{service ? 'Update' : 'Add'}</button>
          </div>
        </form>
      </div>
    </>
  );
}
