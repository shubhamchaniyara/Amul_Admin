import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Users, Package, FileText, ShoppingCart } from 'lucide-react';

const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { id: 'customer', name: 'Customer', icon: Users, path: '/customer' },
    { id: 'manufacturing', name: 'Manufacturing', icon: Package, path: '/manufacturing' },
    { id: 'record', name: 'Record', icon: FileText, path: '/record' },
    { id: 'sell', name: 'Sell', icon: ShoppingCart, path: '/sell' }
  ];

  const getActiveModule = () => {
    const path = location.pathname;
    if (path.includes('/customer')) return 'customer';
    if (path.includes('/manufacturing')) return 'manufacturing';
    if (path.includes('/record')) return 'record';
    if (path.includes('/sell')) return 'sell';
    return 'customer';
  };

  const activeModule = getActiveModule();

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="w-full max-w-full mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-white to-slate-50 rounded-2xl shadow-lg border border-slate-200 mb-6 p-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-3 shadow-lg">
                <Users className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-800">Amul Commodity</h1>
              </div>
            </div>
            
            {/* Navigation Menu */}
            <div className="flex items-center space-x-1 bg-slate-100 rounded-2xl p-2 shadow-inner">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeModule === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavigation(item.path)}
                    className={`flex items-center space-x-2 px-4 py-3 rounded-xl font-semibold transition-all duration-300 ${
                      isActive
                        ? 'bg-white text-blue-600 shadow-lg transform scale-105'
                        : 'text-slate-600 hover:text-slate-800 hover:bg-slate-50 hover:scale-105'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="hidden sm:inline">{item.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Page Content */}
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
