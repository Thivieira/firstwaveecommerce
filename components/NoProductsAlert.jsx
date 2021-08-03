import api from "../services/api";

import { useDispatch } from "react-redux";

import {
  setProducts,
  clearProducts,
  setLoading,
  setPaginationProducts,
  setFilterData,
  setFilterUrl,
} from "../store/actions/products";

import { Alert } from "antd";

export default function NoProductsAlert({ category, currentPage }) {
  const dispatch = useDispatch();

  // const [currentPage, setCurrentPage] = useState(0);
  // const [theTotal, setTotal] = useState(total);

  const handleCloseAlert = async () => {
    dispatch(setLoading(true));
    dispatch(clearProducts());
    const res = await api.get(`/products?category=${category}`);
    const prod = res.data.data;
    dispatch(setProducts(prod));
    dispatch(setLoading(false));
    dispatch(setFilterUrl(""));
    dispatch(setFilterData([], [], [], 0, 2000));
    dispatch(
      setPaginationProducts(
        res.data.last_page,
        currentPage + 1,
        res.data.per_page,
        res.data.total
      )
    );
  };

  return (
    <Alert
      message="FILTROS"
      description="NENHUM PRODUTO FOI ENCONTRADO COM OS FILTROS SELECIONADOS"
      type="info"
      showIcon
      closable
      afterClose={handleCloseAlert}
    />
  );
}
