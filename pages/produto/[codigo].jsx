import { NextSeo } from "next-seo";
import { useEffect } from "react";
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
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(clearProduct());
    dispatch(setLoading(false));
    dispatch(openProduct(product));
  }, [product.code]);

  const loading = useSelector(getLoading);

  return (
    <>
      <NextSeo
        title={`${product.description} - Lifestyle Floripa by Billabong`}
        description={function stripHtml() {
             let tmp = document.createElement("DIV");
             tmp.innerHTML = product.short_description;
             return tmp.textContent || tmp.innerText || "";
        }}
      />
      
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
    </>
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
