import React, { useState, useEffect } from 'react'; 
import { Link } from 'react-router-dom';
import { Calendar, User, ArrowRight, Clock, Filter } from 'lucide-react';
import ImageWithFallback from './ImageWithFallback';
import axios from 'axios';
import { toast } from 'sonner';

const categories = ["All", "Home Buying", "Investment", "Market Analysis", "Planning", "Legal", "Technology", "Sustainability", "Finance", "Development"];

export default function BlogPage() {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
   const SERVER_URL = import.meta.env.VITE_SERVER_URL;
  const fetchInsights = async () => {
    try {
      const res = await axios.get(`${SERVER_URL}/insights`);
      setInsights(res.data || []);
     
    } catch (err) {
      toast.error('Failed to fetch insights!', err);
      setInsights([]); 
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, []);

  const filteredPosts = insights.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Use placeholders if filteredPosts is empty
  const displayPosts = filteredPosts.length ? filteredPosts : Array.from({ length: 6 }, (_, i) => ({
    title: "Not Available",
    excerpt: "Content will be updated soon.",
    category: "General",
    image: "/placeholder.jpg", // add a default placeholder image in public folder
  }));

  if (loading) {
    return (
      <section className="flex items-center justify-center h-screen bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="relative w-14 h-14">
            <div className="absolute inset-0 border-4 border-gray-300 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-t-[#d4af37] border-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-lg font-semibold text-[#1e3a8a]">Loading Articles...</p>
        </div>
      </section>
    );
  }

  return (
    <div>
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-[#fcc100] to-[#ffde23] text-black py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-6xl mb-6 text-[#00217c] font-bold">Latest Insights</h1>
          <p className="text-xl md:text-2xl opacity-90 max-w-3xl text-[#001d6d]">
            Stay updated with the latest news, insights, and trends in real estate from industry experts.
          </p>
        </div>
      </div>

      {/* All Articles */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayPosts.map((post, index) => (
              <article key={index} className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden group">
                <div className="relative aspect-4/3  overflow-hidden bg-black">
                 {post.image && ( // post.image is truthy (not null, not undefined, not an empty string)
              <img
                src={post.image.startsWith("http") 
                  ? post.image 
                  : `${SERVER_URL}${post.image}`
                }
                // An error handler to catch cases where the image fails to load after this check
                onError={(e) => {
                  console.error("Image failed to load:", e.target.src);
                  e.target.style.display = 'none'; // Optionally hide the broken image
                  // Or set a default image:
                  // e.target.src = '/path/to/default/image.jpg';
                }}
                alt={post.name || "Insights Image"} // Provide a fallback alt text
                className="w-full h-full object-fit object-center hover:scale-110 transition-transform duration-300"
              />
            )}
            {/* Show a placeholder if mainImage is null */}
            
            {!post.image && (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500">No Image Available</span>
              </div>
            )}
                  <div className="absolute top-4 left-4">
                    <span className="bg-[#d4af37] text-black px-3 py-1 rounded-full text-sm font-medium">
                      {post.category}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl mb-3 text-[#1e3a8a] group-hover:text-[#d4af37] transition-colors duration-300 line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-3 text-md">
                    {post.excerpt}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
