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
import { fetcher } from "../../services/api";

import ProductDetails from "../../components/Products/ProductDetails";
import useSWR from "swr";

const DetailsProduct = ({ product, code }) => {
  const dispatch = useDispatch();

  const { data } = useSWR(`/products/${code}`, fetcher, {
    initialData: product,
  });

  useEffect(() => {
    dispatch(clearProduct());
    dispatch(setLoading(false));
    dispatch(openProduct(data));
  }, [data, dispatch]);

  const loading = useSelector(getLoading);

  return (
    <>
      <NextSeo
        title={`${data.description} - Lifestyle Floripa by Billabong`}
        description={
          data.variations.length > 0
            ? stripHtml(data.variations[0].short_description)
            : data.description
        }
      />

      <div className="page">
        {loading || data.length == 0 ? (
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
          <ProductDetails product={data} />
        )}
      </div>
    </>
  );
};

export default DetailsProduct;

export const getStaticPaths = async () => {
  const res = await fetcher("/products?all=true");

  const prodMasculino = res.map((p) => {
    return {
      params: {
        code: p.code,
      },
    };
  });

  return {
    paths: prodMasculino,
    fallback: "blocking",
  };
};

export const getStaticProps = async (ctx) => {
  const { code } = ctx.params;

  const product = await fetcher(`/products/${code}`);

  return {
    props: { product, code },
    //https://nextjs.org/docs/basic-features/data-fetching#incremental-static-regeneration
    revalidate: 60, // 12h
  };
};
