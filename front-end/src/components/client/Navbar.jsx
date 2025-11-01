import React, { useState, useEffect } from 'react';
import { Menu, ArrowLeft, Home } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import companyLogo from 'figma:asset/935660fb2fffb3e2710d12bdd38cf9a7b950add5.png';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { name: 'HOME', href: '/' },
    { name: 'ABOUT US', href: '/about' },
    { name: 'PROJECTS', href: '/projects' },
    { name: 'INSIGHTS', href: '/blog' },
    { name: 'GALLERY', href: '/gallery' },
  ];

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : 'unset';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  const handleGoHome = () => {
    setIsMenuOpen(false);
    navigate('/');
  };

  return (
    <>
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(true)}
                className="p-2 rounded-md hover:bg-gray-100 transition-colors duration-200"
              >
                <Menu className="h-6 w-6 text-gray-700" />
              </button>
            </div>

            {/* Logo */}
            <div className="flex-shrink-0">
              <Link to="/">
                <img
                  src={companyLogo}
                  alt="Ikhlas Housing & Properties"
                  className="h-10 w-auto"
                />
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6 ml-10">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`px-3 py-2 transition-colors duration-200 font-medium ${
                    location.pathname === item.href
                      ? 'text-yellow-600 border-b-2 border-yellow-600'
                      : 'text-gray-900 hover:text-yellow-600'
                  }`}
                >
                  {item.name}
                </Link>
              ))}

              {/* Enquiry Now Button - Desktop */}
              <Link
                to="/enquiry"
                className="inline-flex items-center 
                  bg-gradient-to-r from-[#001868] to-[#1159cc] 
                  text-[#ffda0a] font-semibold 
                  px-6 py-2.5 rounded-md 
                  transition-all duration-200 
                  transform hover:scale-105 
                  shadow-md"
              >
                Enquiry Now
              </Link>
            </div>

            {/* Placeholder for mobile to center logo */}
            <div className="md:hidden w-10"></div>
          </div>
        </div>
      </nav>

      {/* Mobile Slide-in Drawer */}
      {isMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden"
            onClick={() => setIsMenuOpen(false)}
          />

          {/* Drawer */}
          <div
            className={`fixed top-0 left-0 h-full w-80 bg-white z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
              isMenuOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
          >
            <div className="flex flex-col h-full">
              {/* Header with Logo */}
              <div className="p-6 border-b border-gray-100">
                <Link to="/">
                <img
                  src={companyLogo}
                  alt="Ikhlas Housing & Properties"
                  className="h-10 w-auto"
                />
              </Link>
              </div>

              {/* Navigation Items */}
              <div className="flex-1 pt-4">
                <nav className="px-0">
                  {navItems.map((item, index) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`block px-8 py-4 transition-all duration-200 border-b border-gray-100 font-medium ${
                        location.pathname === item.href
                          ? 'bg-yellow-50 text-yellow-600 border-l-4 border-l-yellow-600'
                          : 'text-gray-800 hover:bg-gray-50 hover:text-yellow-600'
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                      style={{
                        animationDelay: `${index * 50}ms`,
                        animation: isMenuOpen ? 'slideInLeft 0.3s ease-out forwards' : 'none',
                      }}
                    >
                      <span className="tracking-wide">{item.name}</span>
                    </Link>
                  ))}
                </nav>
              </div>

              {/* Enquiry Now Button - Mobile */}
              <div className="px-6 pb-4">
                <Link
                  to="/enquiry"
                  onClick={() => setIsMenuOpen(false)}
                  className="w-full inline-flex justify-center items-center 
                    bg-gradient-to-r from-blue-950 to-blue-900 
                    text-[#Ffd700] font-semibold 
                    px-6 py-2.5 rounded-md 
                    transition-all duration-200 
                    transform hover:scale-105 
                    shadow-md"
                >
                  Enquiry Now
                </Link>
              </div>

              {/* Footer with Home and Close buttons */}
              <div className="p-6 border-t border-gray-100 flex justify-between items-center">
                <button
                  onClick={handleGoHome}
                  className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 transition-all duration-200"
                  title="Go to Home"
                >
                  <Home className="h-6 w-6 text-black" />
                </button>

                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center justify-center w-12 h-12 rounded-full hover:bg-gray-100 transition-colors duration-200"
                  title="Close Menu"
                >
                  <ArrowLeft className="h-6 w-6 text-gray-700" />
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* CSS Animation Styles */}
      <style>{`
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </>
  );
}
