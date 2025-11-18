import React, { useState } from 'react';
import { Product } from '../types.ts';
import { X, ShoppingBag, Check } from 'lucide-react';

interface ProductDetailsProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product, size?: string, color?: string) => void;
}

export const ProductDetails: React.FC<ProductDetailsProps> = ({ product, isOpen, onClose, onAddToCart }) => {
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');

  if (!isOpen) return null;

  const handleAddToCart = () => {
    // If product has sizes/colors, require selection
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
        alert('يرجى اختيار المقاس');
        return;
    }
    // Basic color validation logic (if strictly needed)
    // if (product.colors && product.colors.length > 0 && !selectedColor) ...

    onAddToCart(product, selectedSize, selectedColor);
    onClose();
    setSelectedSize('');
    setSelectedColor('');
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative z-10 flex flex-col md:flex-row shadow-2xl animate-fade-in">
        
        <button 
          onClick={onClose}
          className="absolute top-4 left-4 p-2 bg-white/80 rounded-full hover:bg-gray-100 z-20"
        >
          <X size={24} />
        </button>

        {/* Image Side */}
        <div className="w-full md:w-1/2 h-64 md:h-auto bg-gray-100 relative">
           <img 
             src={product.image} 
             alt={product.name} 
             className="w-full h-full object-cover"
           />
        </div>

        {/* Details Side */}
        <div className="w-full md:w-1/2 p-8 flex flex-col">
           <span className="text-sm text-gray-500 mb-2">{product.category}</span>
           <h2 className="text-3xl font-bold text-secondary mb-4">{product.name}</h2>
           <p className="text-2xl font-bold text-primary mb-6">{product.price.toLocaleString()} د.ج</p>
           
           <div className="prose text-gray-600 mb-8 text-sm leading-relaxed">
             {product.description || 'لا يوجد وصف متاح لهذا المنتج.'}
           </div>

           {/* Variants */}
           <div className="space-y-6 mb-8">
             {product.sizes && product.sizes.length > 0 && (
               <div>
                 <span className="block text-sm font-bold text-gray-900 mb-2">المقاس:</span>
                 <div className="flex flex-wrap gap-2">
                   {product.sizes.map(size => (
                     <button
                       key={size}
                       onClick={() => setSelectedSize(size)}
                       className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${selectedSize === size ? 'border-primary bg-primary/10 text-primary' : 'border-gray-200 hover:border-gray-300'}`}
                     >
                       {size}
                     </button>
                   ))}
                 </div>
               </div>
             )}

             {product.colors && product.colors.length > 0 && (
                <div>
                  <span className="block text-sm font-bold text-gray-900 mb-2">اللون:</span>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map(color => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${selectedColor === color ? 'border-primary' : 'border-transparent'}`}
                        style={{backgroundColor: color}} // Assuming color is hex, or use class mapping
                        title={color}
                      >
                        {selectedColor === color && <Check size={14} className="text-white drop-shadow-md" />}
                      </button>
                    ))}
                  </div>
                </div>
             )}
           </div>

           <div className="mt-auto pt-4 border-t">
             <button
               onClick={handleAddToCart}
               className="w-full bg-secondary text-white py-4 rounded-xl font-bold text-lg hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-secondary/20"
             >
               <ShoppingBag />
               إضافة للسلة
             </button>
           </div>
        </div>
      </div>
    </div>
  );
};