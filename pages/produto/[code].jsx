import { NextSeo } from "next-seo";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getLoading } from "../../store/selectors/products";
import { clearProduct, openProduct, setLoading } from "../../store/actions/products";

import { stripHtml } from "../../helpers";

import FadeLoader from "react-spinners/FadeLoader";
import { fetcher, serverFetcher } from "../../services/api";

import ProductWrapper from "../../components/Products/ProductWrapper";
import useSWR from "swr";

export async function getStaticPaths(ctx) {
  const res = await fetcher("/products?all=true");

  const paths = res.data.map((p) => {
    return {
      params: {
        code: p.code,
      },
    };
  });

  return {
    paths,
    fallback: 'blocking',
  }
}

export async function getStaticProps(ctx) {
  const { code } = ctx.params;

  const product = await serverFetcher(`/products/${code}`);

  return {
    props: { product, code },
    revalidate: 200,
  };
}

export const getServerSideProps = async (ctx) => {
 const { code } = ctx.params;

 const product = await serverFetcher(`/products/${code}`);

 return {
   props: { product, code },
 };
}

const DetailsProduct = ({ product, code }) => {
  const dispatch = useDispatch();

  const { data } = useSWR(`/products/${code}`, serverFetcher, {
    fallbackData: product
  });

  useEffect(() => {
    console.log(data)
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
          <ProductWrapper product={data} />
        )}
      </div>
    </>
  );
};

export default DetailsProduct;
