import { useState, useEffect, useCallback } from "react";

import ProductImage from "./ProductImage";
import ProductContent from "./ProductContent";
import ProductContextProvider from "../../contexts/ProductContextProvider";

const ProductWrapper = ({ product }) => {
  return (
    <div className="details-wrapper">
      <ProductContextProvider product={product}>
        <ProductImage />
        <ProductContent />
      </ProductContextProvider>
    </div>
  );
};

export default ProductWrapper;
