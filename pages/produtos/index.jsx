import { Fragment, useContext, useEffect, useState, useCallback } from 'react'

import { Dialog, Transition } from '@headlessui/react'
import { XIcon, FilterIcon } from '@heroicons/react/outline'

import { useRouter } from 'next/router'
import FadeLoader from 'react-spinners/FadeLoader'
import ReactPaginate from 'react-paginate'

import { useDispatch, useSelector } from 'react-redux'

import { CategoryContext } from '../../contexts/CategoryContext'

import Filter from '../../components/Filter'
import ProductCard from '../../components/Products/ProductCard'
import api from '../../services/api'
import {
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
import NoProductsAlert from '../../components/NoProductsAlert'
import { removeIdDuplicate } from '../../helpers'
import FilterSort from '../../components/FilterSort'
import { NextSeo } from 'next-seo'

export default function Index() {
  const { getCategory } = useContext(CategoryContext)
  const dispatch = useDispatch()
  const products = useSelector(getAllProducts)
  const loading = useSelector(getLoading)
  const [sort, setSort] = useState('menor')
  const [showFilter, setShowFilter] = useState(true)
  const [openFilters, setOpenFilters] = useState(false)
  const [width, setWindowWidth] = useState(0)
  const [currentPage, setCurrentPage] = useState(0)
  const [sizes, setSizes] = useState([])
  const [brands, setBrands] = useState([])
  const [colors, setColors] = useState([])
  const filterUrl = useSelector(getFilterUrl)
  const router = useRouter()
  const { q } = router.query

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

  const getData = useCallback(
    async (url, type) => {
      const res = await api.get(url)
      switch (type) {
        case 'size':
          setSizes(res.data)
          break
        case 'brand':
          setBrands(res.data)
          break
        case 'color':
          setColors(res.data)
          break
      }
      return res.data
    },
    []
    // [sizes, brands, colors]
  )

  useEffect(() => {
    if (getCategory.category && getCategory.subcategory && getCategory.type) {
      getData(
        `/products/sizes?category=${getCategory.category}&subcategory=${getCategory.subcategory}&type=${getCategory.type}`,
        'size'
      )
      getData(
        `/products/brands?category=${getCategory.category}&subcategory=${getCategory.subcategory}&type=${getCategory.type}`,
        'brand'
      )
      getData(
        `/products/colors?category=${getCategory.category}&subcategory=${getCategory.subcategory}&type=${getCategory.type}`,
        'color'
      )
    } else if (getCategory.category && getCategory.subcategory && !getCategory.type) {
      getData(
        `/products/sizes?category=${getCategory.category}&subcategory=${getCategory.subcategory}`,
        'size'
      )
      getData(
        `/products/brands?category=${getCategory.category}&subcategory=${getCategory.subcategory}`,
        'brand'
      )
      getData(
        `/products/colors?category=${getCategory.category}&subcategory=${getCategory.subcategory}`,
        'color'
      )
    } else if (getCategory.category && !getCategory.subcategory && !getCategory.type) {
      getData(`/products/sizes?category=${getCategory.category}`, 'size')
      getData(`/products/brands?category=${getCategory.category}`, 'brand')
      getData(`/products/colors?category=${getCategory.category}`, 'color')
    } else {
      getData(`/products/sizes`, 'size')
      getData(`/products/brands`, 'brand')
      getData(`/products/colors`, 'color')
    }
  }, [q, getCategory.category, getCategory.subcategory, getCategory.type, getData])

  useEffect(() => setCurrentPage(0), [q])

  useEffect(() => {
    const apiSearch = !q ? q : q.includes('s' || 'S', q.length - 1) ? q.slice(0, -1) : q

    const page = currentPage + 1
    let url = ''

    if (filterUrl) {
      url = `${filterUrl}&search=${apiSearch}&page=${page}`
    } else {
      let filterString = ``
      getCategory.category ? (filterString += `category=${getCategory.category}`) : ``
      getCategory.subcategory ? (filterString += `&subcategory=${getCategory.subcategory}`) : ``
      getCategory.type ? (filterString += `&type=${getCategory.type}`) : ``
      url = `/products?${filterString}&search=${apiSearch}&page=${page}`
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
  }, [
    filterUrl,
    currentPage,
    q,
    dispatch,
    getCategory.category,
    getCategory.subcategory,
    getCategory.type
  ])

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
        title={`${getCategory.category} - Lifestyle Floripa by Billabong`}
        description={`${getCategory.category} / ${getCategory.subcategory} / ${getCategory.type} - Sua surf shop na Praia Mole.`}
      />

      <div className="relative flex items-start justify-center xl:grid-cols-5">
        <div className="relative flex flex-col items-center justify-center w-auto my-10">
          {showFilter && loading !== true && (
            <Filter
              category={getCategory.category}
              subcategory={getCategory.subcategory}
              type={getCategory.type}
              brands={brands}
              sizes={sizes}
              colors={colors}
            />
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
                                  category={getCategory.category}
                                  subcategory={getCategory.subcategory}
                                  type={getCategory.type}
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
            <NoProductsAlert category={getCategory.category} currentPage={currentPage} />
          )}
        </div>
      </div>
    </>
  )
}
