import React, { useState, useEffect } from 'react'; 
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';

export default function BlogSection() {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);

    const SERVER_URL = import.meta.env.VITE_SERVER_URL;
  const fetchInsights = async () => {
    try {
      const res = await axios.get(`${SERVER_URL}/insights`);
      setInsights(res.data || []);
    } catch (err) {
      toast.error('Failed to fetch insights!', err);
      setInsights([]); // ensure insights is always an array
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, []);

  if (loading) {
    return (
      <section className="flex items-center justify-center h-screen bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="relative w-14 h-14">
            <div className="absolute inset-0 border-4 border-gray-300 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-t-[#d4af37] border-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-lg font-semibold text-[#1e3a8a]">Loading Insights...</p>
        </div>
      </section>
    );
  }

 const displayInsights = Array.isArray(insights) && insights.length
  ? insights
  : Array.from({ length: 3 }, () => ({
      title: 'No Insights Yet',
      description: 'We’ll post updates soon.',
    }));


  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl mb-6 text-[#1e3a8a]">
            Latest Insights
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Stay updated with the latest real estate trends, investment tips, and market insights from our experts.
          </p>
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {displayInsights.map((post, index) => (
            <article 
              key={index}
              className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden group"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
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
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
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

              {/* Content */}
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

        {/* View All Button */}
        <div className="text-center">
          <Link 
            to="/blog"
            className="inline-flex items-center 
                       bg-gradient-to-r from-[#002292] to-[#2176ff] 
                       text-[#fac823] font-semibold 
                       px-8 py-4 rounded-lg 
                       transition-all duration-200 
                       transform hover:scale-105 
                       shadow-lg hover:text-white"
          >
            View All Articles
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </div>
      </div>
    </section>
  );
}
