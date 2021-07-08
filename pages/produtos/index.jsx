import { useContext, useEffect, useState } from "react";
import { CategoryContext } from "../../contexts/CategoryContext";
import FadeLoader from "react-spinners/FadeLoader";
import ReactPaginate from "react-paginate";

import { useRouter } from "next/router";

import { useDispatch, useSelector } from "react-redux";
import { Drawer, Button, Alert } from "antd";
import { FilterOutlined } from "@ant-design/icons";
import { Menu, Dropdown } from "antd";
import { DownOutlined } from "@ant-design/icons";

import Breadcrumb from "../../components/Breadcrumb";
import Filter from "../../components/Filter";
import Product from "../../components/Products/ProductCard";
import api from "../../services/api";

import { getAllProducts, getLoading } from "../../store/selectors/products";
import {
  setProducts,
  clearProducts,
  setLoading,
  sortProducts,
} from "../../store/actions/products";

const products = () => {
  const { getCategory } = useContext(CategoryContext)
  console.log(getCategory)

  const router = useRouter();
  const dispatch = useDispatch();
  const products = useSelector(getAllProducts);
  let totalPages = 1;
  let per_page = 1;

  const loading = useSelector(getLoading);

  const [sort, setSort] = useState("menor");

  const [showFilter, setShowFilter] = useState(true);
  const [visible, setVisible] = useState(false);

  const [width, setWindowWidth] = useState(0);
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

  const showDrawerFilters = () => setVisible(true);
  const onCloseFilters = () => setVisible(false);

  const [currentPage, setCurrentPage] = useState(1);

  const pages = totalPages / per_page;

  const handleCloseAlert = async () => {
    // dispatch(setLoading(true));
    // const res = useFetch(`/products?search=${q}&page=${currentPage}`);
    // const prod = res.data.data;
    // dispatch(setProducts(prod));
    // dispatch(setLoading(false));
  };

  const changePage = ({ selected }) => setCurrentPage(selected + 1);

  //   const res = useFetch(`/products?search=${q}&page=${currentPage}`);
  //   const { data, error, mutate } = useSWR(
  //     `/products?search=${q}&page=${currentPage}`,
  //     async (url) => {
  //       const response = await api.get(url);

  //       return response.data;
  //     }
  //   );

  //   console.log(data);
  useEffect(async () => {
    dispatch(setLoading(true));
    const { data } = await api(`/products?search=${q}&page=${currentPage}`);
    dispatch(setProducts(data.data));
    dispatch(setLoading(false));
    totalPages = data.total;
    per_page = data.per_page;
  }, [currentPage, q]);

  const menu = (
    <Menu value={sort} onClick={(obj) => handleChangeSort(obj.item)}>
      <Menu.Item value="menor">
        <a>Menor para maior</a>
      </Menu.Item>
      <Menu.Item value="maior">
        <a>Maior para menor</a>
      </Menu.Item>
    </Menu>
  );

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

  const removeIdDuplicate = (id) => id + String(Math.random());

  return (
    <>
      <div className="products-wrapper">
        <div className="filter-sort">
          {products.length > 0 && (
            <>
              <p>{products.length} Produto(s) Encontrados</p>

              <Dropdown overlay={menu}>
                <a
                  className="ant-dropdown-link"
                  onClick={(e) => e.preventDefault()}
                >
                  Ordernar por preço <DownOutlined />
                </a>
              </Dropdown>
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
              <ReactPaginate
                previousLabel={"<"}
                nextLabel={">"}
                pageCount={pages}
                onPageChange={changePage}
                containerClassName={"paginationsBttn"}
                previousLinkClassName={"previousBttn"}
                nextLinkClassName={"nextBttn"}
                disabledClassName={"paginationDisabled"}
                activeClassName={"paginationActive"}
              />
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
            <Alert
              message="FILTROS"
              description="NENHUM PRODUTO FOI ENCONTRADO COM OS FILTROS SELECIONADOS"
              type="info"
              showIcon
              closable
              afterClose={handleCloseAlert}
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
              />
            </>
          ) : (
            <div className="site-drawer-render-in-current-wrapper">
              <Button
                type="text"
                size="small"
                icon={<FilterOutlined />}
                onClick={showDrawerFilters}
                className="btn-filter-mobile"
              >
                FILTROS
              </Button>

              <Drawer
                placement="left"
                closable={true}
                onClose={onCloseFilters}
                visible={visible}
                getContainer={false}
              >
                <div className="filter-mobile">
                  <Filter
                    category={getCategory.category}
                    subcategory={getCategory.subcategory}
                    type={getCategory.type}
                  />
                </div>
              </Drawer>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default products;
