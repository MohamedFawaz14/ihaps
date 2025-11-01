import { useState, useEffect } from 'react';
import axios from 'axios';
import AchievementModal from './models/AchievementModal.jsx';
import { Trophy, TrendingUp, Users, Building2, Award } from 'lucide-react';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NavBar from './NavBar.jsx';

export default function AchievementsPage() {
  const [achievements, setAchievements] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAchievement, setEditingAchievement] = useState(null);
  const SERVER_URL = import.meta.env.VITE_SERVER_URL;

  useEffect(() => {
    fetchAchievements();
  }, []);

  const fetchAchievements = async () => {
    try {
      const res = await axios.get(`${SERVER_URL}/achievements`);
      setAchievements(res.data);
    } catch (err) {
      console.error('Error fetching achievements:', err);
      toast.error('Failed to fetch achievements!');
    }
  };

  const handleSave = async (achievement) => {
    try {
      if (achievement.id) {
        // update existing achievement
        const res = await axios.put(
          `${SERVER_URL}/achievements/${achievement.id}`,
          achievement
        );
        setAchievements((prev) =>
          prev.map((a) => (a.id === res.data.id ? res.data : a))
        );
        toast.success('Achievement updated!');
      } else {
        // add new achievement
        const res = await axios.post(`${SERVER_URL}/achievements`, achievement);
        setAchievements((prev) => [...prev, res.data]);
        toast.success('Achievement added!');
      }
      setIsModalOpen(false);
      setEditingAchievement(null);
    } catch (err) {
      console.error('Error saving achievement:', err);
      toast.error('Failed to save achievement!');
    }
  };

  const handleDelete = async (id, label) => {
    Swal.fire({
      title: `Are you sure you want to delete "${label}"?`,
      text: 'This action cannot be undone!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#00008B',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${SERVER_URL}/achievements/${id}`);
          setAchievements((prev) => prev.filter((a) => a.id !== id));

          Swal.fire({
            title: 'Deleted!',
            text: `Achievement "${label}" has been deleted.`,
            icon: 'success',
          });
        } catch (err) {
          console.error('Error deleting achievement:', err);
          Swal.fire({
            title: 'Error!',
            text: 'Failed to delete achievement.',
            icon: 'error',
          });
        }
      }
    });
  };

  const iconMap = {
    Trophy: <Trophy className="w-8 h-8" />,
    Users: <Users className="w-8 h-8" />,
    Building2: <Building2 className="w-8 h-8" />,
    Award: <Award className="w-8 h-8" />,
    TrendingUp: <TrendingUp className="w-8 h-8" />,
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-blue-50 via-white to-amber-50">
      {/* Fixed top navigation bar */}
      <NavBar />

      {/* Scrollable main content area */}
      <div className="relative flex-1 overflow-y-auto p-6 ml-0 md:ml-80">
        {/* Decorative background blobs (non-interactive, behind content) */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        <div className="max-w-7xl mx-auto p-6 space-y-8">
          {/* Header Section */}
<div className="relative">
  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-amber-500 rounded-2xl blur-2xl opacity-20"></div>
  <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-blue-100">
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      {/* Title + Subtitle Group */}
      <div className="flex items-start gap-3 mb-2">
        <div className="mt-1 p-2 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg">
          <Trophy className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-yellow-300 bg-clip-text text-transparent">
            Achievements & Milestones
          </h1>
          <p className="text-gray-600 mt-1">
            Track and celebrate your success journey
          </p>
        </div>
      </div>

      {/* Add Button */}
      <button
        onClick={() => {
          setEditingAchievement(null);
          setIsModalOpen(true);
              }}
              className="group relative overflow-hidden bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 font-medium whitespace-nowrap"
            >
              <span className="relative z-10 flex items-center gap-2 ">
                + Add Achievement
              </span>
            </button>
          </div>
        </div>
      </div>

          {/* Achievement Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {achievements.map((a, index) => (
              <div
                key={a.id}
                className="group relative bg-white rounded-2xl border-2 border-blue-100 hover:border-blue-300 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Gradient Background Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-amber-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                <div className="relative p-6">
                  {/* Action Buttons */}
                  <div className="absolute top-4 right-4 flex gap-2  group-hover:opacity-100 transition-opacity duration-300">
                    <button
                      onClick={() => {
                        setEditingAchievement(a);
                        setIsModalOpen(true);
                      }}
                      className="p-2 bg-yellow-500 hover:bg-blue-600 text-white rounded-lg transition-colors shadow-md hover:shadow-lg"
                      title="Edit"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDelete(a.id, a.label)}
                      className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors shadow-md hover:shadow-lg"
                      title="Delete"
                    >
                      🗑️
                    </button>
                  </div>

                  {/* Icon */}
                  <div
                    className={`inline-flex p-4 rounded-xl ${a.color} shadow-md group-hover:shadow-lg transition-shadow duration-300 mb-4`}
                  >
                    {iconMap[a.icon] || <Building2 className="w-8 h-8 text-blue-600" />}
                  </div>

                  {/* Value */}
                  <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-amber-500 bg-clip-text text-transparent mb-2">
                    {a.value}
                    {a.suffix}
                  </div>

                  {/* Label */}
                  <div className="text-gray-600 font-medium">{a.label}</div>

                  {/* Bottom Decorative Line */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-300 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {achievements.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border-2 border-dashed border-blue-200">
              <div className="p-4 bg-blue-50 rounded-full mb-4">
                <Trophy className="w-12 h-12 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                No Achievements Yet
              </h3>
              <p className="text-gray-500 mb-6">
                Start tracking your milestones by adding your first achievement
              </p>
              <button
                onClick={() => {
                  setEditingAchievement(null);
                  setIsModalOpen(true);
                }}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl font-medium"
              >
                Add Your First Achievement
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal outside scrollable area but inside flex container */}
      <AchievementModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingAchievement(null);
        }}
        onSave={handleSave}
        achievement={editingAchievement}
      />
    </div>
  );
}
