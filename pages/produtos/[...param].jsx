import { Fragment, useContext, useEffect, useState } from 'react'

import { Dialog, Transition } from '@headlessui/react'
import { XIcon, FilterIcon } from '@heroicons/react/outline'

import { NextSeo } from 'next-seo'
import { useRouter } from 'next/router'

import FadeLoader from 'react-spinners/FadeLoader'
import ReactPaginate from 'react-paginate'
import { useDispatch, useSelector } from 'react-redux'
import NoProductsAlert from '../../components/NoProductsAlert'
import BreadCrumb from '../../components/BreadCrumb'

import { CategoryContext } from '../../contexts/CategoryContext'
import Filter from '../../components/Filter'
import ProductCard from '../../components/Products/ProductCard'
import api from '../../services/api'

import {
  getFilterMode,
  getFilterUrl,
  getAllProducts,
  getLoading,
  getPaginationData
} from '../../store/selectors/products'

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
  const category = ctx.params.param[0]
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
  const [width, setWindowWidth] = useState(0)
  const [currentPage, setCurrentPage] = useState(0)
  const filterUrl = useSelector(getFilterUrl)
  const filterMode = useSelector(getFilterMode)
  const router = useRouter()
  const [openFilters, setOpenFilters] = useState(false)

  const updateDimensions = () => {
    setWindowWidth(window.innerWidth)
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
    setCategory({ category, subcategory, type })
  }, [setCurrentPage, setCategory, category, subcategory, type, filterUrl])

  useEffect(() => {
    const page = currentPage + 1
    dispatch(setLoading(false))
    dispatch(setProducts(prod))
    dispatch(setPaginationProducts(totalPages, page, per_page, total))
  }, [])

  useEffect(() => {
    if (currentPage != 1) {
      const page = currentPage + 1
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
        console.log(data, 'data')
        dispatch(setLoading(false))
        dispatch(setProducts(data.data))
        dispatch(
          setPaginationProducts(data.meta.last_page, page, data.meta.per_page, data.meta.total)
        )
      })
    }
  }, [dispatch, filterMode, filterUrl, currentPage, category, subcategory, type])

  const handleChangeSort = (item) => {
    const sortValue = item.props.value
    setSort(sortValue)

    const productsToSort = products

    if (sortValue === 'maior') {
      productsToSort.sort((a, b) => parseFloat(b.price) - parseFloat(a.price))
      dispatch(sortProducts(productsToSort, sortValue))
      return true
    }

    productsToSort.sort((a, b) => parseFloat(a.price) - parseFloat(b.price))

    dispatch(sortProducts(productsToSort, sortValue))

    return true
  }

  return (
    <>
      <NextSeo
        title={`${category} - Lifestyle Floripa by Billabong`}
        description={`${category} / ${subcategory} / ${type} - Sua surf shop na Praia Mole.`}
      />

      <div className="relative flex items-start justify-center sm:mb-10 xl:grid-cols-5">
        <div className="relative flex flex-col items-center justify-center w-auto my-10">
          {showFilter && loading !== true && (
            <>
              <BreadCrumb category={category} subcategory={subcategory} type={type} />
              <Filter
                category={category}
                subcategory={subcategory}
                type={type}
                brands={brands}
                sizes={sizes}
                colors={colors}
              />
            </>
          )}
        </div>

        <div className="relative flex flex-col w-full max-w-6xl mx-5 my-5 xl:col-span-4 sm:mx-10 sm:my-6">
          <div className="flex items-center justify-between px-2 py-6 xl:mr-10 xl:justify-end sm:pb-6">
            {products.length > 0 && (
              <>
                {!showFilter && (
                  <>
                    <button
                      onClick={() => setOpenFilters(true)}
                      className="flex items-center justify-center bg-transparent text-sm sm:text-base text-[#ff8b00] sm:ml-2"
                    >
                      FILTROS <FilterIcon className="w-5 h-5 ml-1" />
                    </button>

                    <Transition.Root show={openFilters} as={Fragment}>
                      <Dialog
                        as="div"
                        className="fixed inset-0 flex "
                        style={{ zIndex: 9999 }}
                        onClose={setOpenFilters}
                      >
                        <Transition.Child
                          as={Fragment}
                          enter="transition-opacity ease-linear duration-300"
                          enterFrom="opacity-0"
                          enterTo="opacity-100"
                          leave="transition-opacity ease-linear duration-300"
                          leaveFrom="opacity-100"
                          leaveTo="opacity-0"
                        >
                          <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-25" />
                        </Transition.Child>

                        <Transition.Child
                          as={Fragment}
                          enter="transition ease-in-out duration-300 transform"
                          enterFrom="-translate-x-full"
                          enterTo="translate-x-0"
                          leave="transition ease-in-out duration-300 transform"
                          leaveFrom="translate-x-0"
                          leaveTo="-translate-x-full"
                        >
                          <div className="relative flex flex-col w-full max-w-xs pb-12 overflow-y-auto bg-white shadow-xl">
                            <div className="flex justify-between px-4 pt-4">
                              <button
                                type="button"
                                className="inline-flex items-center justify-center p-2 -m-2 text-gray-400 bg-transparent rounded-md"
                                onClick={() => setOpenFilters(false)}
                              >
                                <XIcon className="w-6 h-6" aria-hidden="true" />
                              </button>
                            </div>

                            <nav className="space-y-1 px-4 pt-8 divide-y divide-[rgba(0,128,168,0.4)] ">
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
                            </nav>
                          </div>
                        </Transition.Child>
                      </Dialog>
                    </Transition.Root>
                  </>
                )}

                <div className="flex items-center justify-end text-sm">
                  <p className=" mb-0 text-[#0080a8]">
                    {paginationRedux.theTotal} Produto(s) Encontrados
                  </p>
                  <div className="pl-3 sm:pl-6">
                    <FilterSort handleChangeSort={handleChangeSort} sort={sort} />
                  </div>
                </div>
              </>
            )}
          </div>
          {products.length > 0 ? (
            <div className="flex flex-col">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {products.map((product) => (
                  <ProductCard product={product} key={removeIdDuplicate(product.id)} />
                ))}
              </div>

              {paginationRedux.totalPages > 1 ? (
                <ReactPaginate
                  previousLabel="<"
                  nextLabel=">"
                  pageCount={paginationRedux.totalPages}
                  onPageChange={(selected) => changePage(selected)}
                  forcePage={currentPage}
                  containerClassName="paginationsBttn"
                  previousLinkClassName="previousBttn"
                  nextLinkClassName="nextBttn"
                  disabledClassName="paginationDisabled"
                  activeClassName="paginationActive"
                />
              ) : null}
            </div>
          ) : loading === true ? (
            <div className="flex items-center justify-center h-[200px] mb-10">
              <FadeLoader
                className="spinner-products"
                color="#0080A8"
                loading={loading}
                height={35}
                width={7.5}
                radius={5}
                margin={15}
              />
            </div>
          ) : (
            <NoProductsAlert category={category} currentPage={currentPage} />
          )}
        </div>
      </div>
    </>
  )
}
