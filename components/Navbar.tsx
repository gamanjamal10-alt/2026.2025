
import React from 'react';
import { ShoppingCart, Store, Settings, LogOut, Lock } from 'lucide-react';

interface NavbarProps {
  cartCount: number;
  toggleCart: () => void;
  isAdminMode: boolean;
  onAdminClick: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ cartCount, toggleCart, isAdminMode, onAdminClick, onLogout }) => {
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

          {/* Actions */}
          <div className="flex items-center gap-4">
            
            {/* Admin Mode - Only show Controls if logged in */}
            {isAdminMode && (
              <div className="flex items-center gap-2">
                 <div className="flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-bold">
                   <Settings size={16} />
                   <span>لوحة التحكم</span>
                 </div>
                 <button
                  onClick={onLogout}
                  className="text-gray-500 hover:text-red-500 p-2 transition-colors"
                  title="تسجيل خروج"
                 >
                   <LogOut size={20} />
                 </button>
              </div>
            )}

            {/* Cart Button (Only in Store Mode) */}
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
          </div>
        </div>
      </div>
    </nav>
  );
};
