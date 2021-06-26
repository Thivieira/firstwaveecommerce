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
  getProducts,
  clearProducts,
  setLoading,
  sortProducts,
} from "../../store/actions/products";

const Produtos = ({ produtos, categoria, subcategoria, tipo }) => {
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
    dispatch(getProducts(produtos));
    console.log(produtos);
  }, [produtos]);

  useEffect(() => {
    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  });

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

  const totalPages = 4745 / 100;

  const handleCloseModal = async () => {
    dispatch(setLoading(true));
    const res = await api.get(`/produtos/categoria?categoria=${categoria}`);
    const prod = res.data.map((el) => el.produto);
    dispatch(getProducts(prod));
    window.location.reload();
    dispatch(setLoading(false));
  };

  const changePage = ({ selected }) => setCurrentPage(selected + 1);

  useEffect(() => {
    setTimeout(() => {
      window.scrollTo(0, 0, { behavior: "smooth" });
    }, 2000);
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
        return parseFloat(b.preco) - parseFloat(a.preco);
      });
      dispatch(sortProducts(productsToSort, sortValue));
      return true;
    }

    productsToSort.sort((a, b) => {
      return parseFloat(a.preco) - parseFloat(b.preco);
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
                pageCount={totalPages}
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
              className="spinner-produtos"
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
              afterClose={handleCloseModal}
            />
          )}
        </div>

        <div className="filter">
          {showFilter ? (
            <>
              <Breadcrumb
                categoria={categoria}
                subcategoria={subcategoria}
                tipo={tipo}
              />
              <Filter />
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
                  <Filter />
                </div>
              </Drawer>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Produtos;

export const getStaticPaths = async () => {
  // const resMasc = await api.get("/produtos/categoria?genero=masculino&subcategoria=vestuario&tipo=bermuda");
  // const prodMasc = resMasc.data

  // const prodMasculino = prodMasc.map((p) => {
  //   return {
  //     params: {
  //        produtos: prodMasc
  //     },
  //   };
  // });

  return {
    paths: [
      "/produtos/categoria?categoria=masculino&subcategoria=vestuario&tipo=bermuda",
    ],
    fallback: true,
  };
};

export const getStaticProps = async (ctx) => {
  console.log(ctx);
  const categoria = ctx.params.param[0];
  const subcategoria = ctx.params.param[1];
  const tipo = ctx.params.param[2];

  // const busca = ctx.query.nome; fazer no client

  let produtos;
  let res;

  if (categoria && subcategoria && tipo) {
    res = await api.get(
      `/produtos/categoria?categoria=${categoria}&subcategoria=${subcategoria}&tipo=${tipo}`
    );
    produtos = res.data.map((el) => el.produto);
  } else if (categoria && subcategoria && !tipo) {
    res = await api.get(
      `/produtos/categoria?categoria=${categoria}&subcategoria=${subcategoria}`
    );
    produtos = res.data.map((el) => el.produto);
  } else if (categoria && !subcategoria && !tipo) {
    res = await api.get(`/produtos/categoria?categoria=${categoria}`);
    produtos = res.data.map((el) => el.produto);
  }

  // else {
  //   res = await api.get(`/produtos/busca?nome=${busca}`);
  //   produtos = res.data.map((el) => el.produto);
  // }

  return {
    props: { produtos, categoria, subcategoria, tipo },
    revalidate: 60 * 60 * 1, //a cada 1 horas uma nova req na API será feita
  };
};
