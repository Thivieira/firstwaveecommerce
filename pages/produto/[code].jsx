import { NextSeo } from 'next-seo'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import FadeLoader from 'react-spinners/FadeLoader'
import useSWR from 'swr'
import { getLoading } from '../../store/selectors/products'
import { clearProduct, openProduct, setLoading } from '../../store/actions/products'

import { stripHtml } from '../../helpers'

import api, { fetcher, serverFetcher } from '../../services/api'

import ProductWrapper from '../../components/Products/ProductWrapper'
import ProductsSlider from '../../components/landing/ProductsSlider'

export async function getStaticPaths(ctx) {
  const res = await fetcher('/products?all=true')

  const paths = res.data.map((p) => ({
    params: {
      code: p.code
    }
  }))

  return {
    paths,
    fallback: 'blocking'
  }
}

export async function getStaticProps(ctx) {
  const { code } = ctx.params

  const product = await serverFetcher(`/products/${code}`)

  const res = await api.get('/products?limit=12')
  const others = res.data.data

  return {
    props: { product, code, others },
    revalidate: 200
  }
}

function DetailsProduct({ product, code, others }) {
  const dispatch = useDispatch()

  const { data } = useSWR(`/products/${code}`, serverFetcher, {
    fallbackData: product
  })

  useEffect(() => {
    dispatch(clearProduct())
    dispatch(setLoading(false))
    dispatch(openProduct(data))
  }, [data, dispatch])

  const loading = useSelector(getLoading)

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
        {loading || data.length === 0 ? (
          <div className="details-wrapper">
            <div className="spinner-product">
              <FadeLoader
                color="#0080A8"
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

        <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
          <div className="products-carousel-container">
            <h3 className="products-carousel-title">Veja também</h3>
            <ProductsSlider prod={others} />
          </div>
        </div>
      </div>
    </>
  )
}

export default DetailsProduct
