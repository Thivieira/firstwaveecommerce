import { useContext, useEffect, useState } from 'react'
import { NextSeo } from 'next-seo'
import { useRouter } from 'next/router'

import NoProductsAlert from '../../components/NoProductsAlert'
import FadeLoader from 'react-spinners/FadeLoader'
import ReactPaginate from 'react-paginate'
import { useDispatch, useSelector } from 'react-redux'
import { Drawer, Button } from 'antd'
import { FilterOutlined } from '@ant-design/icons'

import { CategoryContext } from '../../contexts/CategoryContext'
import Breadcrumb from '../../components/Breadcrumb'
import Filter from '../../components/Filter'
import ProductCard from '../../components/Products/ProductCard'
import api from '../../services/api'

import { getFilterMode, getFilterUrl } from '../../store/selectors/products'

import { getAllProducts, getLoading, getPaginationData } from '../../store/selectors/products'

import {
  setProducts,
  clearProducts,
  setLoading,
  sortProducts,
  setPaginationProducts,
  setFilterData,
  setFilterUrl
} from '../../store/actions/products'

import { removeIdDuplicate } from '../../helpers'
import FilterSort from '../../components/FilterSort'
import catalogPaths from '../../catalog-paths'

export async function getStaticPaths(ctx) {
  const paths = catalogPaths
  return {
    paths,
    fallback: 'blocking'
  }
}

export async function getStaticProps(ctx) {
  let category = ctx.params.param[0]
  let subcategory = ctx.params.param[1]
  let type = ctx.params.param[2]

  let url
  let products
  let total
  let totalPages
  let per_page
  let last_page

  let sizeDataUrl
  let brandDataUrl
  let colorDataUrl
  let sizes
  let brands
  let colors

  if (category && subcategory && type) {
    url = `/products?category=${category}&subcategory=${subcategory}&type=${type}`
  } else if (category && subcategory && !type) {
    type = null
    url = `/products?category=${category}&subcategory=${subcategory}`
  } else {
    url = `/products?category=${category}`
    subcategory = null
    type = null
  }

  const res = await api(url)

  products = res.data.data
  total = res.data.meta.total
  totalPages = res.data.meta.last_page
  per_page = res.data.meta.per_page

  if (category && subcategory && type) {
    sizeDataUrl = `/products/sizes?category=${category}&subcategory=${subcategory}&type=${type}`
    brandDataUrl = `/products/brands?category=${category}&subcategory=${subcategory}&type=${type}`
    colorDataUrl = `/products/colors?category=${category}&subcategory=${subcategory}&type=${type}`
  } else if (category && subcategory && !type) {
    sizeDataUrl = `/products/sizes?category=${category}&subcategory=${subcategory}`
    brandDataUrl = `/products/brands?category=${category}&subcategory=${subcategory}`
    colorDataUrl = `/products/colors?category=${category}&subcategory=${subcategory}`
  } else {
    sizeDataUrl = `/products/sizes?category=${category}`
    brandDataUrl = `/products/brands?category=${category}`
    colorDataUrl = `/products/colors?category=${category}`
  }

  const sizeData = await api.get(sizeDataUrl)
  const brandData = await api.get(brandDataUrl)
  const colorData = await api.get(colorDataUrl)

  sizes = sizeData.data
  brands = brandData.data
  colors = colorData.data

  if (!products) {
    return {
      redirect: {
        destination: '/',
        permanent: false
      }
    }
  }

  return {
    props: {
      prod: products,
      total,
      totalPages,
      per_page,
      category,
      subcategory,
      type,
      sizes,
      brands,
      colors
    },
    revalidate: 60
  }
}

