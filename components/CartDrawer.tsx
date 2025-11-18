
import React, { useState } from 'react';
import { CartItem, ShippingZone } from '../types.ts';
import { X, Trash2, CheckCircle, ArrowRight, Loader2 } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  removeFromCart: (id: string) => void;
  shippingZones: ShippingZone[];
  onClearCart: () => void;
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

export const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose, cart, removeFromCart, shippingZones, onClearCart }) => {
  const [step, setStep] = useState<'cart' | 'checkout' | 'success'>('cart');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checkoutForm, setCheckoutForm] = useState({
    name: '',
    phone: '',
    wilayaId: '',
    address: ''
  });

  const selectedZone = shippingZones.find(z => z.id === checkoutForm.wilayaId);
  const shippingCost = selectedZone ? selectedZone.price : 0;
  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const total = subtotal + shippingCost;

  const handleCompleteOrder = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!checkoutForm.wilayaId) {
        alert('يرجى اختيار الولاية لحساب سعر التوصيل');
        return;
    }

    setIsSubmitting(true);

    // Simulate API call / Order processing
    setTimeout(() => {
        console.log('Order submitted:', { cart, customer: checkoutForm, total });
        setIsSubmitting(false);
        setStep('success');
    }, 1500);
  };

  const resetAndClose = () => {
    // If we are closing after a success, clear the cart now
    if (step === 'success') {
        onClearCart();
    }
    
    // Small delay to allow drawer to close before resetting state visually
    onClose();
    setTimeout(() => {
        setStep('cart');
        setCheckoutForm({ name: '', phone: '', wilayaId: '', address: '' });
    }, 300);
  };

  return (
    <div className={`fixed inset-0 z-[70] transition-visibility duration-300 ${isOpen ? 'visible' : 'invisible'}`}>
      <div 
        className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
        onClick={resetAndClose}
      ></div>
      <div className={`absolute top-0 left-0 h-full w-full max-w-md bg-white shadow-2xl transform transition-transform duration-300 ease-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        
        <div className="flex flex-col h-full">
          <div className="p-5 border-b flex justify-between items-center bg-gray-50">
            <h2 className="text-xl font-bold text-gray-800">
              {step === 'cart' && `سلة المشتريات (${cart.length})`}
              {step === 'checkout' && 'معلومات التوصيل'}
              {step === 'success' && 'تم الطلب بنجاح'}
            </h2>
            <button onClick={resetAndClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
              <X size={24} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-5">
            
            {/* --- Step 1: Cart Items --- */}
            {step === 'cart' && (
              <div className="space-y-4">
                {cart.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-64 text-gray-400 space-y-4">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
                      <ShoppingBagIcon size={32} />
                    </div>
                    <p>السلة فارغة</p>
                    <button onClick={resetAndClose} className="text-primary font-bold hover:underline">تصفح المنتجات</button>
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
                          <div className="flex items-center gap-2">
                             <span className="text-xs text-gray-400">x{item.quantity}</span>
                             <button onClick={() => removeFromCart(item.id)} className="text-red-400 hover:text-red-600">
                               <Trash2 size={18} />
                             </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* --- Step 2: Checkout Form --- */}
            {step === 'checkout' && (
              <form id="checkout-form" onSubmit={handleCompleteOrder} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">الاسم الكامل</label>
                  <input 
                    required 
                    type="text" 
                    placeholder="أدخل اسمك الثلاثي"
                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-primary outline-none"
                    value={checkoutForm.name}
                    onChange={e => setCheckoutForm({...checkoutForm, name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">رقم الهاتف</label>
                  <input 
                    required 
                    type="tel" 
                    placeholder="05XXXXXXXX"
                    pattern="[0-9]{10}"
                    title="يرجى إدخال رقم هاتف صحيح مكون من 10 أرقام"
                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-primary outline-none"
                    value={checkoutForm.phone}
                    onChange={e => setCheckoutForm({...checkoutForm, phone: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">الولاية (الشحن)</label>
                  <div className="relative">
                    <select 
                        required 
                        className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-primary outline-none bg-white appearance-none"
                        value={checkoutForm.wilayaId}
                        onChange={e => setCheckoutForm({...checkoutForm, wilayaId: e.target.value})}
                    >
                        <option value="" disabled>اختر الولاية...</option>
                        {shippingZones.map(zone => (
                        <option key={zone.id} value={zone.id}>
                            {zone.wilaya} - {zone.price} د.ج
                        </option>
                        ))}
                    </select>
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-500">
                        <ArrowRight size={14} className="rotate-90" />
                    </div>
                  </div>
                  {shippingZones.length === 0 && (
                      <p className="text-xs text-red-500 mt-1">لا توجد مناطق شحن مضافة حالياً. يرجى الاتصال بالدعم.</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">العنوان بالتفصيل</label>
                  <textarea 
                    required 
                    rows={2}
                    placeholder="البلدية، الحي، رقم المنزل..."
                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-primary outline-none"
                    value={checkoutForm.address}
                    onChange={e => setCheckoutForm({...checkoutForm, address: e.target.value})}
                  ></textarea>
                </div>
              </form>
            )}

            {/* --- Step 3: Success --- */}
            {step === 'success' && (
              <div className="flex flex-col items-center justify-center h-full text-center space-y-6 animate-fade-in">
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-4 animate-bounce">
                  <CheckCircle size={48} />
                </div>
                <h3 className="text-2xl font-bold text-gray-800">شكراً لطلبك!</h3>
                <p className="text-gray-500 max-w-xs">تم استلام طلبك بنجاح. سيتصل بك فريقنا قريباً لتأكيد الطلب والتوصيل.</p>
                <div className="w-full p-4 bg-gray-50 rounded-xl border border-gray-100 text-right text-sm space-y-2">
                    <p><strong>الاسم:</strong> {checkoutForm.name}</p>
                    <p><strong>الولاية:</strong> {selectedZone?.wilaya}</p>
                    <p><strong>المبلغ الإجمالي:</strong> <span className="text-primary font-bold">{total.toLocaleString()} د.ج</span></p>
                </div>
                <button onClick={resetAndClose} className="bg-primary text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:bg-emerald-600 w-full">
                  العودة للمتجر
                </button>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          {step !== 'success' && cart.length > 0 && (
            <div className="p-6 bg-gray-50 border-t shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-20">
              <div className="space-y-2 mb-4 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>المجموع الفرعي</span>
                  <span>{subtotal.toLocaleString()} د.ج</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>التوصيل ({selectedZone?.wilaya || 'غير محدد'})</span>
                  <span className={shippingCost > 0 ? "text-gray-800" : "text-gray-400"}>
                    {step === 'checkout' ? (shippingCost > 0 ? `${shippingCost} د.ج` : 'مجاني') : '--'}
                  </span>
                </div>
                <div className="border-t pt-2 flex justify-between font-bold text-lg text-gray-900">
                  <span>الإجمالي</span>
                  <span>{step === 'checkout' ? total.toLocaleString() : subtotal.toLocaleString()} د.ج</span>
                </div>
              </div>
              
              {step === 'cart' ? (
                <button 
                  onClick={() => setStep('checkout')}
                  className="w-full bg-primary text-white py-3 rounded-xl font-bold shadow-lg hover:bg-emerald-600 transition-colors flex items-center justify-center gap-2"
                >
                  إتمام الطلب
                  <ArrowRight size={18} />
                </button>
              ) : (
                <div className="flex gap-2">
                  <button 
                    type="button"
                    onClick={() => setStep('cart')}
                    disabled={isSubmitting}
                    className="px-4 py-3 rounded-xl font-bold text-gray-600 bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
                  >
                    رجوع
                  </button>
                  <button 
                    type="submit"
                    form="checkout-form"
                    disabled={isSubmitting}
                    className="flex-1 bg-secondary text-white py-3 rounded-xl font-bold shadow-lg hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                        <>
                            <Loader2 size={18} className="animate-spin" />
                            جاري الطلب...
                        </>
                    ) : (
                        'تأكيد الطلب'
                    )}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
