import { Link } from 'react-router-dom';
import { FiShoppingCart } from 'react-icons/fi';
import type { Product } from '../../types';
import { useCartStore } from '../../store/cartStore';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addItem, openCart } = useCartStore();

  const handleAddToCart = () => {
    addItem(product, 1);
    openCart();
  };

  const isOutOfStock = product.stock === 0;
  const hasDiscount = product.discount && product.discount > 0;
  const originalPrice = hasDiscount ? product.price / (1 - product.discount / 100) : product.price;

  return (
    <div className="product-card group relative">
      {/* Discount Badge */}
      {hasDiscount ? (
        <div className="product-discount absolute top-3 right-3 z-10">
          -{product.discount}%
        </div>
      ) : null}

      {/* Product Image */}
      <Link to={`/product/${product.id}`} className="block">
        <div className="product-image relative overflow-hidden rounded-lg bg-white/5">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-56 object-contain group-hover:scale-110 transition-transform duration-300"
            loading="lazy"
          />
        </div>
      </Link>

      {/* Product Info */}
      <div className="product-info pt-3 px-2 flex-grow flex flex-col">
        <Link to={`/product/${product.id}`}>
          <p className="product-brand text-muted text-sm mb-1 truncate">
            {product.brand}
          </p>
          <h3 className="product-name text-white font-bold text-base mb-2 line-clamp-2 hover:text-accent transition-colors">
            {product.name}
          </h3>
        </Link>

        <div className="product-meta text-sm text-muted mb-3 flex justify-between">
          <span className="product-category truncate capitalize">{product.category}</span>
          {product.stock > 0 && (
            <span className="product-stock whitespace-nowrap ml-2 text-green-500">
              {product.stock} in stock
            </span>
          )}
        </div>

        {/* Price */}
        <div className="mb-3">
          {hasDiscount ? (
            <div className="flex items-center gap-2">
              <span className="product-price text-accent font-extrabold text-lg">
                LKR {product.price.toFixed(2)}
              </span>
              <span className="text-muted text-sm line-through">
                LKR {originalPrice.toFixed(2)}
              </span>
            </div>
          ) : (
            <span className="product-price text-accent font-extrabold text-lg block">
              LKR {product.price.toFixed(2)}
            </span>
          )}
        </div>

        {/* Out of Stock Badge */}
        {isOutOfStock && (
          <div className="out-of-stock-badge mb-3 text-center">
            OUT OF STOCK
          </div>
        )}

        {/* Add to Cart Button */}
        <div className="product-actions mt-auto">
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className="add-to-cart-btn w-full flex items-center justify-center gap-2"
          >
            <FiShoppingCart size={18} />
            {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
