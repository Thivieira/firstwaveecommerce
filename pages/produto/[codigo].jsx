import React, { useMemo } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { getLoading, getProduct } from "../../store/selectors/products";
import { clearProduct, openProduct, setLoading } from "../../store/actions/products";

import FadeLoader from "react-spinners/FadeLoader";
import api from "../../services/api";

import ProductDetails from "../../components/Products/ProductDetails";

const DetailsProduct = ({ product }) => {
  const router = useRouter();
  const dispatch = useDispatch();

  const loading = useSelector(getLoading);

  useMemo(() => {
    const fetchProducts = async () => {
      dispatch(clearProduct());
      dispatch(setLoading(true))

      dispatch(openProduct(product));
      dispatch(setLoading(false));
    };

    fetchProducts();
  }, [dispatch]);

  return (
    <div className='page'>
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

// export const getStaticPaths = async () => {
//   const resMasc = await api.get("/produtos/categoria?genero=masculino");
//   const prodMasc = resMasc.data.map((el) => el.produto);

//   const prodMasculino = prodMasc.map((p) => {
//     return {
//       params: {
//          codigo: p.codigo 
//       },
//     };
//   });

//   return {
//     paths: prodMasculino,
//     fallback: true 
//   };
// };

export const getServerSideProps = async (ctx) => {
  const { codigo } = ctx.params;
  const res = await api.get(`/produto/${codigo}`);

  const product = res.data.produto;

  return {
    props: { product },
    // revalidate: 60 * 60 * 8, //a cada 8 horas uma nova req na API será feita
  };
};
