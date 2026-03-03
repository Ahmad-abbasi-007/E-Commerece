import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { GoHeartFill } from 'react-icons/go';
import { HiMiniShoppingBag } from 'react-icons/hi2';
import { MdDelete } from 'react-icons/md';

const Wishlist = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('wishlist') || '[]');
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setItems(saved);
  }, []);

  const remove = (id) => {
    const updated = items.filter(i => i.id !== id);
    setItems(updated);
    localStorage.setItem('wishlist', JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('wishlistUpdate'));
  };

  const moveToCart = (product) => {
    // remove from wishlist
    remove(product.id);
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existing = cart.find(item => item.id === product.id);
    let updatedCart;
    if (existing) {
      updatedCart = cart.map(item =>
        item.id === product.id ? { ...item, qty: item.qty + 1 } : item
      );
    } else {
      updatedCart = [...cart, { ...product, qty: 1 }];
    }
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    window.dispatchEvent(new CustomEvent('cartUpdate'));
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
      <div className="mb-8">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2 flex items-center gap-2">
          <GoHeartFill className="text-red-500" /> My Wishlist
        </h2>
        <p className="text-gray-600">Save your favorite items for later</p>
      </div>
      {items.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-2xl">
          <GoHeartFill className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600 text-lg mb-4">Your wishlist is empty</p>
          <Link to="/" className="inline-block text-blue-600 hover:underline font-semibold">Start adding items</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {items.map(item => (
            <div key={item.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 overflow-hidden">
              <div className="sm:flex">
                <div className="sm:w-24 sm:h-24 flex-shrink-0">
                  <img src={item.image} alt={item.name} className="w-full h-40 sm:h-24 object-cover" />
                </div>
                <div className="flex flex-col flex-1 p-4 sm:p-4">
                  <Link to={`/product/${item.id}`} className="font-semibold text-gray-900 hover:text-blue-600 line-clamp-1 mb-1">
                    {item.name}
                  </Link>
                  <p className="text-sm text-gray-500 mb-2">{item.category}</p>
                  <p className="font-bold text-xl text-blue-600 mb-3">${item.price.toFixed(2)}</p>
                  <div className="flex flex-col sm:flex-row gap-2 mt-auto">
                    <button
                      onClick={() => moveToCart(item)}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 font-semibold text-sm flex items-center justify-center gap-2"
                    >
                      <HiMiniShoppingBag className="w-4 h-4" /> Move to Cart
                    </button>
                    <button
                      onClick={() => remove(item.id)}
                      className="flex-1 bg-red-100 text-red-600 px-4 py-2 rounded-lg hover:bg-red-200 transition-all duration-300 font-semibold text-sm flex items-center justify-center gap-2"
                    >
                      <MdDelete className="w-4 h-4" /> Remove
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default Wishlist;
