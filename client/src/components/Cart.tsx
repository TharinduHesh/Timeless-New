import { Link } from 'react-router-dom';
import { FiX, FiMinus, FiPlus, FiShoppingBag } from 'react-icons/fi';
import { useCartStore } from '../store/cartStore';

const Cart = () => {
  const { items, isOpen, closeCart, updateQuantity, removeItem, getTotalPrice } = useCartStore();
  const totalPrice = getTotalPrice();

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="cart-backdrop fixed inset-0 bg-black/70 z-40 transition-opacity"
        onClick={closeCart}
      />

      {/* Cart Sidebar */}
      <div className="cart-sidebar fixed top-0 right-0 h-full w-full max-w-md bg-gradient-to-b from-[#0a0a0a]/98 to-[#0c0c0c]/98 backdrop-blur-lg border-l border-white/[0.05] z-50 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/[0.05]">
          <h2 className="text-2xl font-display font-bold text-white">Shopping Cart</h2>
          <button
            onClick={closeCart}
            className="p-2 text-muted hover:text-white transition-colors"
            aria-label="Close cart"
          >
            <FiX size={24} />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-grow overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <FiShoppingBag size={64} className="text-muted mb-4" />
              <p className="text-muted text-lg mb-6">Your cart is empty</p>
              <Link
                to="/shop"
                onClick={closeCart}
                className="btn-gold inline-block"
              >
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 p-4 bg-white/[0.02] rounded-lg border border-white/[0.03]">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div className="flex-grow">
                    <h3 className="text-white font-semibold text-sm mb-1">
                      {item.product.name}
                    </h3>
                    <p className="text-muted text-xs mb-2">{item.product.brand}</p>
                    <p className="text-accent font-bold">
                      LKR {item.product.price.toFixed(2)}
                    </p>
                  </div>
                  <div className="flex flex-col items-end justify-between">
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-muted hover:text-red-500 transition-colors"
                      aria-label="Remove item"
                    >
                      <FiX size={18} />
                    </button>
                    <div className="flex items-center gap-2 bg-white/[0.03] rounded">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-1 text-muted hover:text-white transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <FiMinus size={14} />
                      </button>
                      <span className="text-white text-sm w-8 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1 text-muted hover:text-white transition-colors"
                        disabled={item.quantity >= item.product.stock}
                        aria-label="Increase quantity"
                      >
                        <FiPlus size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-6 border-t border-white/[0.05] bg-black/20">
            <div className="flex justify-between items-center mb-4">
              <span className="text-white font-semibold text-lg">Total:</span>
              <span className="text-accent font-bold text-2xl">
                LKR {totalPrice.toFixed(2)}
              </span>
            </div>
            <Link
              to="/checkout"
              onClick={closeCart}
              className="bg-gradient-to-r from-accent to-accent-strong text-black font-semibold py-3 px-6 rounded-full transition-all duration-200 hover:-translate-y-0.5 w-full block text-center"
            >
              Proceed to Checkout
            </Link>
            <Link
              to="/shop"
              onClick={closeCart}
              className="border-2 border-accent text-accent font-semibold py-2 px-5 rounded-full transition-all duration-200 hover:bg-accent hover:text-black w-full block text-center mt-3"
            >
              Continue Shopping
            </Link>
          </div>
        )}
      </div>
    </>
  );
};

export default Cart;
