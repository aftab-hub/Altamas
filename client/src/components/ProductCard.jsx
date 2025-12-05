import React from "react";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";

const ProductCard = ({ product }) => {
  const { currency, addToCart, removeFromCart, cartItems, navigate } = useAppContext();

  return (
    product && (
      <div
        onClick={() => {
          navigate(`/products/${product.category.toLowerCase()}/${product._id}`);
          scrollTo(0, 0);
        }}
        className="
          border border-gray-500/20 rounded-md bg-white 
          px-3 md:px-4 py-2 
          min-w-40 max-w-56 w-full 
          cursor-pointer transition
        "
      >
        {/* IMAGE */}
        <div className="flex items-center justify-center p-2">
          <img
            className="group-hover:scale-105 transition max-w-24 sm:max-w-28 md:max-w-36"
            src={product.image[0]}
            alt={product.name}
          />
        </div>

        {/* CONTENT */}
        <div className="text-gray-500/60 text-xs sm:text-sm">
          <p>{product.category}</p>

          <p className="text-gray-700 font-medium text-base sm:text-lg truncate">
            {product.name}
          </p>

          {/* RATING */}
          <div className="flex items-center gap-1 mt-1">
            {Array(5)
              .fill("")
              .map((_, i) => (
                <img
                  key={i}
                  className="w-3.5 sm:w-4"
                  src={i < 4 ? assets.star_icon : assets.star_dull_icon}
                  alt=""
                />
              ))}
            <p>(4)</p>
          </div>

          {/* PRICE + CART */}
          <div className="flex items-end justify-between mt-3">
            <p className="text-primary font-medium text-base sm:text-xl">
              {currency}
              {product.offerPrice}{" "}
              <span className="text-gray-500/60 line-through text-xs sm:text-sm">
                {currency}
                {product.price}
              </span>
            </p>

            {/* CART BUTTONS */}
            <div
              onClick={(e) => e.stopPropagation()}
              className="text-primary select-none"
            >
              {!cartItems[product._id] ? (
                <button
                  className="
                    flex items-center justify-center gap-1
                    bg-primary/10 border border-primary/40
                    w-[64px] sm:w-[75px] md:w-[80px] 
                    h-[32px] sm:h-[34px]
                    rounded cursor-pointer
                  "
                  onClick={() => addToCart(product._id)}
                >
                  <img src={assets.cart_icon} alt="cart_icon" />
                  Add
                </button>
              ) : (
                <div
                  className="
                    flex items-center justify-center gap-2 
                    bg-primary/25 
                    w-[64px] sm:w-[75px] md:w-[80px] 
                    h-[32px] sm:h-[34px]
                    rounded
                  "
                >
                  <button
                    onClick={() => removeFromCart(product._id)}
                    className="px-2"
                  >
                    -
                  </button>
                  <span className="w-5 text-center">
                    {cartItems[product._id]}
                  </span>
                  <button
                    onClick={() => addToCart(product._id)}
                    className="px-2"
                  >
                    +
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default ProductCard;
