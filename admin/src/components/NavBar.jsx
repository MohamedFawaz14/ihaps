import React, { useState, useEffect ,UseNavigate} from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Home, Building2, Trophy, MessageSquare, Briefcase, BookOpen, LogOut, Menu, X } from "lucide-react";

export default function NavBar() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(true);
  const navigate = useNavigate();
  

  const navItems = [
    { href: "/dashboard", icon: Home, label: "Carousel & Gallery" },
    { href: "/projects", icon: Building2, label: "Projects" },
    { href: "/achievements", icon: Trophy, label: "Achievements" },
    { href: "/testimonials", icon: MessageSquare, label: "Testimonials" },
    { href: "/services", icon: Briefcase, label: "Services" },
    { href: "/insights", icon: BookOpen, label: "Insights" },
  ];

  const handleLogout = () => {
  localStorage.removeItem("isAuthenticated");
  navigate("/admin");
   };
  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 md:hidden p-2 rounded-lg bg-yellow-300 text-white shadow-lg border-2 border-white"
        aria-label="Toggle navigation"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`${
          isOpen ? "translate-x-0 " : "-translate-x-full"
        } md:translate-x-0 fixed md:static inset-y-0 left-0 z-40 w-80 bg-yellow-400 text-white flex flex-col h-full transition-transform duration-300 ease-in-out`}
      >
        <div className="p-6 border-b border-white/20 mt-10">
          <h2 className="text-xl font-bold">Ikhlas Admin</h2>
          <p className="text-sm text-white">Management Platform</p>
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
                  isActive ? "bg-accent text-primary" : "text-white"
                }`}
              >
                <Icon className="w-5 h-5 mr-3" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/20">
          <button className="w-full flex items-center justify-center px-4 py-2 rounded-md border border-white/20 hover:bg-white/10 transition-colors"
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