import React, { useMemo } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useParams } from "react-router-dom"
import { getLoading, getProduct } from "../../selectors/products"
import { clearProduct, openProduct, setLoading } from "../../actions/products"

import FadeLoader from "react-spinners/FadeLoader"
import api from "../../services/api"

import ProductDetails from "../Products/ProductDetails"

const DetailsProduct = () => {
    const dispatch = useDispatch()
    const loading = useSelector(getLoading)

    const paramId = useParams()

    // const product = useSelector(getProduct)

    // useMemo(() => {
    //     const fetchProducts = async () => {
    //         dispatch(clearProduct())
    //         dispatch(setLoading(true))

    //         const res = await api.get(`/produto/${paramId.codigo}`, {
    //             headers: {
    //                 "Content-Type": "application/json",
    //                 accept: "application/json",
    //             },
    //         });
    //         console.log(res.data.produto)
    //         const prod = res.data.produto

    //         dispatch(openProduct(prod))
    //         dispatch(setLoading(false))
    //     };

    //     fetchProducts()
    // }, [dispatch])
   
    return (
        <div>
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

export const getStaticProps = async (ctx) => {
  const { codigo } = ctx.params
  const res = await api.get(`produto/${codigo}`)
  
    const product = res.data.produto
    console.log(product)
  
    return {
      props: { product },
      revalidate: 60 * 60 * 8, //a cada 8 horas uma nova req na API será feita
    }
  }