export default function Products({
  prod,
  total,
  totalPages,
  per_page,
  category,
  subcategory,
  type,
  sizes,
  brands,
  colors
}) {
  const { setCategory } = useContext(CategoryContext)
  const dispatch = useDispatch()
  const products = useSelector(getAllProducts)
  const loading = useSelector(getLoading)
  const [sort, setSort] = useState('menor')
  const [showFilter, setShowFilter] = useState(true)
  const [visible, setVisible] = useState(false)
  const [width, setWindowWidth] = useState(0)
  const [currentPage, setCurrentPage] = useState(0)
  const filterUrl = useSelector(getFilterUrl)
  const filterMode = useSelector(getFilterMode)
  const router = useRouter()

  const updateDimensions = () => {
    const width = window.innerWidth
    setWindowWidth(width)
  }

  useEffect(() => {
    updateDimensions()

    window.addEventListener('resize', updateDimensions)

    return () => window.removeEventListener('resize', updateDimensions)
  }, [width])

  useEffect(() => {
    width < 1280 ? setShowFilter(false) : setShowFilter(true)
  }, [setShowFilter, width])

  const changePage = ({ selected }) => {
    setCurrentPage(selected)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  useEffect(() => {
    const handleRouteChange = (url, { shallow }) => {
      dispatch(setFilterUrl(''))
      dispatch(setFilterData([], [], [], 0, 2000))
    }

    router.events.on('routeChangeStart', handleRouteChange)
    return () => {
      router.events.off('routeChangeStart', handleRouteChange)
    }
  }, [router, dispatch])

  const paginationRedux = useSelector(getPaginationData)

  useEffect(() => {
    setCurrentPage(0)
    setCategory({ category: category, subcategory: subcategory, type: type })
  }, [setCurrentPage, setCategory, category, subcategory, type, filterUrl])

  useEffect(() => {
    let page = currentPage + 1
    dispatch(setLoading(false))
    dispatch(setProducts(prod))
    dispatch(setPaginationProducts(totalPages, page, per_page, total))
  }, [])

  useEffect(() => {
    if (currentPage != 1) {
      let page = currentPage + 1
      let url = ''

      if (filterUrl) {
        url = `${filterUrl}&page=${page}`
      } else {
        let filterString = ``
        category ? (filterString += `category=${category}`) : ``
        subcategory ? (filterString += `&subcategory=${subcategory}`) : ``
        type ? (filterString += `&type=${type}`) : ``
        url = `/products?${filterString}&page=${page}`
      }

      dispatch(setLoading(true))
      dispatch(clearProducts())

      api.get(url).then(({ data }) => {
        dispatch(setLoading(false))
        dispatch(setProducts(data.data))
        dispatch(
          setPaginationProducts(data.meta.last_page, page, data.meta.per_page, data.meta.total)
        )
      })
    }
  }, [dispatch, filterMode, filterUrl, currentPage, category, subcategory, type])

  const handleChangeSort = (item) => {
    let sortValue = item.props.value
    setSort(sortValue)

    let productsToSort = products

    if (sortValue === 'maior') {
      productsToSort.sort((a, b) => {
        return parseFloat(b.price) - parseFloat(a.price)
      })
      dispatch(sortProducts(productsToSort, sortValue))
      return true
    }

    productsToSort.sort((a, b) => {
      return parseFloat(a.price) - parseFloat(b.price)
    })

    dispatch(sortProducts(productsToSort, sortValue))

    return true
  }

  return (
    <>
      <NextSeo
        title={`${category} - Lifestyle Floripa by Billabong`}
        description={`${category} / ${subcategory} / ${type} - Sua surf shop na Praia Mole.`}
      />
      <div className="products-wrapper">
        <div className="filter-sort">
          {products.length > 0 && (
            <>
              <p>{paginationRedux.theTotal} Produto(s) Encontrados</p>

              <FilterSort handleChangeSort={handleChangeSort} sort={sort} />
            </>
          )}
        </div>

        <div className="products">
          {products.length > 0 ? (
            <>
              {products.map((product) => (
                <ProductCard product={product} key={removeIdDuplicate(product.id)} />
              ))}
              {paginationRedux.totalPages > 1 ? (
                <ReactPaginate
                  previousLabel={'<'}
                  nextLabel={'>'}
                  pageCount={paginationRedux.totalPages}
                  onPageChange={(selected) => changePage(selected)}
                  forcePage={currentPage}
                  containerClassName={'paginationsBttn'}
                  previousLinkClassName={'previousBttn'}
                  nextLinkClassName={'nextBttn'}
                  disabledClassName={'paginationDisabled'}
                  activeClassName={'paginationActive'}
                />
              ) : null}
            </>
          ) : loading === true ? (
            <FadeLoader
              className="spinner-products"
              color={'#0080A8'}
              loading={loading}
              height={35}
              width={7.5}
              radius={5}
              margin={15}
            />
          ) : (
            <NoProductsAlert category={category} currentPage={currentPage} />
          )}
        </div>

        <div className="filter">
          {showFilter ? (
            <>
              <Breadcrumb category={category} subcategory={subcategory} type={type} />
              <Filter
                category={category}
                subcategory={subcategory}
                type={type}
                brands={brands}
                sizes={sizes}
                colors={colors}
              />
            </>
          ) : (
            <div className="site-drawer-render-in-current-wrapper">
              <Button
                type="text"
                size="small"
                icon={<FilterOutlined />}
                onClick={() => setVisible(true)}
                className="btn-filter-mobile"
              >
                FILTROS
              </Button>

              <Drawer
                placement="left"
                closable={true}
                onClose={() => setVisible(false)}
                visible={visible}
                getContainer={false}
              >
                <div className="filter-mobile">
                  <Filter
                    category={category}
                    subcategory={subcategory}
                    type={type}
                    brands={brands}
                    sizes={sizes}
                    colors={colors}
                  />
                </div>
              </Drawer>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
