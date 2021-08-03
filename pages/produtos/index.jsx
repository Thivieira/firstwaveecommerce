import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { CategoryContext } from "../../contexts/CategoryContext";
import FadeLoader from "react-spinners/FadeLoader";
import ReactPaginate from "react-paginate";

import { useDispatch, useSelector } from "react-redux";
import { Drawer, Button, Alert } from "antd";
import { FilterOutlined } from "@ant-design/icons";
import { Menu, Dropdown } from "antd";
import { DownOutlined } from "@ant-design/icons";

import Breadcrumb from "../../components/Breadcrumb";
import Filter from "../../components/Filter";
import Product from "../../components/Products/ProductCard";
import api from "../../services/api";
import { getFilterUrl } from "../../store/selectors/products";

import {
  getAllProducts,
  getLoading,
  getPaginationData,
} from "../../store/selectors/products";
import {
  setProducts,
  clearProducts,
  setLoading,
  sortProducts,
  setPaginationProducts,
  setFilterData,
  setFilterUrl,
} from "../../store/actions/products";
import NoProductsAlert from "../../components/NoProductsAlert";
import { removeIdDuplicate } from "../../helpers";
import FilterSort from "../../components/FilterSort";

export default function index() {
  const { getCategory, setCategory } = useContext(CategoryContext);
  const dispatch = useDispatch();
  const products = useSelector(getAllProducts);
  const loading = useSelector(getLoading);
  const [sort, setSort] = useState("menor");
  const [showFilter, setShowFilter] = useState(true);
  const [visible, setVisible] = useState(false);
  const [width, setWindowWidth] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [theTotal, setTotal] = useState(0);
  const [sizes, setSizes] = useState([]);
  const [brands, setBrands] = useState([]);
  const [colors, setColors] = useState([]);
  const filterUrl = useSelector(getFilterUrl);
  const router = useRouter();
  const { q } = router.query;

  useEffect(() => {
    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, [width]);

  const updateDimensions = () => {
    const width = window.innerWidth;
    setWindowWidth(width);
  };

  useEffect(() => {
    width < 1280 ? setShowFilter(false) : setShowFilter(true);
  });

  const changePage = ({ selected }) => {
    setCurrentPage(selected);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    const handleRouteChange = (url, { shallow }) => {
      dispatch(setFilterUrl(""));
      dispatch(setFilterData([], [], [], 0, 2000));
    };

    router.events.on("routeChangeStart", handleRouteChange);

    return () => {
      router.events.off("routeChangeStart", handleRouteChange);
    };
  }, [router]);

  const paginationRedux = useSelector(getPaginationData);

  useEffect(async () => {
    let sizeData;
    let brandData;
    let colorData;

    if (getCategory.category && getCategory.subcategory && getCategory.type) {
      sizeData = await api.get(
        `/products/sizes?category=${getCategory.category}&subcategory=${getCategory.subcategory}&type=${getCategory.type}`
      );
      brandData = await api.get(
        `/products/brands?category=${getCategory.category}&subcategory=${getCategory.subcategory}&type=${getCategory.type}`
      );
      colorData = await api.get(
        `/products/colors?category=${getCategory.category}&subcategory=${getCategory.subcategory}&type=${getCategory.type}`
      );
    } else if (
      getCategory.category &&
      getCategory.subcategory &&
      !getCategory.type
    ) {
      sizeData = await api.get(
        `/products/sizes?category=${getCategory.category}&subcategory=${getCategory.subcategory}`
      );
      brandData = await api.get(
        `/products/brands?category=${getCategory.category}&subcategory=${getCategory.subcategory}`
      );
      colorData = await api.get(
        `/products/colors?category=${getCategory.category}&subcategory=${getCategory.subcategory}`
      );
    } else {
      sizeData = await api.get(
        `/products/sizes?category=${getCategory.category}`
      );
      brandData = await api.get(
        `/products/brands?category=${getCategory.category}`
      );
      colorData = await api.get(
        `/products/colors?category=${getCategory.category}`
      );
    }

    setSizes(sizeData.data);
    setBrands(brandData.data);
    setColors(colorData.data);
  }, []);

  useEffect(() => setCurrentPage(0), [q]);

  useEffect(async () => {
    let apiSearch = !q
      ? q
      : q.includes("s" || "S", q.length - 1)
      ? q.slice(0, -1)
      : q;
    let page = currentPage + 1;
    dispatch(setLoading(true));
    // dispatch(clearProducts());
    const { data } = await api(`/products?search=${apiSearch}&page=${page}`);
    dispatch(setProducts(data.data));
    dispatch(setLoading(false));
    dispatch(
      setPaginationProducts(data.last_page, page, data.per_page, data.total)
    );
  }, [currentPage, q]);

  // useEffect(() => {
  //   let page = currentPage + 1;
  //   let url = "";

  //   if (filterUrl) {
  //     // console.log("FILTER", filterUrl);
  //     url = `${filterUrl}&page=${page}`;
  //   } else {
  //     let filterString = ``;
  //     getCategory.category
  //       ? (filterString += `category=${getCategory.category}`)
  //       : ``;
  //     getCategory.subcategory
  //       ? (filterString += `&subcategory=${getCategory.subcategory}`)
  //       : ``;
  //     getCategory.type ? (filterString += `&type=${getCategory.type}`) : ``;
  //     url = `/products?${filterString}&page=${page}`;
  //   }

  //   dispatch(setLoading(true));
  //   dispatch(clearProducts());

  //   api.get(url).then(({ data }) => {
  //     dispatch(setLoading(false));
  //     dispatch(setProducts(data.data));
  //     setTotal(data.total);
  //     dispatch(
  //       setPaginationProducts(data.last_page, page, data.per_page, data.total)
  //     );
  //   });
  // }, [currentPage, dispatch]);

  const handleChangeSort = (item) => {
    let sortValue = item.props.value;
    setSort(sortValue);

    let productsToSort = products;

    if (sortValue === "maior") {
      productsToSort.sort((a, b) => {
        return parseFloat(b.price) - parseFloat(a.price);
      });
      dispatch(sortProducts(productsToSort, sortValue));
      return true;
    }

    productsToSort.sort((a, b) => {
      return parseFloat(a.price) - parseFloat(b.price);
    });
    dispatch(sortProducts(productsToSort, sortValue));
    return true;
  };

  return (
    <>
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
                <Product
                  product={product}
                  key={removeIdDuplicate(product.id)}
                />
              ))}
              {paginationRedux.theTotal > 15 ? (
                <ReactPaginate
                  previousLabel={"<"}
                  nextLabel={">"}
                  pageCount={paginationRedux.totalPages}
                  onPageChange={(selected) => changePage(selected)}
                  forcePage={currentPage}
                  containerClassName={"paginationsBttn"}
                  previousLinkClassName={"previousBttn"}
                  nextLinkClassName={"nextBttn"}
                  disabledClassName={"paginationDisabled"}
                  activeClassName={"paginationActive"}
                />
              ) : null}
            </>
          ) : loading === true ? (
            <FadeLoader
              className="spinner-products"
              color={"#0080A8"}
              loading={loading}
              height={35}
              width={7.5}
              radius={5}
              margin={15}
            />
          ) : (
            <NoProductsAlert
              category={getCategory.category}
              currentPage={currentPage}
            />
          )}
        </div>

        <div className="filter">
          {showFilter ? (
            <>
              <Breadcrumb
                category={getCategory.category}
                subcategory={getCategory.subcategory}
                type={getCategory.type}
              />
              <Filter
                category={getCategory.category}
                subcategory={getCategory.subcategory}
                type={getCategory.type}
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
                    category={getCategory.category}
                    subcategory={getCategory.subcategory}
                    type={getCategory.type}
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
  );
}
