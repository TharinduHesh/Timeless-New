import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import { firestoreOrderService as orderService } from '../services/firestore';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000';

const Checkout = () => {
  const navigate = useNavigate();
  const { items, getTotalPrice, clearCart } = useCartStore();
  const subtotal = getTotalPrice();
  const [shippingFee, setShippingFee] = useState<number>(0);
  const totalPrice = subtotal + shippingFee;

  // Fetch shipping fee from API
  useEffect(() => {
    const fetchShippingFee = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/settings/shipping`);
        if (response.ok) {
          const data = await response.json();
          setShippingFee(data.shippingFee || 0);
        }
      } catch (error) {
        console.error('Failed to fetch shipping fee:', error);
      }
    };
    fetchShippingFee();
  }, []);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
  });

  const [isProcessing, setIsProcessing] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      const orderData = {
        customer: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: `${formData.address}, ${formData.city}, ${formData.state} ${formData.zipCode}, ${formData.country}`,
        },
        items,
        total: totalPrice,
        status: 'pending' as const,
      };

      const createdOrder = await orderService.create(orderData);
      const orderId = createdOrder.id;
      
      // Prepare WhatsApp message
      const itemsList = items
        .map((item) => `• ${item.product.name} (Qty: ${item.quantity}) - LKR ${(item.product.price * item.quantity).toFixed(2)}`)
        .join('\n');
      
      const message = `*New Order from Timeless*\n\n` +
        `*Order ID:* ${orderId}\n\n` +
        `*Customer Details:*\n` +
        `Name: ${formData.name}\n` +
        `Email: ${formData.email}\n` +
        `Phone: ${formData.phone}\n\n` +
        `*Shipping Address:*\n` +
        `${formData.address}\n` +
        `${formData.city}, ${formData.state} ${formData.zipCode}\n` +
        `${formData.country}\n\n` +
        `*Order Items:*\n${itemsList}\n\n` +
        `Subtotal: LKR ${subtotal.toFixed(2)}\n` +
        `Shipping: ${shippingFee > 0 ? `LKR ${shippingFee.toFixed(2)}` : 'FREE'}\n` +
        `*Total Amount: LKR ${totalPrice.toFixed(2)}*`;

      // Send to WhatsApp
      const whatsappNumber = '94778284062'; // Timeless WhatsApp number
      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
      
      clearCart();
      
      // Open WhatsApp
      window.open(whatsappUrl, '_blank');
      
      alert(`Order placed successfully! Order ID: ${orderId}\nYou will be redirected to WhatsApp to confirm your order.`);
      navigate('/');
    } catch (error) {
      console.error('Order failed:', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="section-container text-center py-20">
        <Helmet>
          <title>Checkout - Timeless</title>
        </Helmet>
        <div className="max-w-md mx-auto">
          <div className="mb-6">
            <svg className="w-24 h-24 mx-auto text-accent/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <p className="text-white text-2xl font-bold mb-2">Your Cart is Empty</p>
          <p className="text-muted mb-8">Add some luxury items to your cart to proceed with checkout</p>
          <button 
            onClick={() => navigate('/shop')} 
            className="bg-gradient-to-r from-accent to-accent-strong text-black font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-lg inline-flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Checkout - Timeless</title>
      </Helmet>

      <div className="checkout-page section-container">
        <h1 className="text-4xl font-display font-bold text-white text-center mb-12">
          Checkout
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="card-glass p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Shipping Information</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-white text-sm font-semibold mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="input-dark w-full"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label className="block text-white text-sm font-semibold mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="input-dark w-full"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-white text-sm font-semibold mb-2">
                  Phone *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="input-dark w-full"
                  placeholder="+1 (555) 123-4567"
                />
              </div>

              <div className="mb-6">
                <label className="block text-white text-sm font-semibold mb-2">
                  Address *
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  rows={3}
                  className="input-dark w-full resize-none"
                  placeholder="123 Main St, Apt 4B"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-white text-sm font-semibold mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    className="input-dark w-full"
                    placeholder="New York"
                  />
                </div>

                <div>
                  <label className="block text-white text-sm font-semibold mb-2">
                    State / Province *
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    required
                    className="input-dark w-full"
                    placeholder="NY"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <label className="block text-white text-sm font-semibold mb-2">
                    ZIP / Postal Code *
                  </label>
                  <input
                    type="text"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleChange}
                    required
                    className="input-dark w-full"
                    placeholder="10001"
                  />
                </div>

                <div>
                  <label className="block text-white text-sm font-semibold mb-2">
                    Country *
                  </label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    required
                    className="input-dark w-full"
                    placeholder="United States"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full bg-gradient-to-r from-accent to-accent-strong text-black font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 text-lg tracking-wide"
              >
                {isProcessing ? (
                  <span className="flex items-center justify-center gap-3">
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing Order...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    Place Order & Send to WhatsApp
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                    </svg>
                  </span>
                )}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="card-glass p-8 sticky top-24">
              <h2 className="text-2xl font-bold text-white mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3 pb-4 border-b border-white/[0.05]">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-grow">
                      <h4 className="text-white text-sm font-semibold">{item.product.name}</h4>
                      <p className="text-muted text-xs">Qty: {item.quantity}</p>
                      <p className="text-accent font-bold text-sm">
                        LKR {(item.product.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3 pt-4 border-t border-white/[0.05]">
                <div className="flex justify-between text-muted">
                  <span>Subtotal</span>
                  <span>LKR {subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-muted">
                  <span>Shipping</span>
                  <span>{shippingFee > 0 ? `LKR ${shippingFee.toFixed(2)}` : 'FREE'}</span>
                </div>
                <div className="flex justify-between text-white font-bold text-xl pt-3 border-t border-white/[0.05]">
                  <span>Total</span>
                  <span className="text-accent">LKR {totalPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Checkout;
