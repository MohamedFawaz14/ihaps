import { useState, useEffect } from "react";
import InsightModal from "./models/InsightModal.jsx";
import { Plus, Trash2, Edit } from "lucide-react";
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
   
      <main className="flex-1 overflow-y-auto p-6 ml-0 md:ml-80 mt-10">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl text-primary font-bold mb-2">Insights</h1>
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border px-3 py-2 rounded-md w-full max-w-xs"
              />
            </div>

            <button
              className="bg-accent text-primary px-4 py-2 rounded-md flex items-center"
              onClick={() => { setEditingInsight(null); setIsModalOpen(true); }}
            >
              <Plus className="w-4 h-4 mr-2"/> Add Insight
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredInsights.map(insight => (
              <div key={insight.id} className="bg-white rounded-lg   border-2 border-blue-100 hover:border-blue-300
              shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden" >
                <div className="relative">
                  {insight.image && (
                    <img 
                      src={`${SERVER_URL}${insight.image}`} 
                      alt={insight.title} 
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                  )}
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