import React from 'react';
import Navbar from '../Navbar/Navbar';
import Banner from '../Banner/Banner';
import Products from '../Product/Product';

const Home = () => {
  return (
    <div>
      <Navbar />
      <Banner />
      <Products />
    </div>
  );
};

export default Home;