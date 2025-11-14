import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  Building2,
  Trophy,
  MessageSquare,
  Briefcase,
  BookOpen,
  LogOut,
  Menu,
  X,
  Settings,
} from "lucide-react";

export default function NavBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const sidebarRef = useRef(null);
  const toggleButtonRef = useRef(null);
  const userRole = localStorage.getItem("role"); // check role

  // Auto-show sidebar on large screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsOpen(true);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Handle click outside to close sidebar on mobile
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Only handle on mobile screens
      if (window.innerWidth >= 768) return;
      
      // Check if click is outside sidebar and toggle button
      if (
        isOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        toggleButtonRef.current &&
        !toggleButtonRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    // Add event listener
    document.addEventListener("mousedown", handleClickOutside);
    
    // Cleanup
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const navItems = [
    { href: "/dashboard", icon: Home, label: "Carousel & Gallery" },
    { href: "/projects", icon: Building2, label: "Projects" },
    { href: "/achievements", icon: Trophy, label: "Achievements" },
    { href: "/testimonials", icon: MessageSquare, label: "Testimonials" },
    { href: "/services", icon: Briefcase, label: "Services" },
    { href: "/insights", icon: BookOpen, label: "Insights" },
  ];

  // Add master-only option
  if (userRole === "master") {
    navItems.push({ href: "/manage-users", icon: Settings, label: "Manage Users" });
  }

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("role");
    navigate("/");
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        ref={toggleButtonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 md:hidden p-2 rounded-lg bg-yellow-500 text-white shadow-lg border border-white"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={`${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 fixed md:static inset-y-0 left-0 z-40 w-72 bg-yellow-500 text-white flex flex-col h-full transition-transform duration-300 ease-in-out shadow-lg`}
      >
        <div className="p-6 border-b border-white/20 mt-10 md:mt-0">
          <h2 className="text-xl font-bold">Ikhlas Admin</h2>
          <p className="text-sm text-white/90">
            {userRole === "master" ? "Master Panel" : "User Panel"}
          </p>
        </div>

        <nav className="flex-1 p-4 overflow-y-auto space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => {
                  if (window.innerWidth < 768) setIsOpen(false);
                }}
                className={`flex items-center px-4 py-3 rounded-lg hover:bg-white/10 transition-colors ${
                  isActive ? "bg-white/20" : ""
                }`}
              >
                <Icon className="w-5 h-5 mr-3" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/20">
          <button
            className="w-full flex items-center justify-center px-4 py-2 rounded-md border border-white/20 hover:bg-white/10 transition-colors"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </button>
        </div>
      </div>
    </>
  );
}