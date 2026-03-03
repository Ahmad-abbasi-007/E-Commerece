/* eslint-disable react-refresh/only-export-components */
import React, { useState, useEffect } from 'react';
import { Heart, ShoppingBag, Star, Eye, X } from 'lucide-react';
import { Link } from 'react-router-dom';

// Import your product images
import Tshirt from '../../assets/tshirt.png';
import Jeans from '../../assets/jeans.png';
import LeatherJacket from '../../assets/leather-jacket.png';
import Hoodie from '../../assets/hoodie.png';
import Dress from '../../assets/dress.png';
import ShirtDress from '../../assets/shirt-dress.png';
import Skater from '../../assets/skater.png';
import Skirt from '../../assets/skirt.png';
import Sweater from '../../assets/sweater.png';
import BabyShirt from '../../assets/baby-shirt.png';
import Sleepsuit from '../../assets/sleepsuit.png';
import Shirt from '../../assets/shirt.png';

export const ProductList = [
  // Men's Category
  {
    id: 1,
    name: 'Classic T-Shirt',
    image: Tshirt,
    price: 29.99,
    oldPrice: 39.99,
    onSale: true,
    newArrival: false,
    category: 'Men',
    rating: 4.5,
    reviews: 128
  },
  {
    id: 2,
    name: 'Slim Fit Jeans',
    image: Jeans,
    price: 79.99,
    oldPrice: 99.99,
    onSale: true,
    newArrival: false,
    category: 'Men',
    rating: 4.3,
    reviews: 89
  },
  {
    id: 3,
    name: 'Leather Jacket',
    image: LeatherJacket,
    price: 199.99,
    oldPrice: 299.99,
    onSale: true,
    newArrival: true,
    category: 'Men',
    rating: 4.8,
    reviews: 56
  },
  {
    id: 4,
    name: 'Casual Hoodie',
    image: Hoodie,
    price: 59.99,
    oldPrice: 79.99,
    onSale: false,
    newArrival: true,
    category: 'Men',
    rating: 4.6,
    reviews: 234
  },
  {
    id: 5,
    name: 'Formal Shirt',
    image: Shirt,
    price: 49.99,
    oldPrice: 69.99,
    onSale: true,
    newArrival: false,
    category: 'Men',
    rating: 4.4,
    reviews: 167
  },
  // Women's Category
  {
    id: 6,
    name: 'Summer Dress',
    image: Dress,
    price: 89.99,
    oldPrice: 129.99,
    onSale: true,
    newArrival: true,
    category: 'Women',
    rating: 4.7,
    reviews: 345
  },
  {
    id: 7,
    name: 'Shirt Dress',
    image: ShirtDress,
    price: 79.99,
    oldPrice: 99.99,
    onSale: true,
    newArrival: false,
    category: 'Women',
    rating: 4.2,
    reviews: 78
  },
  {
    id: 8,
    name: 'Skater Dress',
    image: Skater,
    price: 69.99,
    oldPrice: 89.99,
    onSale: true,
    newArrival: true,
    category: 'Women',
    rating: 4.9,
    reviews: 412
  },
  {
    id: 9,
    name: 'Pleated Skirt',
    image: Skirt,
    price: 44.99,
    oldPrice: 59.99,
    onSale: true,
    newArrival: false,
    category: 'Women',
    rating: 4.1,
    reviews: 56
  },
  {
    id: 10,
    name: 'Cozy Sweater',
    image: Sweater,
    price: 64.99,
    oldPrice: 84.99,
    onSale: true,
    newArrival: true,
    category: 'Women',
    rating: 4.5,
    reviews: 189
  },
  // Kids Category
  {
    id: 11,
    name: 'Baby Onesie',
    image: BabyShirt,
    price: 19.99,
    oldPrice: 29.99,
    onSale: true,
    newArrival: true,
    category: 'Kids',
    rating: 4.8,
    reviews: 267
  },
  {
    id: 12,
    name: 'Baby Sleepsuit',
    image: Sleepsuit,
    price: 24.99,
    oldPrice: 34.99,
    onSale: true,
    newArrival: false,
    category: 'Kids',
    rating: 4.6,
    reviews: 145
  },
  {
    id: 13,
    name: "Kid's T-Shirt",
    image: Tshirt,
    price: 14.99,
    oldPrice: 19.99,
    onSale: true,
    newArrival: true,
    category: 'Kids',
    rating: 4.3,
    reviews: 98
  },
  {
    id: 14,
    name: "Kid's Jeans",
    image: Jeans,
    price: 34.99,
    oldPrice: 44.99,
    onSale: true,
    newArrival: false,
    category: 'Kids',
    rating: 4.2,
    reviews: 67
  },
  {
    id: 15,
    name: "Kid's Hoodie",
    image: Hoodie,
    price: 39.99,
    oldPrice: 49.99,
    onSale: false,
    newArrival: true,
    category: 'Kids',
    rating: 4.4,
    reviews: 112
  }
];

