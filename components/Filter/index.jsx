import React, { useCallback, useState, useRef } from "react";

import { useRouter } from "next/router";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { InputAdornment, TextField } from "@material-ui/core";
import api from "../../services/api";

import { useSelector, useDispatch } from "react-redux";
import {
  getAllProducts,
  getAllProductSize,
  getAllProductColor,
  getAllProductBrands,
  getLoading,
} from "../../store/selectors/products";
import {
  getProducts,
  clearProducts,
  setLoading,
} from "../../store/actions/products";

function Filter() {
  const dispatch = useDispatch();
  const router = useRouter();

  const categoria = router.query.param[0];
  const subcategoria = router.query.param[1];
  const tipo = router.query.param[2];

  // console.log(categoria, subcategoria, tipo)

  const products = useSelector(getAllProducts);
  // console.log(products)

  const [selectedSize, setSelectedSize] = useState([]);
  const [selectedColor, setSelectedColor] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState([]);

  const [selectedPriceMin, setSelectedPriceMin] = useState("");
  const [selectedPriceMax, setSelectedPriceMax] = useState("");

  let filtersSize = selectedSize.map((el) => el.value);
  let filtersColor = selectedColor.map((el) => el.value);
  let filtersBrand = selectedBrand.map((el) => el.value);

  const selectInputRefSize = useRef();
  const selectInputRefColor = useRef();
  const selectInputRefBrand = useRef();

  const addFilterApi = useCallback(async () => {
    dispatch(clearProducts());
    dispatch(setLoading(true));

    if (
      subcategoria !== undefined &&
      tipo !== undefined &&
      categoria !== undefined
    ) {
      const res = await api.get(
        `/produtos/categoria?categoria=${categoria}&subcategoria=${subcategoria}&tipo=${tipo}&tamanho=${filtersSize}&cor=${filtersColor}&marca=${filtersBrand}&precoMax=${selectedPriceMax}&precoMin=${selectedPriceMin}`
      );
      const prod = res.data.map((el) => el.produto);
      dispatch(getProducts(prod));
      dispatch(setLoading(false));
    } else if (
      subcategoria !== undefined &&
      tipo === undefined &&
      categoria !== undefined
    ) {
      const res = await api.get(
        `/produtos/categoria?categoria=${categoria}&subcategoria=${subcategoria}&tamanho=${filtersSize}&cor=${filtersColor}&marca=${filtersBrand}&precoMax=${selectedPriceMax}&precoMin=${selectedPriceMin}`
      );
      const prod = res.data.map((el) => el.produto);
      dispatch(getProducts(prod));
      dispatch(setLoading(false));
    } else if (
      subcategoria === undefined &&
      tipo === undefined &&
      categoria !== undefined
    ) {
      const res = await api.get(
        `/produtos/categoria?categoria=${categoria}&tamanho=${filtersSize}&cor=${filtersColor}&marca=${filtersBrand}&precoMax=${selectedPriceMax}&precoMin=${selectedPriceMin}`
      );
      const prod = res.data.map((el) => el.produto);
      dispatch(getProducts(prod));
      dispatch(setLoading(false));
    } else {
      const res = await api.get(
        `/produtos/categoria?tamanho=${filtersSize}&cor=${filtersColor}&marca=${filtersBrand}&precoMax=${selectedPriceMax}&precoMin=${selectedPriceMin}`
      );
      const prod = res.data.map((el) => el.produto);
      dispatch(getProducts(prod));
      dispatch(setLoading(false));
    }
  }, [
    dispatch,
    products,
    filtersColor,
    filtersSize,
    filtersBrand,
    categoria,
    subcategoria,
    tipo,
  ]);

  const animatedComponents = makeAnimated();

  const brands = useSelector(getAllProductBrands);
  const brandsNoRepeat = [...new Set(brands)];

  const colors = useSelector(getAllProductColor);
  const colorsNoRepeat = [...new Set(colors)];

  const sizes = useSelector(getAllProductSize);
  const sizesNoRepeat = [...new Set(sizes)].filter(Boolean);

  const cleanFilters = () => {
    selectInputRefSize.current.select.clearValue();
    selectInputRefColor.current.select.clearValue();
    selectInputRefBrand.current.select.clearValue();

    filtersSize = "";
    filtersColor = "";
    filtersBrand = "";
    setSelectedPriceMin("");
    setSelectedPriceMax("");

    addFilterApi();
  };

  return (
    <div className="filter">
      <h3>FILTROS</h3>

      <div className="filter-option">
        <Select
          placeholder="TAMANHO"
          closeMenuOnSelect={false}
          className="basic-multi-select size"
          name="marcas"
          components={animatedComponents}
          isMulti={true}
          options={sizesNoRepeat.map((el) => ({
            label: el,
            value: el,
          }))}
          classNamePrefix="select"
          onChange={setSelectedSize}
          ref={selectInputRefSize}
        />
      </div>

      <div className="filter-option">
        <Select
          placeholder="COR"
          closeMenuOnSelect={false}
          className="basic-multi-select color"
          name="marcas"
          components={animatedComponents}
          isMulti={true}
          options={colorsNoRepeat.map((el) => ({
            label: el,
            value: el,
          }))}
          classNamePrefix="select"
          onChange={setSelectedColor}
          ref={selectInputRefColor}
        />
      </div>

      <div className="filter-option">
        <Select
          placeholder="MARCA"
          closeMenuOnSelect={false}
          className="basic-multi-select brand"
          name="marcas"
          components={animatedComponents}
          isMulti={true}
          options={brandsNoRepeat.map((el) => ({
            label: el,
            value: el,
          }))}
          classNamePrefix="select"
          onChange={setSelectedBrand}
          ref={selectInputRefBrand}
        />
      </div>

      <div className="filter-option-price">
        <div className="price-input">
          <TextField
            className="filter-price"
            onChange={(e) => setSelectedPriceMin(e.target.value)}
            value={selectedPriceMin}
            InputProps={{
              endAdornment: <InputAdornment>R$</InputAdornment>,
            }}
            id="minPrice"
            label="Preço Min"
            type="number"
            variant="outlined"
            margin="dense"
            size="small"
          />
        </div>
        <div className="price-input">
          <TextField
            className="filter-price"
            onChange={(e) => setSelectedPriceMax(e.target.value)}
            value={selectedPriceMax}
            InputProps={{
              endAdornment: <InputAdornment>R$</InputAdornment>,
            }}
            id="maxPrice"
            label="Preço Max"
            type="number"
            variant="outlined"
            margin="dense"
            size="small"
            error={selectedPriceMax < selectedPriceMin ? true : false}
          />
        </div>
      </div>

      <div className="btn-actions-filter">
        <button className="btn-filter-clean" onClick={cleanFilters}>
          LIMPAR
        </button>
        <button className="btn-filter" onClick={addFilterApi}>
          FILTRAR
        </button>
      </div>
    </div>
  );
}

export default Filter;
