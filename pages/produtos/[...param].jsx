import { useEffect, useState } from "react";
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

const products = ({
  prod,
  totalPages,
  per_page,
  category,
  subcategory,
  type,
}) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const products = useSelector(getAllProducts);

  const loading = useSelector(getLoading);

  const [sort, setSort] = useState("menor");

  const [showFilter, setShowFilter] = useState(true);
  const [visible, setVisible] = useState(false);

  const [width, setWindowWidth] = useState(0);

  useEffect(() => {
    dispatch(clearProducts());
    dispatch(setLoading(false));
    dispatch(setProducts(prod));
  }, []);

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
    dispatch(setLoading(true));
    const res = await api.get(`/products?category=${category}`);
    const prod = res.data.data;
    dispatch(setProducts(prod));
    dispatch(setLoading(false));
  };

  const changePage = ({ selected }) => setCurrentPage(selected + 1);

  useEffect(() => {
    let filterString = ``;
    category ? (filterString += `category=${category}`) : ``;
    subcategory ? (filterString += `&subcategory=${subcategory}`) : ``;
    type ? (filterString += `&type=${type}`) : ``;
    dispatch(setLoading(true));
    api.get(`/products?${filterString}&page=${currentPage}`).then((res) => {
      dispatch(setLoading(false));
      dispatch(setProducts(res.data.data));
      // products = data.data;
      totalPages = res.data.total;
      per_page = res.data.per_page;
    });
  }, [currentPage]);

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
                category={category}
                subcategory={subcategory}
                type={type}
              />
              <Filter
                category={category}
                subcategory={subcategory}
                type={type}
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
                    category={category}
                    subcategory={subcategory}
                    type={type}
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

export const getStaticPaths = async () => {
  let paths = [
    { params: { param: ["surf"] } },
    { params: { param: ["masculino"] } },
    { params: { param: ["feminino"] } },
    { params: { param: ["juvenil"] } },
    { params: { param: ["calcado"] } },
    { params: { param: ["acessorio"] } },
    { params: { param: ["acessorio", "oculos"] } },
    { params: { param: ["acessorio", "relogio"] } },
    { params: { param: ["surf", "wetsuit"] } },
    { params: { param: ["surf", "quilha"] } },
    { params: { param: ["surf", "leash"] } },
    { params: { param: ["surf", "lycra"] } },
    { params: { param: ["surf", "prancha"] } },
    { params: { param: ["surf", "capa"] } },
    { params: { param: ["surf", "deck"] } },
    { params: { param: ["surf", "bone"] } },
    { params: { param: ["masculino", "vestuario"] } },
    { params: { param: ["masculino", "vestuario", "bermuda"] } },
    { params: { param: ["masculino", "vestuario", "camiseta"] } },
    { params: { param: ["masculino", "vestuario", "camisa"] } },
    { params: { param: ["masculino", "vestuario", "regata"] } },
    { params: { param: ["masculino", "vestuario", "calca"] } },
    { params: { param: ["masculino", "vestuario", "jaqueta"] } },
    { params: { param: ["masculino", "vestuario", "sunga"] } },
    { params: { param: ["masculino", "acessorio"] } },
    { params: { param: ["masculino", "acessorio", "bone"] } },
    { params: { param: ["masculino", "acessorio", "mochila"] } },
    { params: { param: ["masculino", "acessorio", "carteira"] } },
    { params: { param: ["masculino", "acessorio", "cinto"] } },
    { params: { param: ["masculino", "acessorio", "pochete"] } },
    { params: { param: ["masculino", "acessorio", "gorro"] } },
    { params: { param: ["masculino", "acessorio", "meia"] } },
    { params: { param: ["feminino", "vestuario"] } },
    { params: { param: ["feminino", "vestuario", "short"] } },
    { params: { param: ["feminino", "vestuario", "saia"] } },
    { params: { param: ["feminino", "vestuario", "calca"] } },
    { params: { param: ["feminino", "vestuario", "camiseta"] } },
    { params: { param: ["feminino", "vestuario", "regata"] } },
    { params: { param: ["feminino", "vestuario", "vestido"] } },
    { params: { param: ["feminino", "vestuario", "macaquinho"] } },
    { params: { param: ["feminino", "vestuario", "body"] } },
    { params: { param: ["feminino", "vestuario", "jaqueta"] } },
    { params: { param: ["feminino", "vestuario", "biquini"] } },
    { params: { param: ["feminino", "acessorio"] } },
    { params: { param: ["feminino", "acessorio", "pochete"] } },
    { params: { param: ["feminino", "acessorio", "mochila"] } },
    { params: { param: ["feminino", "acessorio", "bone"] } },
    { params: { param: ["feminino", "acessorio", "cinto"] } },
    { params: { param: ["feminino", "acessorio", "carteira"] } },
    { params: { param: ["feminino", "acessorio", "gorro"] } },
    { params: { param: ["feminino", "acessorio", "necessaire"] } },
    { params: { param: ["feminino", "acessorio", "meia"] } },
    { params: { param: ["juvenil", "vestuario"] } },
    { params: { param: ["juvenil", "vestuario", "camiseta"] } },
    { params: { param: ["juvenil", "vestuario", "regata"] } },
    { params: { param: ["juvenil", "vestuario", "bermuda"] } },
    { params: { param: ["juvenil", "vestuario", "calca"] } },
    { params: { param: ["juvenil", "vestuario", "jaqueta"] } },
  ];

  return {
    paths,
    fallback: "blocking",
  };
};

export const getStaticProps = async (ctx) => {
  let category = ctx.params.param[0];
  let subcategory = ctx.params.param[1];
  let type = ctx.params.param[2];

  // const busca = ctx.query.nome; fazer no client

  let products;
  let res;
  let totalPages;
  let per_page;

  if (category && subcategory && type) {
    res = await api.get(
      `/products?category=${category}&subcategory=${subcategory}&type=${type}`
    );
    products = res.data.data;
    totalPages = res.data.total;
    per_page = res.data.per_page;
  } else if (category && subcategory && !type) {
    type = null;
    res = await api.get(
      `/products?category=${category}&subcategory=${subcategory}`
    );
    products = res.data.data;
    totalPages = res.data.total;
    per_page = res.data.per_page;
  } else {
    res = await api.get(`/products?category=${category}`);
    products = res.data.data;
    subcategory = null;
    type = null;
    totalPages = res.data.total;
    per_page = res.data.per_page;
  }

  console.log({
    URL: `/products?category=${category}&subcategory=${subcategory}&type=${type}`,
  });

  // console.log(res.data.data);

  // else {
  //   res = await api.get(`/products/busca?nome=${busca}`);
  //   products = res.data.map((el) => el.produto);
  // }

  return {
    props: {
      prod: products,
      totalPages,
      per_page,
      category,
      subcategory,
      type,
    },
    revalidate: 60 * 60 * 8, //a cada 8 horas uma nova req na API será feita
  };
};
