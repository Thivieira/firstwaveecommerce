import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { getLoading, getProduct } from "../../store/selectors/products";
import {
  clearProduct,
  openProduct,
  setLoading,
} from "../../store/actions/products";

import FadeLoader from "react-spinners/FadeLoader";
import api from "../../services/api";

import ProductDetails from "../../components/Products/ProductDetails";

const DetailsProduct = ({ product }) => {
  // console.log(product)
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(clearProduct());
    dispatch(setLoading(false));
    dispatch(openProduct(product));
  }, [product.code]);

  const loading = useSelector(getLoading);
  // const reduxProduct = useSelector(getProduct);
  return (
    <div className="page">
      {loading || product.length == 0 ? (
        <div className="details-wrapper">
          <div className="spinner-product">
            <FadeLoader
              color={"#0080A8"}
              loading={loading}
              height={35}
              width={7.5}
              radius={5}
              margin={15}
            />
          </div>
        </div>
      ) : (
        <ProductDetails product={product} />
      )}
    </div>
  );
};

export default DetailsProduct;

export const getServerSideProps = async (ctx) => {
  const { codigo } = ctx.params;
  const res = await api.get(`/products/${codigo}`);

  const product = res.data;

  return {
    props: { product },
  };
};
