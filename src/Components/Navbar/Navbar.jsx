import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Logo from '../../assets/logo.png';
import { IoSearch } from 'react-icons/io5';
import { GoHeartFill } from 'react-icons/go';
import { HiMiniShoppingBag } from 'react-icons/hi2';
import { IoClose } from 'react-icons/io5';
import { MdDelete } from 'react-icons/md';
import { FaShoppingCart } from 'react-icons/fa';

const Navbar = () => {
  const [wishlistCount, setWishlistCount] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  const [showWishlist, setShowWishlist] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [allProducts, setAllProducts] = useState([]);


  // Load initial data
  function loadData() {
    // Load all products
    const products = JSON.parse(localStorage.getItem('allProducts') || '[]');
    setAllProducts(products);
    
    // Load wishlist
    const savedWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    setWishlistItems(savedWishlist);
    setWishlistCount(savedWishlist.length);
    
    // Load cart
    const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCartItems(savedCart);
    setCartCount(savedCart.reduce((sum, item) => sum + (item.qty || 1), 0));
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadData();
    
    // Listen for updates
    const handleUpdate = () => {
      loadData();
    };

    window.addEventListener('wishlistUpdate', handleUpdate);
    window.addEventListener('cartUpdate', handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener('wishlistUpdate', handleUpdate);
      window.removeEventListener('cartUpdate', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);


  // Search functionality
  useEffect(() => {
    if (searchQuery.trim().length > 1) {
      const timer = setTimeout(() => {
        const results = allProducts.filter(product => 
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.category.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setSearchResults(results);
        setShowSearchResults(true);
      }, 300);
      return () => clearTimeout(timer);
    } else {
      const t = setTimeout(() => {
        setSearchResults([]);
        setShowSearchResults(false);
      }, 0);
      return () => clearTimeout(t);
    }
  }, [searchQuery, allProducts]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const removeFromWishlist = (productId) => {
    const updatedWishlist = wishlistItems.filter(item => item.id !== productId);
    setWishlistItems(updatedWishlist);
    setWishlistCount(updatedWishlist.length);
    localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
    window.dispatchEvent(new CustomEvent('wishlistUpdate'));
  };

  const removeFromCart = (productId) => {
    const updatedCart = cartItems.filter(item => item.id !== productId);
    setCartItems(updatedCart);
    setCartCount(updatedCart.reduce((sum, i) => sum + (i.qty || 1), 0));
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    window.dispatchEvent(new CustomEvent('cartUpdate'));
  };

  const moveToCart = (product) => {
    // Remove from wishlist
    const updatedWishlist = wishlistItems.filter(item => item.id !== product.id);
    setWishlistItems(updatedWishlist);
    setWishlistCount(updatedWishlist.length);
    localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
    
    // Add to cart
    // if product exists increment qty
    let updatedCart;
    const existing = cartItems.find(item => item.id === product.id);
    if (existing) {
      updatedCart = cartItems.map(item =>
        item.id === product.id ? { ...item, qty: item.qty + 1 } : item
      );
    } else {
      updatedCart = [...cartItems, { ...product, qty: 1 }];
    }
    setCartItems(updatedCart);
    setCartCount(updatedCart.reduce((sum, i) => sum + (i.qty || 1), 0));
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    
    // Dispatch events
    window.dispatchEvent(new CustomEvent('wishlistUpdate'));
    window.dispatchEvent(new CustomEvent('cartUpdate'));
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price * (item.qty || 1)), 0).toFixed(2);
  };

  const clearWishlist = () => {
    setWishlistItems([]);
    setWishlistCount(0);
    localStorage.setItem('wishlist', '[]');
    window.dispatchEvent(new CustomEvent('wishlistUpdate'));
  };

  const clearCart = () => {
    setCartItems([]);
    setCartCount(0);
    localStorage.setItem('cart', '[]');
    window.dispatchEvent(new CustomEvent('cartUpdate'));
  };

  return (
    <header className='w-full h-[70px] sm:h-[80px] lg:h-[90px] bg-white/95 backdrop-blur-md fixed top-0 z-50 shadow-sm'>
      <nav className='max-w-7xl mx-auto h-full flex items-center justify-between px-4 sm:px-6 lg:px-8'>
        {/* LOGO */}
        <a href="/" className='flex items-center gap-2 group'>
          <div className='flex w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full p-2 group-hover:scale-110 transition-transform duration-300 shadow-md hover:shadow-lg flex items-center justify-center '>
            <img src={Logo} className='flex w-full h-full object-contain filter brightness-0 invert' alt="Logo" />
          ABBASI CART</div>
          <span className='font-bold text-lg sm:text-xl text-gray-800 hidden sm:block'>Abbasi-Cart-Store</span>
        </a>

        {/* Search Bar */}
        <div className='hidden md:block relative flex-1 max-w-md mx-4'>
          <div className='relative'>
            <input 
              type="text" 
              placeholder='Search products...' 
              value={searchQuery}
              onChange={handleSearch}
              onFocus={() => searchResults.length > 0 && setShowSearchResults(true)}
              onBlur={() => setTimeout(() => setShowSearchResults(false), 200)}
              className='w-full pl-4 pr-12 py-2 rounded-full border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-all duration-300 text-sm'
            />
            <button className='absolute right-1 top-1/2 -translate-y-1/2 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors'>
              <IoSearch className='text-sm' />
            </button>
          </div>

          {/* Search Results */}
          {showSearchResults && searchResults.length > 0 && (
            <div className='absolute top-full mt-2 w-full bg-white rounded-xl shadow-2xl border border-gray-200 max-h-96 overflow-y-auto z-50'>
              {searchResults.map(product => (
                <Link
                  key={product.id}
                  to={`/product/${product.id}`}
                  className='block p-3 hover:bg-gray-50 border-b last:border-0 flex items-center gap-3'
                >
                  <img src={product.image} alt={product.name} className='w-12 h-12 object-cover rounded-lg' />
                  <div className='flex-1'>
                    <h4 className='font-semibold text-sm'>{product.name}</h4>
                    <p className='text-xs text-gray-500'>{product.category}</p>
                    <div className='flex items-center gap-2 mt-1'>
                      <span className='font-bold text-blue-600'>${product.price}</span>
                      {product.oldPrice && (
                        <span className='text-xs text-gray-400 line-through'>${product.oldPrice}</span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Icons */}
        <div className='flex items-center gap-2 sm:gap-4'>
          {/* Mobile Search Icon */}
          <button className='md:hidden p-2 hover:bg-gray-100 rounded-full transition-colors'>
            <IoSearch className='text-xl text-gray-700' />
          </button>

          {/* Wishlist */}
          <div className='relative'>
            <button 
              className='p-2 hover:bg-gray-100 rounded-full transition-colors relative group'
              onClick={() => {
                setShowWishlist(!showWishlist);
                setShowCart(false);
              }}
            >
              <GoHeartFill className={`text-2xl sm:text-3xl transition-colors duration-300 ${wishlistCount > 0 ? 'text-red-500' : 'text-gray-700 group-hover:text-red-500'}`} />
              {wishlistCount > 0 && (
                <span className='absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse'>
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Wishlist Dropdown */}
            {showWishlist && (
              <div className='absolute top-full right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 animate-slideDown'>
                <div className='p-4 border-b border-gray-200 flex justify-between items-center bg-gradient-to-r from-red-50 to-pink-50 rounded-t-2xl'>
                  <h3 className='font-bold text-lg flex items-center gap-2'>
                    <GoHeartFill className='text-red-500' />
                    Wishlist ({wishlistCount})
                  </h3>
                  <div className='flex items-center gap-2'>
                    {wishlistCount > 0 && (
                      <button 
                        onClick={clearWishlist}
                        className='text-xs text-red-500 hover:text-red-700 px-2 py-1 rounded-full bg-white/50 hover:bg-white transition-colors'
                      >
                        Clear All
                      </button>
                    )}
                    <button 
                      onClick={() => setShowWishlist(false)}
                      className='text-gray-500 hover:text-gray-700 hover:scale-110 transition-transform'
                    >
                      <IoClose className='text-xl' />
                    </button>
                  </div>
                </div>
                
                <div className='max-h-96 overflow-y-auto'>
                  {wishlistItems.length === 0 ? (
                    <div className='p-8 text-center text-gray-500'>
                      <GoHeartFill className='text-5xl mx-auto mb-3 text-gray-300' />
                      <p className='font-semibold'>Your wishlist is empty</p>
                      <p className='text-sm mt-1'>Save your favorite items here</p>
                    </div>
                  ) : (
                    wishlistItems.map(item => (
                      <div key={item.id} className='p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors group'>
                        <div className='flex gap-3'>
                          <img src={item.image} alt={item.name} className='w-16 h-16 object-cover rounded-lg' />
                          <div className='flex-1'>
                            <h4 className='font-semibold text-sm'>{item.name}</h4>
                            <p className='text-xs text-gray-500 mb-1'>{item.category}</p>
                            <div className='flex items-center gap-2'>
                              <span className='font-bold text-blue-600'>${item.price}</span>
                              {item.oldPrice && (
                                <span className='text-xs text-gray-400 line-through'>${item.oldPrice}</span>
                              )}
                            </div>
                            <div className='flex gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity'>
                              <button 
                                onClick={() => moveToCart(item)}
                                className='text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 transition-colors flex items-center gap-1'
                              >
                                <FaShoppingCart className='text-xs' />
                                Move to Cart
                              </button>
                              <button 
                                onClick={() => removeFromWishlist(item.id)}
                                className='text-xs bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition-colors flex items-center gap-1'
                              >
                                <MdDelete className='text-xs' />
                                Remove
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                
                {wishlistItems.length > 0 && (
                  <div className='p-4 border-t border-gray-200 bg-gray-50 rounded-b-2xl'>
                    <Link to="/wishlist" className='w-full block bg-gradient-to-r from-red-500 to-pink-500 text-white py-2.5 rounded-xl font-semibold hover:from-red-600 hover:to-pink-600 transition-all duration-300 shadow-md hover:shadow-lg text-center'>
                      View All Wishlist
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Cart */}
          <div className='relative'>
            <button 
              className='p-2 hover:bg-gray-100 rounded-full transition-colors relative group'
              onClick={() => {
                setShowCart(!showCart);
                setShowWishlist(false);
              }}
            >
              <HiMiniShoppingBag className={`text-2xl sm:text-3xl transition-colors duration-300 ${cartCount > 0 ? 'text-blue-600' : 'text-gray-700 group-hover:text-blue-600'}`} />
              {cartCount > 0 && (
                <span className='absolute -top-1 -right-1 bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-bounce'>
                  {cartCount}
                </span>
              )}
            </button>

            {/* Cart Dropdown */}
            {showCart && (
              <div className='absolute top-full right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 animate-slideDown'>
                <div className='p-4 border-b border-gray-200 flex justify-between items-center bg-gradient-to-r from-blue-50 to-cyan-50 rounded-t-2xl'>
                  <h3 className='font-bold text-lg flex items-center gap-2'>
                    <HiMiniShoppingBag className='text-blue-600' />
                    Cart ({cartCount})
                  </h3>
                  <div className='flex items-center gap-2'>
                    {cartCount > 0 && (
                      <button 
                        onClick={clearCart}
                        className='text-xs text-red-500 hover:text-red-700 px-2 py-1 rounded-full bg-white/50 hover:bg-white transition-colors'
                      >
                        Clear All
                      </button>
                    )}
                    <button 
                      onClick={() => setShowCart(false)}
                      className='text-gray-500 hover:text-gray-700 hover:scale-110 transition-transform'
                    >
                      <IoClose className='text-xl' />
                    </button>
                  </div>
                </div>
                
                <div className='max-h-96 overflow-y-auto'>
                  {cartItems.length === 0 ? (
                    <div className='p-8 text-center text-gray-500'>
                      <HiMiniShoppingBag className='text-5xl mx-auto mb-3 text-gray-300' />
                      <p className='font-semibold'>Your cart is empty</p>
                      <p className='text-sm mt-1'>Add items to get started</p>
                    </div>
                  ) : (
                    cartItems.map(item => (
                      <div key={item.id} className='p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors'>
                        <div className='flex gap-3'>
                          <img src={item.image} alt={item.name} className='w-16 h-16 object-cover rounded-lg' />
                          <div className='flex-1'>
                            <h4 className='font-semibold text-sm'>{item.name}</h4>
                            <p className='text-xs text-gray-500 mb-1'>{item.category}</p>
                            <div className='flex items-center justify-between'>
                              <span className='font-bold text-blue-600'>${item.price}</span>
                              <button 
                                onClick={() => removeFromCart(item.id)}
                                className='text-red-500 hover:text-red-700'
                              >
                                <MdDelete className='text-lg' />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                
                {cartItems.length > 0 && (
                  <div className='p-4 border-t border-gray-200 bg-gray-50 rounded-b-2xl'>
                    <div className='flex justify-between items-center mb-3 px-2'>
                      <span className='font-semibold text-gray-700'>Total:</span>
                      <span className='font-bold text-xl text-blue-600'>${getTotalPrice()}</span>
                    </div>
                    <button className='w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-2.5 rounded-xl font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2'>
                      <FaShoppingCart />
                      Checkout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;