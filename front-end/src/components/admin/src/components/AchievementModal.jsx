import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Trophy, TrendingUp, Users, Building2, Award } from 'lucide-react';
import { toast } from 'sonner';

export default function AchievementModal({ isOpen, onClose, onSave, achievement }) {
  const [formData, setFormData] = useState({
    label: '',
    value: 0,
    suffix: '',
    color: 'text-blue-600',
    icon: 'Building2'
  });

  useEffect(() => {
    if (achievement) {
      setFormData(achievement);
    } else {
      setFormData({
        label: '',
        value: 0,
        suffix: '',
        color: 'text-blue-600',
        icon: 'Building2'
      });
    }
  }, [achievement]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.label) {
      toast.error('Label is required');
      return;
    }
    onSave(formData);
    toast.success('Achievement saved successfully!');
  };

  if (!isOpen) return null;

  const iconOptions = ['Trophy', 'Users', 'Building2', 'Award', 'TrendingUp'];

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50" onClick={onClose} />
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md bg-white rounded-lg shadow-xl">
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-primary">{achievement ? 'Edit Achievement' : 'Add Achievement'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="text-primary block mb-1">Label</label>
            <input
              type="text"
              value={formData.label}
              onChange={e => handleChange('label', e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20"
              required
            />
          </div>

          <div>
            <label className="text-primary block mb-1">Value</label>
            <input
              type="number"
              value={formData.value}
              onChange={e => handleChange('value', parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20"
              required
            />
          </div>

          <div>
            <label className="text-primary block mb-1">Suffix</label>
            <input
              type="text"
              value={formData.suffix}
              onChange={e => handleChange('suffix', e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div>
            <label className="text-primary block mb-1">Color (Tailwind)</label>
            <input
              type="text"
              value={formData.color}
              onChange={e => handleChange('color', e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div>
            <label className="text-primary block mb-1">Icon</label>
            <select
              value={formData.icon}
              onChange={e => handleChange('icon', e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              {iconOptions.map(icon => <option key={icon} value={icon}>{icon}</option>)}
            </select>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-accent text-primary rounded-md hover:bg-accent/90"
            >
              {achievement ? 'Update' : 'Add'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
