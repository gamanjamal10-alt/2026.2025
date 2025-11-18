import React from 'react';
import { ShoppingCart, Store, Settings, Menu } from 'lucide-react';

interface NavbarProps {
  cartCount: number;
  toggleCart: () => void;
  isAdminMode: boolean;
  setAdminMode: (mode: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ cartCount, toggleCart, isAdminMode, setAdminMode }) => {
  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="bg-primary text-white p-2 rounded-lg">
              <Store size={24} />
            </div>
            <span className="text-xl font-bold text-secondary hidden sm:block">سوق برو</span>
          </div>

          {/* Mode Toggle (For Demo Purpose) */}
          <div className="flex bg-gray-100 p-1 rounded-lg mx-4">
            <button
              onClick={() => setAdminMode(false)}
              className={`px-4 py-1 text-sm rounded-md transition-colors ${!isAdminMode ? 'bg-white shadow text-primary font-bold' : 'text-gray-500'}`}
            >
              المتجر
            </button>
            <button
              onClick={() => setAdminMode(true)}
              className={`px-4 py-1 text-sm rounded-md transition-colors ${isAdminMode ? 'bg-white shadow text-primary font-bold' : 'text-gray-500'}`}
            >
              الإدارة
            </button>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            {!isAdminMode && (
              <button 
                onClick={toggleCart}
                className="relative p-2 text-gray-600 hover:text-primary transition-colors"
              >
                <ShoppingCart size={24} />
                {cartCount > 0 && (
                  <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full transform translate-x-1/4 -translate-y-1/4">
                    {cartCount}
                  </span>
                )}
              </button>
            )}
            
            {isAdminMode && (
               <div className="flex items-center gap-2 text-gray-500 text-sm">
                 <Settings size={18} />
                 <span className="hidden sm:inline">لوحة التحكم</span>
               </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
