import React from 'react';
import { CartItem } from '../types';
import { X, Trash2, MapPin } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  removeFromCart: (id: string) => void;
}

const ShoppingBagIcon = ({size}: {size: number}) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
    <line x1="3" y1="6" x2="21" y2="6"></line>
    <path d="M16 10a4 4 0 0 1-8 0"></path>
  </svg>
);

export const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose, cart, removeFromCart }) => {
  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const shipping = 400; // Fixed for demo
  const total = subtotal + shipping;

  return (
    <div className={`fixed inset-0 z-[70] transition-visibility duration-300 ${isOpen ? 'visible' : 'invisible'}`}>
      <div 
        className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
      ></div>
      <div className={`absolute top-0 left-0 h-full w-full max-w-md bg-white shadow-2xl transform transition-transform duration-300 ease-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        
        <div className="flex flex-col h-full">
          <div className="p-5 border-b flex justify-between items-center bg-gray-50">
            <h2 className="text-xl font-bold text-gray-800">سلة المشتريات ({cart.length})</h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
              <X size={24} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-400 space-y-4">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
                  <ShoppingBagIcon size={32} />
                </div>
                <p>السلة فارغة</p>
                <button onClick={onClose} className="text-primary font-bold hover:underline">تصفح المنتجات</button>
              </div>
            ) : (
              cart.map((item, idx) => (
                <div key={`${item.id}-${idx}`} className="flex gap-4 bg-white border border-gray-100 p-3 rounded-xl shadow-sm">
                  <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-lg bg-gray-100" />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-gray-800 text-sm line-clamp-1">{item.name}</h3>
                      <div className="text-xs text-gray-500 mt-1">
                        {item.selectedSize && <span className="bg-gray-100 px-1 rounded ml-1">{item.selectedSize}</span>}
                        {item.selectedColor && <span className="bg-gray-100 px-1 rounded">{item.selectedColor}</span>}
                      </div>
                    </div>
                    <div className="flex justify-between items-end">
                      <span className="font-bold text-primary">{item.price.toLocaleString()} د.ج</span>
                      <button onClick={() => removeFromCart(item.id)} className="text-red-400 hover:text-red-600">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {cart.length > 0 && (
            <div className="p-6 bg-gray-50 border-t">
              <div className="space-y-2 mb-4 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>المجموع الفرعي</span>
                  <span>{subtotal.toLocaleString()} د.ج</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>التوصيل (تقديري)</span>
                  <span>{shipping.toLocaleString()} د.ج</span>
                </div>
                <div className="border-t pt-2 flex justify-between font-bold text-lg text-gray-900">
                  <span>الإجمالي</span>
                  <span>{total.toLocaleString()} د.ج</span>
                </div>
              </div>
              
              <button className="w-full bg-primary text-white py-3 rounded-xl font-bold shadow-lg hover:bg-emerald-600 transition-colors flex items-center justify-center gap-2">
                إتمام الطلب
              </button>
              <p className="text-xs text-gray-500 text-center mt-3 flex items-center justify-center gap-1">
                <MapPin size={12} />
                التوصيل متاح لـ 58 ولاية
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};