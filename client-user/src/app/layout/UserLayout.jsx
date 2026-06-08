import React, { useState, useRef, useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Leaf, Map, FlaskConical, Calculator, Menu, X, UserCircle, LogOut, ChevronDown } from 'lucide-react';
import { useAuthStore } from '../../features/auth/store/authStore';
import imgLogo from '../../assets/smartGrowGt_Logo.png';
import defaultAvatarImg from '../../assets/user_icon.png';

export const UserLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const navItems = [
    { name: 'Mis Parcelas', path: '/fields', icon: <Map size={20} /> },
    { name: 'Cultivos', path: '/crops', icon: <Leaf size={20} /> },
    { name: 'Fertilizantes', path: '/fertilizers', icon: <FlaskConical size={20} /> },
    { name: 'Recomendaciones', path: '/recommendations', icon: <Calculator size={20} /> },
  ];

  const handleLogout = () => {
    logout();
    navigate("/auth", { replace: true });
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const avatarSrc = user?.profilePincture && user.profilePincture.trim() !== ""
    ? user.profilePincture
    : defaultAvatarImg;

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 flex flex-col font-sans w-full">
      {/* Top Navbar */}
      <nav className="bg-slate-900/40 backdrop-blur-xl border-b border-white/5 sticky top-0 z-40 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            
            {/* Logo + título (SmartGrowGT style) */}
            <div className="flex items-center gap-4 group cursor-pointer" onClick={() => navigate('/crops')}>
                <div className="relative">
                    <img
                        src={imgLogo}
                        alt="SmartGrowGt Logo"
                        className="h-12 w-auto object-contain transition-transform group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full -z-10" />
                </div>
                <div className="flex flex-col">
                    <h1 className="hidden lg:flex items-center gap-2 font-black text-white text-lg tracking-tighter uppercase">
                        SmartGrowGT
                        <span className="text-emerald-500 font-light">| App</span>
                    </h1>
                    <p className="hidden lg:block text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] -mt-1">
                        Sistema de Control Agrícola
                    </p>
                </div>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex space-x-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${isActive
                      ? 'bg-white/10 text-white'
                      : 'text-gray-300 hover:bg-white/5 hover:text-white'
                    }`
                  }
                >
                  {item.icon}
                  {item.name}
                </NavLink>
              ))}
            </div>

            {/* Profile Dropdown */}
            <div className="hidden md:flex items-center gap-4" ref={dropdownRef}>
              <div className="relative">
                <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center gap-2 p-1 rounded-full hover:bg-white/10 transition-all duration-300 focus:outline-none border border-transparent hover:border-white/20"
                >
                    <div className="relative">
                        <img
                            src={avatarSrc}
                            alt={user?.name || "User"}
                            className="w-10 h-10 rounded-full object-cover border-2 border-emerald-500/50 shadow-lg shadow-emerald-500/20"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = defaultAvatarImg;
                            }}
                        />
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-slate-900 rounded-full"></div>
                    </div>
                    <ChevronDown size={16} className={`text-slate-400 transition-transform duration-300 ${isProfileOpen ? 'rotate-180' : ''}`} />
                </button>

                {isProfileOpen && (
                    <div className="absolute right-0 mt-3 w-64 bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl animate-in fade-in zoom-in duration-200 z-50 overflow-hidden">
                        <div className="px-5 py-4 bg-white/5 border-b border-white/5">
                            <p className="font-bold text-white text-sm truncate">{user?.name || 'Usuario'}</p>
                            <p className="text-xs text-slate-400 truncate font-light">{user?.email}</p>
                        </div>
                        <ul className="p-2 space-y-1">
                            <li>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-3 w-full p-3 rounded-2xl text-rose-400 hover:bg-rose-500/20 hover:text-rose-500 transition-all duration-200 group"
                                >
                                    <LogOut size={18} className="group-hover:translate-x-1 transition-transform" />
                                    <span className="text-sm font-bold">Cerrar sesión</span>
                                </button>
                            </li>
                        </ul>
                    </div>
                )}
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-[#062452] focus:outline-none"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-[#062452] shadow-lg absolute w-full z-50">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `block px-3 py-2 rounded-md text-base font-medium flex items-center gap-3 ${isActive
                      ? 'bg-white/10 text-white'
                      : 'text-gray-300 hover:bg-white/5 hover:text-white'
                    }`
                  }
                >
                  {item.icon}
                  {item.name}
                </NavLink>
              ))}
              <div className="h-px bg-white/10 my-2"></div>
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  handleLogout();
                }}
                className="w-full text-left px-3 py-2 rounded-md text-base font-medium flex items-center gap-3 text-rose-400 hover:bg-rose-500/10"
              >
                <LogOut size={20} />
                Cerrar Sesión
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
        <Outlet />
      </main>

      <footer className="bg-[#020617] border-t border-white/5 py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-slate-500">
          &copy; {new Date().getFullYear()} SmartGrow. Todos los derechos reservados.
        </div>
      </footer>
    </div>
  );
};