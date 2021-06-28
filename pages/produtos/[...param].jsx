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
  // produtos/categoria/subcategoria/tipo
  //   let params = {
  //     surf: [
  //       "wetsuit",
  //       "quilha",
  //       "leash",
  //       "lycra",
  //       "prancha",
  //       "capa",
  //       "deck",
  //       "bone",
  //     ],
  //     masculino: {
  //       vestuario: [
  //         "bermuda",
  //         "camiseta",
  //         "camisa",
  //         "regata",
  //         "calca",
  //         "jaqueta",
  //         "sunga",
  //       ],
  //       acessorio: [
  //         "bone",
  //         "mochila",
  //         "carteira",
  //         "cinto",
  //         "pochete",
  //         "gorro",
  //         "meia",
  //       ],
  //     },
  //     feminino: {
  //       vestuario: [
  //         "short",
  //         "saia",
  //         "calca",
  //         "camiseta",
  //         "regata",
  //         "vestido",
  //         "macaquinho",
  //         "body",
  //         "jaqueta",
  //         "biquini",
  //       ],
  //       acessorio: [
  //         "pochete",
  //         "mochila",
  //         "bone",
  //         "cinto",
  //         "carteira",
  //         "gorro",
  //         "necessaire",
  //         "meia",
  //       ],
  //     },
  //     juvenil: {
  //       vestuario: ["camiseta", "regata", "bermuda", "calca", "jaqueta"],
  //     },
  //     calcado: {},
  //     acessorio: {},
  //     oculos: {},
  //     relogio: {},
  //   };

  //   let paths = [];
  // paths = params.map((el, i)=>{
  //   paths.push({params: {param:[el[i]]}})
  // })

  // let paths = [];s

  // for (var rootKey in filters) {
  //   if (filters.hasOwnProperty(rootKey)) {
  //     let categoria = filters[rootKey];
  //     paths.push(`/produtos/${categoria}`);
  //     for (var childKey in filters[rootKey]) {
  //       if (filters[rootKey].hasOwnProperty(childKey)) {
  //         paths.push(`/produtos/${item}`);
  //         filters[childKey]
  //       }
  //     }
  //     // return
  //   }
  // }
  //"/produtos/${}/${}/${}"


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
  ]

  return {
    paths,
    fallback: "blocking",
  };
};

export const getStaticProps = async (ctx) => {
  const categoria = ctx.params.param[0];
  let subcategoria = ctx.params.param[1];
  let tipo = ctx.params.param[2];

  // const busca = ctx.query.nome; fazer no client

  let produtos;
  let res;

  if (categoria && subcategoria && tipo) {
    res = await api.get(
      `/produtos/categoria?categoria=${categoria}&subcategoria=${subcategoria}&tipo=${tipo}`
    );
    produtos = res.data.map((el) => el.produto);
  } else if (categoria && subcategoria && !tipo) {
    tipo = null;
    res = await api.get(
      `/produtos/categoria?categoria=${categoria}&subcategoria=${subcategoria}`
    );
    produtos = res.data.map((el) => el.produto);
  } else if (categoria && !subcategoria && !tipo) {
    res = await api.get(`/produtos/categoria?categoria=${categoria}`);
    produtos = res.data.map((el) => el.produto);
    subcategoria = null;
    tipo = null;
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
