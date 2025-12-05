import React from 'react'
import ProductCard from './ProductCard'
import { useAppContext } from '../context/AppContext';

const BestSeller = () => {
  const { products } = useAppContext();

  return (
    <div className="mt-16">
      <p className="text-2xl md:text-3xl font-medium">Best Sellers</p>

      {/* Fully responsive grid for all screens */}
      <div
        className="
          grid 
          grid-cols-2              /* small screens */
          sm:grid-cols-3           /* ≥640px */
          md:grid-cols-4           /* ≥768px */
          lg:grid-cols-5           /* ≥1024px */
          gap-3 md:gap-6 
          mt-6 
          auto-rows-fr             /* makes all cards equal height */
        "
      >
        {products
          .filter((product) => product.inStock)
          .slice(0, 5)
          .map((product, index) => (
            <div key={index} className="h-full">
              <ProductCard product={product} />
            </div>
          ))}
      </div>
    </div>
  );
};

export default BestSeller;
