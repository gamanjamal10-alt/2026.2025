import React from 'react';
import { Product } from '../types';
import { Plus, Eye } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onOpen: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onOpen }) => {
  return (
    <div className="group bg-white rounded-2xl shadow-sm hover:shadow-md border border-gray-100 overflow-hidden transition-all duration-300">
      <div className="relative aspect-[4/5] overflow-hidden bg-gray-100">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Overlay Buttons */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-[2px]">
          <button 
            onClick={() => onOpen(product)}
            className="bg-white text-secondary p-3 rounded-full hover:bg-primary hover:text-white transition-colors shadow-lg transform translate-y-4 group-hover:translate-y-0 duration-300"
          >
            <Eye size={20} />
          </button>
        </div>
        
        {product.stock < 5 && product.stock > 0 && (
             <span className="absolute top-2 right-2 bg-orange-100 text-orange-700 text-xs font-bold px-2 py-1 rounded-md">
                 كمية محدودة
             </span>
        )}
        {product.stock === 0 && (
             <span className="absolute top-2 right-2 bg-red-100 text-red-700 text-xs font-bold px-2 py-1 rounded-md">
                 نفذت الكمية
             </span>
        )}
      </div>

      <div className="p-4">
        <div className="text-xs text-gray-500 mb-1">{product.category}</div>
        <h3 className="font-bold text-gray-800 mb-1 truncate">{product.name}</h3>
        <div className="flex items-center justify-between mt-3">
          <span className="text-lg font-bold text-primary">{product.price.toLocaleString()} د.ج</span>
          <button 
             onClick={() => onOpen(product)}
             className="text-sm text-gray-600 hover:text-primary underline"
          >
            تفاصيل
          </button>
        </div>
      </div>
    </div>
  );
};
