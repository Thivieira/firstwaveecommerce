import React, { useMemo } from "react";
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
  const loading = useSelector(getLoading);

  // const paramId = useParams();

  // const product = useSelector(getProduct);

  useMemo(() => {
    const fetchProducts = async () => {
      dispatch(clearProduct());
      dispatch(setLoading(true));

      // const res = await api.get(`/produto/${paramId.codigo}`, {
      //   headers: {
      //     "Content-Type": "application/json",
      //     accept: "application/json",
      //   },
      // });
      // console.log(res.data.produto);
      // const prod = res.data.produto;

      dispatch(openProduct(product));
      dispatch(setLoading(false));
    };

    fetchProducts();
  }, [dispatch]);

  return (
    <>
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
    </>
  );
};

export default DetailsProduct;

export const getStaticPaths = async () => {
  const res = await api.get("/produtos/categoria?genero=masculino");

  const prod = res.data.map((el) => el.produto);

  const pathsSelected = prod.map((p) => {
    return {
      params: {
        codigo: p.codigo,
      },
    };
  });

  return {
    paths: pathsSelected,
    fallback: "blocking", //incremental static regeneration | só redireciona para a página quando ela for carregada
  };
};

export const getStaticProps = async (ctx) => {
  const { codigo } = ctx.params;
  const res = await api.get(`/produto/${codigo}`);

  const product = res.data.produto;

  return {
    props: { product },
    revalidate: 60 * 60 * 8, //a cada 8 horas uma nova req na API será feita
  };
};
