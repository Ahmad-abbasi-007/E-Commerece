import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Checkout = () => {
  const [items, setItems] = useState([]);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('cart') || '[]');
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setItems(saved);
  }, []);

  const subtotal = items.reduce((sum, i) => sum + i.price * (i.qty || 1), 0);
  const shipping = items.length > 0 ? 5.0 : 0;
  const total = (subtotal + shipping).toFixed(2);

  const placeOrder = () => {
    // For now simply clear cart and show confirmation
    localStorage.setItem('cart', '[]');
    window.dispatchEvent(new CustomEvent('cartUpdate'));
    setOrderPlaced(true);
  };

  if (orderPlaced) {
    return (
      <section className="max-w-4xl mx-auto p-6 text-center">
        <h2 className="text-2xl font-semibold mb-4">Thank you for your order!</h2>
        <p>Your order has been placed successfully.</p>
        <button onClick={() => navigate('/')} className="mt-6 text-blue-600 underline">
          Continue shopping
        </button>
      </section>
    );
  }

  if (items.length === 0) {
    return (
      <section className="max-w-4xl mx-auto p-6 text-center">
        <h2 className="text-2xl font-semibold mb-4">Your cart is empty.</h2>
        <button onClick={() => navigate('/')} className="text-blue-600 underline">
          Shop now
        </button>
      </section>
    );
  }

  return (
    <section className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">Checkout</h2>
      <div className="space-y-4">
        {items.map(item => (
          <div key={item.id} className="flex items-center gap-4 border p-4 rounded-lg">
            <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded" />
            <div className="flex-1">
              <h4 className="font-semibold">{item.name}</h4>
              <p className="text-sm text-gray-500">Qty: {item.qty || 1}</p>
              <p className="font-bold text-blue-600">${(item.price * (item.qty || 1)).toFixed(2)}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 space-y-2 text-right">
        <div>Subtotal: <span className="font-semibold">${subtotal.toFixed(2)}</span></div>
        <div>Shipping: <span className="font-semibold">${shipping.toFixed(2)}</span></div>
        <div className="text-lg">Total: <span className="font-bold text-blue-600">${total}</span></div>
      </div>
      <div className="mt-6 text-right">
        <button
          onClick={placeOrder}
          className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
        >
          Place Order
        </button>
      </div>
    </section>
  );
};

export default Checkout;
