import React, { useState, useEffect } from 'react';
import { MdDelete } from 'react-icons/md';
import { HiMiniShoppingBag } from 'react-icons/hi2';
import { Link, useNavigate } from 'react-router-dom';

const Cart = () => {
  const [items, setItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('cart') || '[]');
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setItems(saved);
  }, []);

  const saveCart = (updated) => {
    setItems(updated);
    localStorage.setItem('cart', JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('cartUpdate'));
  };

  const remove = (id) => {
    const updated = items.filter(i => i.id !== id);
    saveCart(updated);
  };

  const changeQty = (id, delta) => {
    const updated = items.map(i => {
      if (i.id === id) {
        const newQty = (i.qty || 1) + delta;
        return {
          ...i,
          qty: newQty > 0 ? newQty : 1
        };
      }
      return i;
    });
    saveCart(updated);
  };

  const getTotal = () => {
    return items.reduce((sum, item) => sum + item.price * (item.qty || 1), 0).toFixed(2);
  };

  if (items.length === 0) {
    return (
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <div className="text-center py-16 bg-gray-50 rounded-2xl">
          <HiMiniShoppingBag className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Add some items to get started</p>
          <button onClick={() => navigate('/')} className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-semibold transition-all duration-300">
            Continue Shopping
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
      <div className="mb-8">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Shopping Cart</h2>
        <p className="text-gray-600">{items.length} {items.length === 1 ? 'item' : 'items'} in cart</p>
      </div>
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map(item => (
            <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 overflow-hidden">
              <div className="flex flex-col sm:flex-row gap-4 p-4 sm:p-6">
                <Link to={`/product/${item.id}`} className="flex-shrink-0">
                  <img src={item.image} alt={item.name} className="w-full sm:w-24 h-40 sm:h-24 object-cover rounded-lg hover:scale-105 transition-transform duration-300" />
                </Link>
                <div className="flex-1 flex flex-col">
                  <Link to={`/product/${item.id}`} className="font-semibold text-gray-900 hover:text-blue-600 line-clamp-1 mb-1 text-lg">
                    {item.name}
                  </Link>
                  <p className="text-sm text-gray-500 mb-3">{item.category}</p>
                  <p className="font-bold text-xl text-blue-600 mb-4">${(item.price * (item.qty || 1)).toFixed(2)}</p>
                  <div className="flex items-center gap-3 mt-auto">
                    <div className="flex items-center border border-gray-300 rounded-lg">
                      <button
                        onClick={() => changeQty(item.id, -1)}
                        className="px-3 py-2 text-gray-600 hover:bg-gray-100 transition-colors font-semibold"
                      >−</button>
                      <span className="px-4 py-2 border-l border-r border-gray-300 font-semibold min-w-[50px] text-center">{item.qty || 1}</span>
                      <button
                        onClick={() => changeQty(item.id, 1)}
                        className="px-3 py-2 text-gray-600 hover:bg-gray-100 transition-colors font-semibold"
                      >+</button>
                    </div>
                    <button
                      onClick={() => remove(item.id)}
                      className="ml-auto text-red-500 hover:text-red-700 hover:bg-red-100 p-2 rounded-lg transition-colors"
                    >
                      <MdDelete className="text-xl" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-24 h-fit">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h3>
            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span className="font-semibold">${getTotal()}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span className="font-semibold text-green-600">Free</span>
              </div>
              <div className="border-t pt-4 flex justify-between text-lg font-bold text-gray-900">
                <span>Total</span>
                <span className="text-blue-600">${getTotal()}</span>
              </div>
            </div>
            <Link
              to="/checkout"
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 font-semibold flex items-center justify-center gap-2 mb-3"
            >
              <HiMiniShoppingBag className="w-5 h-5" /> Proceed to Checkout
            </Link>
            <button
              onClick={() => navigate('/')}
              className="w-full text-blue-600 hover:bg-blue-50 px-6 py-2 rounded-lg transition-colors font-semibold"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Cart;
