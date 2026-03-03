import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Heart, ShoppingBag, Star, X } from 'lucide-react';
import { useState, useEffect } from 'react';

// reuse product list from Products.jsx maybe import
import { ProductList } from './Product';

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = ProductList.find(p => p.id === parseInt(id, 10));
  const [wishlist, setWishlist] = useState([]);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  useEffect(() => {
    const savedWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setWishlist(savedWishlist.map(item => item.id));
  }, []);

  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);
  };

  const toggleWishlist = () => {
    const currentWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    let updated;
    if (wishlist.includes(product.id)) {
      updated = currentWishlist.filter(item => item.id !== product.id);
      showNotification(`${product.name} removed from wishlist`, 'error');
    } else {
      updated = [...currentWishlist, product];
      showNotification(`${product.name} added to wishlist`, 'success');
    }
    setWishlist(updated.map(item => item.id));
    localStorage.setItem('wishlist', JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('wishlistUpdate'));
  };

  const addToCart = () => {
    const currentCart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existing = currentCart.find(item => item.id === product.id);
    let updated;
    if (existing) {
      updated = currentCart.map(item =>
        item.id === product.id ? { ...item, qty: item.qty + 1 } : item
      );
    } else {
      updated = [...currentCart, { ...product, qty: 1 }];
    }
    localStorage.setItem('cart', JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('cartUpdate'));
    showNotification(`${product.name} added to cart`, 'success');
  };

  if (!product) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-semibold">Product not found</h2>
        <button onClick={() => navigate('/')} className="mt-4 text-blue-600 underline">
          Back Home
        </button>
      </div>
    );
  }

  const renderStars = rating => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-5 h-5 ${
          i < Math.floor(rating)
            ? 'fill-yellow-400 text-yellow-400'
            : i < rating
            ? 'fill-yellow-400 text-yellow-400 opacity-50'
            : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <section className="max-w-5xl mx-auto px-4 py-12">
      {notification.show && (
        <div
          className={`fixed top-20 right-4 z-50 px-6 py-3 rounded-lg shadow-lg transform transition-all duration-500 animate-slideIn ${
            notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
          } text-white`}
        >
          {notification.message}
        </div>
      )}
      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex-1">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover rounded-2xl"
          />
        </div>
        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          <p className="text-gray-600 mb-2">{product.category}</p>
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center">{renderStars(product.rating)}</div>
            <span className="text-sm text-gray-500">({product.reviews} reviews)</span>
          </div>
          <div className="flex items-center gap-3 mb-6">
            <span className="text-3xl font-bold text-gray-900">
              ${product.price.toFixed(2)}
            </span>
            {product.oldPrice && (
              <>
                <span className="text-lg text-gray-400 line-through">
                  ${product.oldPrice.toFixed(2)}
                </span>
                <span className="text-sm bg-green-100 text-green-600 font-semibold px-3 py-1 rounded-full">
                  Save ${(product.oldPrice - product.price).toFixed(2)}
                </span>
              </>
            )}
          </div>
          <div className="space-y-4">
            <button
              onClick={addToCart}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-5 h-5" /> Add to Cart
            </button>
            <button
              onClick={toggleWishlist}
              className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 border-2 ${
                wishlist.includes(product.id)
                  ? 'border-red-500 text-red-500 hover:bg-red-50'
                  : 'border-gray-300 text-gray-700 hover:border-red-500 hover:text-red-500'
              }`}
            >
              <Heart className={`w-5 h-5 ${wishlist.includes(product.id) ? 'fill-current' : ''}`} />
              {wishlist.includes(product.id) ? 'Remove from Wishlist' : 'Add to Wishlist'}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductPage;
