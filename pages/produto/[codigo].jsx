import { NextSeo } from "next-seo";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getLoading } from "../../store/selectors/products";
import {
  clearProduct,
  openProduct,
  setLoading,
} from "../../store/actions/products";

import { stripHtml } from "../../helpers";

import FadeLoader from "react-spinners/FadeLoader";
import api from "../../services/api";

import ProductDetails from "../../components/Products/ProductDetails";

const DetailsProduct = ({ product }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(clearProduct());
    dispatch(setLoading(false));
    dispatch(openProduct(product));
  }, [product, dispatch]);

  const loading = useSelector(getLoading);

  return (
    <>
      <NextSeo
        title={`${product.description} - Lifestyle Floripa by Billabong`}
        description={
          product.variations.length > 0
            ? stripHtml(product.variations[0].short_description)
            : product.description
        }
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

export const getStaticPaths = async () => {
  const res = await api.get("/products?all=true");

  const prodMasculino = res.data.map((p) => {
    return {
      params: {
        codigo: p.code,
      },
    };
  });

  return {
    paths: prodMasculino,
    fallback: "blocking",
  };
};

export const getStaticProps = async (ctx) => {
  const { codigo } = ctx.params;
  const res = await api.get(`/products/${codigo}`);

  const product = res.data;

  return {
    props: { product },
    revalidate: 43200, // 12h
  };
};
