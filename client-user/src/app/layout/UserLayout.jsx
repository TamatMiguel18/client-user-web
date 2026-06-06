import React, { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { Leaf, Map, FlaskConical, Calculator, Menu, X, UserCircle } from 'lucide-react';

export const UserLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { name: 'Cultivos', path: '/crops', icon: <Leaf size={20} /> },
    { name: 'Fertilizantes', path: '/fertilizers', icon: <FlaskConical size={20} /> },
    { name: 'Recomendaciones', path: '/recommendations', icon: <Calculator size={20} /> },
    { name: 'Mis Parcelas', path: '/fields', icon: <Map size={20} /> },
  ];

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 flex flex-col font-sans w-full">
      {/* Top Navbar */}
      <nav className="bg-slate-900/40 backdrop-blur-xl border-b border-white/5 sticky top-0 z-40 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <Leaf className="text-green-400" />
              <span className="font-bold text-xl tracking-tight">SmartGrow</span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex space-x-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
                      isActive 
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

            {/* Profile Dropdown (Mock) */}
            <div className="hidden md:flex items-center gap-2 text-sm text-gray-200">
              <span>Hola, Usuario</span>
              <UserCircle size={24} />
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
          <div className="md:hidden bg-[#062452] shadow-lg absolute w-full">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `block px-3 py-2 rounded-md text-base font-medium flex items-center gap-3 ${
                      isActive 
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
