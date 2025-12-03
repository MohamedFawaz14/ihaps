import { useState, useEffect } from "react";
import InsightModal from "./models/InsightModal.jsx";
import { Plus, BookOpen } from "lucide-react";
import axios from "axios";
import Swal from 'sweetalert2';
import NavBar from "./NavBar.jsx";

export default function InsightsPage() {
  const [insights, setInsights] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingInsight, setEditingInsight] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const SERVER_URL = import.meta.env.VITE_SERVER_URL;

  useEffect(() => {
    fetchInsights();
  }, []);

  const fetchInsights = async () => {
    try {
      const res = await axios.get(`${SERVER_URL}/insights`);
      setInsights(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSave = (savedInsight) => {
    setInsights(prev => {
      const exists = prev.find(i => i.id === savedInsight.id);
      if (exists) {
        return prev.map(i => i.id === savedInsight.id ? savedInsight : i);
      } else {
        return [savedInsight, ...prev];
      }
    });
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`${SERVER_URL}/insights/${id}`);
        setInsights(prev => prev.filter(i => i.id !== id));
        Swal.fire('Deleted!', 'Insight has been deleted.', 'success');
      } catch (err) {
        console.error(err);
        Swal.fire('Error!', 'Failed to delete insight.', 'error');
      }
    }
  };

  const filteredInsights = insights.filter(insight =>
    insight.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    insight.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
    insight.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-gray-50">
      <NavBar />
   
      <main className="flex-1 overflow-y-auto p-6 ml-0 md:ml-80  mb-5">
        <div className="space-y-6">
          {/* Header Section */}
           <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-amber-500 rounded-2xl blur-2xl opacity-20"></div>
            <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-blue-100">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg">
                      <BookOpen className="w-6 h-6 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-amber-500 bg-clip-text text-transparent leading-tight pb-1">
                      Insights
                    </h1>
                  </div>
                  <p className="text-gray-600 ml-14 mb-4">Manage and share your latest insights and articles</p>
                  
                  {/* Search Bar */}
                  <div className="ml-1">
                    <input
                      type="text"
                      placeholder="Search insights by title, excerpt, or category..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="border border-gray-300 px-4 py-2 rounded-lg w-full max-w-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                <button
                  onClick={() => { setEditingInsight(null); setIsModalOpen(true); }}
                  className="group relative overflow-hidden bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 font-medium"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    <Plus className="w-5 h-5" />
                    Add Insight
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-amber-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
              </div>
            </div>
          </div>

          {/* Insights Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredInsights.map(insight => (
              <div key={insight.id} className="bg-white rounded-lg border-2 border-blue-100 hover:border-blue-300 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden">
                <div className="relative aspect-4/3  overflow-hidden bg-black">
                   { insight.image ? ( // Check if insight.image exists and is truthy
                    <img 
                      src={`${SERVER_URL}${insight.image}`} 
                      alt={insight.title} 
                      className="w-full h-full object-fill object-center hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    // Render a placeholder if insight.image is falsy
                    <div className="w-full aspect-4/3 bg-gray-200 flex items-center justify-center rounded-t-lg">
                      <span className="text-gray-500 text-sm">No Image</span>
                    </div>
                  )
                }`
                  <div className="absolute top-2 right-2 flex space-x-2">
                    <button
                      onClick={() => { setEditingInsight(insight); setIsModalOpen(true); }}
                      className="p-2 bg-yellow-400 text-white rounded-full shadow-2xl transition border-white border-3"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDelete(insight.id)}
                      className="p-2 bg-blue-950 text-white rounded-full shadow-md transition border-white border-3"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-primary font-semibold">{insight.title}</h3>
                  <p className="text-muted-foreground text-sm line-clamp-3">{insight.excerpt}</p>
                  <p className="text-xs text-gray-400 mt-2">{insight.category}</p>
                </div>
              </div>
            ))}
          </div>

          {isModalOpen && (
            <InsightModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              onSave={handleSave}
              insight={editingInsight}
            />
          )}
        </div>
      </main>
    </div>
  );
}