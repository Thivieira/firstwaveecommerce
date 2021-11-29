import { NextSeo } from "next-seo";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getLoading } from "../../store/selectors/products";
import { clearProduct, openProduct, setLoading } from "../../store/actions/products";

import { stripHtml } from "../../helpers";

import FadeLoader from "react-spinners/FadeLoader";
import { fetcher, serverFetcher } from "../../services/api";
import api from "../../services/api";

import ProductWrapper from "../../components/Products/ProductWrapper";
import useSWR from "swr";

export const getStaticPaths = async () => {
  const res = await fetcher("/products?all=true");

  const prodMasculino = res.data.map((p) => {
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

  const product = await serverFetcher(`/products/${code}`);

  return {
    props: { product, code },
    revalidate: 1,
  };
};

const DetailsProduct = ({ product, code }) => {
  const dispatch = useDispatch();

  const { data } = useSWR(`/products/${code}`, serverFetcher, {
    initialData: product,
  });

  const [apiProduct, setApiProduct] = useState(null)

  useEffect(() => {
    dispatch(clearProduct());
    dispatch(openProduct(data));
    api.get(`/products/${code}`).then((res) => {
      const axiosProduct = res.data;
      const productAxios = { ...axiosProduct, variations: axiosProduct.variations.map((el)=>{
        const swr = data.variations.filter(swrVar => {
          return swrVar.external_id == el.external_id
        })[0];

        return {...el, supply: swr.supply }
      })};
      setApiProduct(productAxios);
      dispatch(setLoading(false));
      console.log(productAxios)
    });
  }, [data, code, dispatch]);

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
        {loading || data.length == 0 || !apiProduct ? (
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
          <ProductWrapper product={apiProduct} />
        )}
      </div>
    </>
  );
};

export default DetailsProduct;
