
import React, { useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { 
  Menu, 
  X, 
  Radar,
  Home,
  Calendar,
  MapPin,
  Plane,
  Book,
  Bell,
  Phone
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();
  const location = useLocation();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const navigationItems = [
    { path: "/", label: "Home", icon: Home },
    { path: "/flight-schedule", label: "Flight Schedule", icon: Calendar },
    { path: "/live-flight-tracker", label: "Live Tracker", icon: MapPin },
    { path: "/airports-airlines", label: "Airports & Airlines", icon: Plane },
    { path: "/aviation-info", label: "AviationInfo", icon: Book },
    { path: "/flight-alerts", label: "Flight Alerts", icon: Bell },
    { path: "/contact", label: "Contact", icon: Phone }
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-dark/80 backdrop-blur-lg border-b border-white/5">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo Section with Updated Styling */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-[#8B0000] to-[#A80000] rounded-lg flex items-center justify-center">
              <Radar className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-wide">
              <span className="text-white font-extrabold">ASAP</span>{" "}
              <span className="text-[#8B0000] font-extrabold">Tracker</span>
            </span>
          </Link>

          {/* Desktop Navigation - Centered */}
          <nav className="hidden md:flex items-center justify-center flex-1 space-x-4 px-4 mx-4">
            {navigationItems.map(({ path, label, icon: Icon }) => (
              <NavLink
                key={path}
                to={path}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-[15px] text-sm font-medium transition-all flex items-center gap-2 ${
                    isActive
                      ? "bg-[#A80000] text-white shadow-[0_0_8px_#A80000]"
                      : "bg-[#8B0000] text-white hover:bg-[#A80000] hover:shadow-[0_0_8px_#A80000]"
                  }`
                }
              >
                <Icon className="h-4 w-4" /> {label}
              </NavLink>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMenu}
              className={isMobile ? "visible" : "hidden"}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <div className={`md:hidden ${isOpen ? "block" : "hidden"}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-dark/90 shadow-lg border-y border-white/5">
          {navigationItems.map(({ path, label, icon: Icon }) => (
            <Link
              key={path}
              to={path}
              className={`block px-4 py-2 rounded-[15px] text-base font-medium flex items-center gap-2 ${
                location.pathname === path
                  ? "bg-[#A80000] text-white shadow-[0_0_8px_#A80000]"
                  : "bg-[#8B0000] text-white hover:bg-[#A80000] hover:shadow-[0_0_8px_#A80000]"
              }`}
              onClick={() => setIsOpen(false)}
            >
              <Icon className="h-4 w-4" /> {label}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
};

export default Header;