const Products = () => {
  const categories = ['All', 'Men', 'Women', 'Kids', 'New Arrivals', 'On Sale'];
  const [activeTab, setActiveTab] = useState('All');
  const [wishlist, setWishlist] = useState([]);
  const [cart, setCart] = useState([]); // cart items include { ...product, qty }
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showQuickView, setShowQuickView] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  // helper to load wishlist/cart from localStorage
  function loadData() {
    const savedWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    setWishlist(savedWishlist.map(item => item.id));
    setCart(savedCart);
  }

  // Load initial data
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadData();
    localStorage.setItem('allProducts', JSON.stringify(ProductList));
    
    // Listen for updates
    const handleUpdate = () => {
      loadData();
    };

    window.addEventListener('wishlistUpdate', handleUpdate);
    window.addEventListener('cartUpdate', handleUpdate);

    return () => {
      window.removeEventListener('wishlistUpdate', handleUpdate);
      window.removeEventListener('cartUpdate', handleUpdate);
    };
  }, []);


  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);
  };

  const toggleWishlist = (product) => {
    const currentWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    let updatedWishlist;
    
    if (wishlist.includes(product.id)) {
      updatedWishlist = currentWishlist.filter(item => item.id !== product.id);
      showNotification(`${product.name} removed from wishlist`, 'error');
    } else {
      updatedWishlist = [...currentWishlist, product];
      showNotification(`${product.name} added to wishlist`, 'success');
    }
    
    setWishlist(updatedWishlist.map(item => item.id));
    localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
    window.dispatchEvent(new CustomEvent('wishlistUpdate'));
  };

  const addToCart = (product) => {
    const currentCart = JSON.parse(localStorage.getItem('cart') || '[]');
    // try to find existing item
    const existing = currentCart.find(item => item.id === product.id);
    let updatedCart;
    if (existing) {
      updatedCart = currentCart.map(item =>
        item.id === product.id ? { ...item, qty: item.qty + 1 } : item
      );
    } else {
      updatedCart = [...currentCart, { ...product, qty: 1 }];
    }

    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    window.dispatchEvent(new CustomEvent('cartUpdate'));
    showNotification(`${product.name} added to cart`, 'success');
  };

  const quickView = (product) => {
    setSelectedProduct(product);
    setShowQuickView(true);
  };

  const filteredProducts = ProductList.filter(product => {
    if (activeTab === 'All') return true;
    if (activeTab === 'New Arrivals') return product.newArrival;
    if (activeTab === 'On Sale') return product.onSale;
    return product.category === activeTab;
  });

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
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
    <section className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 w-full mt-[70px] sm:mt-[80px] lg:mt-[90px]'>
      {/* Notification Toast */}
      {notification.show && (
        <div className={`fixed top-4 sm:top-20 right-2 sm:right-4 z-50 px-3 sm:px-6 py-2 sm:py-3 rounded-md sm:rounded-lg shadow-md sm:shadow-lg text-sm sm:text-base transform transition-all duration-500 animate-slideIn ${
          notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
        } text-white`}>
          {notification.message}
        </div>
      )}

      {/* Header */}
      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8'>
        <div>
          <h2 className='text-3xl sm:text-4xl font-bold text-gray-900 mb-2'>Our Products</h2>
          <p className='text-gray-600'>Discover our latest collection</p>
        </div>
        {cart.length > 0 && (
          <div className='flex items-center gap-2 bg-gradient-to-r from-blue-50 to-cyan-50 px-4 py-2 rounded-full border border-blue-100'>
            <ShoppingBag className='w-5 h-5 text-blue-600' />
            <span className='text-blue-600 font-semibold'>{cart.reduce((sum,i)=>sum+(i.qty||1),0)} items in cart</span>
          </div>
        )}
      </div>

      {/* Categories Tabs */}
      <div className='w-full mb-8 relative'>
        <div className='flex items-center gap-2 sm:gap-3 overflow-x-auto scrollbar-hide pb-3 snap-x'>
          {categories.map((category, index) => (
            <button
              key={index}
              className={`px-5 py-2.5 rounded-full whitespace-nowrap snap-start transition-all duration-300 font-medium text-sm sm:text-base
                ${activeTab === category 
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg scale-105' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105'
                }`}
              onClick={() => setActiveTab(category)}
            >
              {category}
            </button>
          ))}
        </div>
        <div className='absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-white to-transparent pointer-events-none sm:hidden'></div>
      </div>

      {/* Products Grid */}
      <div className='w-full'>
        {filteredProducts.length === 0 ? (
          <div className='text-center py-16 bg-gray-50 rounded-2xl'>
            <ShoppingBag className='w-16 h-16 mx-auto text-gray-400 mb-4' />
            <p className='text-gray-500 text-lg'>No products found in this category.</p>
          </div>
        ) : (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6'>
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className='relative group bg-white rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 hover:border-transparent'
                onMouseEnter={() => setHoveredProduct(product.id)}
                onMouseLeave={() => setHoveredProduct(null)}
              >
                {/* Image Container */}
                <div className='relative overflow-hidden bg-gray-100 aspect-square'>
                  <Link to={`/product/${product.id}`} className='block w-full h-full'>
                    <img
                      src={product.image}
                      alt={product.name}
                      className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-700'
                    />
                  </Link>

                  {/* Badges */}
                  <div className='absolute top-3 left-3 flex flex-col gap-2'>
                    {product.onSale && (
                      <div className='bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg animate-pulse'>
                        SALE {product.oldPrice ? Math.round((1 - product.price/product.oldPrice) * 100) : ''}% OFF
                      </div>
                    )}
                    {product.newArrival && !product.onSale && (
                      <div className='bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg'>
                        NEW ARRIVAL
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className='absolute top-3 right-3 flex flex-col gap-2'>
                    <button
                      onClick={() => toggleWishlist(product)}
                      className={`p-2.5 rounded-full bg-white/90 backdrop-blur-sm shadow-lg transition-all duration-300 hover:scale-110 ${wishlist.includes(product.id) ? 'text-red-500' : 'text-gray-600 hover:text-red-500'}`}
                    >
                      <Heart className={`w-5 h-5 ${wishlist.includes(product.id) ? 'fill-current' : ''}`} />
                    </button>
                    <button
                      onClick={() => quickView(product)}
                      className='p-2.5 rounded-full bg-white/90 backdrop-blur-sm shadow-lg transition-all duration-300 hover:scale-110 text-gray-600 hover:text-blue-600'
                    >
                      <Eye className='w-5 h-5' />
                    </button>
                  </div>

                  {/* Quick Add to Cart (scoped to the image container) */}
                  <div className={`absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 via-black/50 to-transparent transform transition-transform duration-500 ${hoveredProduct === product.id ? 'translate-y-0' : 'translate-y-full'}`}>
                    <button
                      onClick={() => addToCart(product)}
                      className='w-full bg-white text-gray-900 py-3 rounded-xl font-semibold text-sm hover:bg-gradient-to-r hover:from-blue-600 hover:to-blue-700 hover:text-white transition-all duration-300 flex items-center justify-center gap-2 shadow-lg'
                    >
                      <ShoppingBag className='w-4 h-4' />
                      Add to Cart
                    </button>
                  </div>
                </div>

                {/* Product Details */}
                <div className='p-4'>
                  <div className='flex justify-between items-start mb-2'>
                    <h3 className='font-semibold text-gray-900 text-base sm:text-lg line-clamp-1'>
                      {product.name}
                    </h3>
                    <span className='text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-600 ml-2'>
                      {product.category}
                    </span>
                  </div>

                  {/* Rating */}
                  <div className='flex items-center gap-1 mb-3'>
                    <div className='flex items-center'>
                      {renderStars(product.rating || 4.5)}
                    </div>
                    <span className='text-xs text-gray-500 ml-1'>({product.reviews || 100})</span>
                  </div>

                  {/* Price */}
                  <div className='flex items-center gap-2 mb-3'>
                    <span className='text-2xl font-bold text-gray-900'>
                      ${product.price.toFixed(2)}
                    </span>
                    {product.oldPrice && (
                      <>
                        <span className='text-sm text-gray-400 line-through'>
                          ${product.oldPrice.toFixed(2)}
                        </span>
                        <span className='text-xs bg-green-100 text-green-600 font-semibold px-2 py-1 rounded-full'>
                          Save ${(product.oldPrice - product.price).toFixed(2)}
                        </span>
                      </>
                    )}
                  </div>

                  {/* Mobile Add to Cart */}
                  <button
                    onClick={() => addToCart(product)}
                    className='mt-2 w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-xl font-semibold text-sm hover:from-blue-700 hover:to-blue-800 transition-all duration-300 flex items-center justify-center gap-2 shadow-md sm:hidden'
                  >
                    <ShoppingBag className='w-4 h-4' />
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick View Modal */}
      {showQuickView && selectedProduct && (
        <div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn'>
          <div className='bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto animate-slideUp'>
            <div className='relative'>
              <button
                onClick={() => setShowQuickView(false)}
                className='absolute top-4 right-4 z-10 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-gray-100 transition-colors'
              >
                <X className='w-5 h-5' />
              </button>
              
              <div className='grid md:grid-cols-2 gap-6 p-6'>
                {/* Product Image */}
                <div className='bg-gray-100 rounded-xl overflow-hidden'>
                  <img 
                    src={selectedProduct.image} 
                    alt={selectedProduct.name}
                    className='w-full h-full object-cover'
                  />
                </div>

                {/* Product Info */}
                <div>
                  <h2 className='text-2xl font-bold text-gray-900 mb-2'>{selectedProduct.name}</h2>
                  <p className='text-gray-600 mb-4'>{selectedProduct.category}</p>
                  
                  <div className='flex items-center gap-2 mb-4'>
                    <div className='flex items-center'>
                      {renderStars(selectedProduct.rating || 4.5)}
                    </div>
                    <span className='text-sm text-gray-500'>({selectedProduct.reviews || 100} reviews)</span>
                  </div>

                  <div className='flex items-center gap-3 mb-6'>
                    <span className='text-3xl font-bold text-gray-900'>${selectedProduct.price.toFixed(2)}</span>
                    {selectedProduct.oldPrice && (
                      <>
                        <span className='text-lg text-gray-400 line-through'>${selectedProduct.oldPrice.toFixed(2)}</span>
                        <span className='text-sm bg-green-100 text-green-600 font-semibold px-3 py-1 rounded-full'>
                          Save ${(selectedProduct.oldPrice - selectedProduct.price).toFixed(2)}
                        </span>
                      </>
                    )}
                  </div>

                  <div className='space-y-3'>
                    <button
                      onClick={() => {
                        addToCart(selectedProduct);
                        setShowQuickView(false);
                      }}
                      className='w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 flex items-center justify-center gap-2'
                    >
                      <ShoppingBag className='w-5 h-5' />
                      Add to Cart
                    </button>
                    
                    <button
                      onClick={() => {
                        toggleWishlist(selectedProduct);
                        setShowQuickView(false);
                      }}
                      className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 border-2
                        ${wishlist.includes(selectedProduct.id) 
                          ? 'border-red-500 text-red-500 hover:bg-red-50' 
                          : 'border-gray-300 text-gray-700 hover:border-red-500 hover:text-red-500'}`}
                    >
                      <Heart className={`w-5 h-5 ${wishlist.includes(selectedProduct.id) ? 'fill-current' : ''}`} />
                      {wishlist.includes(selectedProduct.id) ? 'Remove from Wishlist' : 'Add to Wishlist'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cart Summary */}
      {cart.length > 0 && (
        <div className='fixed bottom-4 right-4 sm:bottom-6 sm:right-6 bg-white rounded-xl shadow-2xl p-4 max-w-xs w-full border border-gray-200 animate-slideUp z-40'>
          <div className='flex justify-between items-start mb-2'>
            <h4 className='font-semibold text-gray-900 flex items-center gap-2'>
              <ShoppingBag className='w-4 h-4 text-blue-600' />
              Cart Summary
            </h4>
            <button 
              onClick={() => setCart([])}
              className='text-gray-400 hover:text-gray-600 hover:scale-110 transition-transform'
            >
              <X className='w-4 h-4' />
            </button>
          </div>
          <p className='text-sm text-gray-600 mb-2'>
            {cart.length} item{cart.length !== 1 ? 's' : ''} added
          </p>
          <div className='max-h-40 overflow-y-auto mb-2 space-y-1'>
            {cart.slice(-3).map((item, index) => (
              <div key={index} className='text-xs text-gray-600 py-1 border-b border-gray-100 last:border-0 flex justify-between'>
                <span className='truncate max-w-[150px]'>{item.name}</span>
                <span className='font-semibold'>${item.price.toFixed(2)}</span>
              </div>
            ))}
            {cart.length > 3 && (
              <div className='text-xs text-gray-500 py-1 text-center'>
                +{cart.length - 3} more items
              </div>
            )}
          </div>
          <div className='flex justify-between font-semibold text-sm mb-3 pt-2 border-t border-gray-100'>
            <span>Total:</span>
            <span className='text-blue-600'>${cart.reduce((sum, item) => sum + item.price, 0).toFixed(2)}</span>
          </div>
          <Link to="/cart" className='w-full block bg-gradient-to-r from-blue-600 to-blue-700 text-white py-2 rounded-lg text-sm font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 text-center'>
            View Cart
          </Link>
        </div>
      )}
    </section>
  );
};

export default Products;