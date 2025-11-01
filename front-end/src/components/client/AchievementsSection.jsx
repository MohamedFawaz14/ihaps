import React, { useState, useEffect, useRef } from 'react';
import { Award, Building2, Users, TrendingUp, Trophy } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';

export default function AchievementsSection() {
  const [counters, setCounters] = useState({});
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const sectionRef = useRef(null);

  const SERVER_URL = import.meta.env.VITE_SERVER_URL;
  const iconMap = {
    Trophy: <Trophy className="w-8 h-8" />,
    Users: <Users className="w-8 h-8" />,
    Building2: <Building2 className="w-8 h-8" />,
    Award: <Award className="w-8 h-8" />,
    TrendingUp: <TrendingUp className="w-8 h-8" />,
  };

  const fetchAchievements = async () => {
    try {
      const res = await axios.get(`${SERVER_URL}/achievements`);
      if (Array.isArray(res.data)) {
          setAchievements(res.data);
        } 
    } catch (err) {
      toast.error('Failed to fetch achievements!',err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAchievements();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && achievements.length > 0) animateCounters();
      },
      { threshold: 0.3 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [achievements]);

  const animateCounters = () => {
    achievements.forEach((achievement, index) => {
      let targetNumber = parseFloat(achievement.value);
      if (achievement.suffix.includes('M+')) targetNumber *= 1000000;
      else if (achievement.suffix.includes('K+')) targetNumber *= 1000;

      let current = 0;
      const increment = targetNumber / 60;

      const timer = setInterval(() => {
        current += increment;
        if (current >= targetNumber) {
          current = targetNumber;
          clearInterval(timer);
        }
        setCounters(prev => ({ ...prev, [index]: Math.floor(current) }));
      }, 40);
    });
  };

  const formatNumber = (num, suffix) => {
    if (!num) return '0';
    if (suffix.includes('M+')) return `${(num / 1000000).toFixed(1)}M+`;
    if (suffix.includes('K+')) return `${Math.floor(num / 1000)}K+`;
    if (suffix.includes('+')) return `${num}+`;
    return num.toString();
  };

  return (
    <section
      id="achievements-section"
      className="py-20 bg-gradient-to-br from-gray-50 via-white to-gray-50 relative overflow-hidden"
      ref={sectionRef}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="bg-gradient-to-r from-[#d4af37] to-[#ffd700] text-black px-6 py-2 rounded-full text-sm font-medium inline-block mb-4">
            Our Success
          </span>
          <h2 className="text-4xl md:text-6xl mb-6 text-[#1e3a8a] font-bold">
            Achievements That
            <span className="block text-transparent bg-gradient-to-r from-[#d4af37] to-[#ffd700] bg-clip-text">
              Define Excellence
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Over two decades of unwavering commitment to delivering exceptional real estate experiences 
            and building lasting relationships with our valued customers.
          </p>
        </div>

        {/* Loader */}
        {loading ? (
          <div className="flex justify-center items-center h-48">
            <div className="w-12 h-12 border-4 border-[#d4af37] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : achievements.length === 0 ? (
          <div className="text-center text-gray-500 text-xl py-10">
            🚫 No Achievements Available
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {achievements.map((achievement, index) => (
              <div
                key={achievement.id}
                className="group relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 overflow-hidden"
              >
                {/* Icon */}
                <div className="mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#d4af37] to-[#ffd700] rounded-2xl flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    {iconMap[achievement.icon] || <Building2 className="w-8 h-8" />}
                  </div>
                </div>

                {/* Number & Label */}
                <div className="mb-4">
                  <h3 className="text-4xl font-bold text-[#1e3a8a] mb-2">
                    {formatNumber(counters[index], achievement.suffix)}
                  </h3>
                  <p className="text-lg font-semibold text-gray-800">{achievement.label}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
