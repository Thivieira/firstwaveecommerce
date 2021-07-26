import React, { useCallback, useState, useRef, useEffect } from "react";

import { useRouter } from "next/router";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { InputAdornment, TextField } from "@material-ui/core";
import { Slider } from "antd";
import api from "../../services/api";

import { useSelector, useDispatch } from "react-redux";
import {
  getAllProducts,
  getFilterData,
  getAllProductSize,
  getAllProductColor,
  getAllProductBrands,
  getLoading,
} from "../../store/selectors/products";
import {
  setProducts,
  clearProducts,
  setLoading,
  setFilterData,
  setPaginationProducts,
  setFilterUrl
} from "../../store/actions/products";

function Filter({ category, subcategory, type, brands, sizes, colors }) {
  const dispatch = useDispatch();
  const products = useSelector(getAllProducts);

  const selectedFilterRedux = useSelector(getFilterData)

  const [selectedSize, setSelectedSize] = useState(selectedFilterRedux.filtersSize);
  const [selectedColor, setSelectedColor] = useState(selectedFilterRedux.filtersColor);
  const [selectedBrand, setSelectedBrand] = useState(selectedFilterRedux.filtersBrand);

  const [selectedPriceMin, setSelectedPriceMin] = useState(selectedFilterRedux.selectedPriceMin);
  const [selectedPriceMax, setSelectedPriceMax] = useState(selectedFilterRedux.selectedPriceMax);

  let filtersSize = selectedSize.map((el) => el.value);
  let filtersColor = selectedColor.map((el) => el.value);
  let filtersBrand = selectedBrand.map((el) => el.value);

  const selectInputRefSize = useRef();
  const selectInputRefColor = useRef();
  const selectInputRefBrand = useRef();

  useEffect(() => {
    dispatch(setFilterData(filtersSize, filtersColor, filtersBrand, selectedPriceMin, selectedPriceMax))
  }, [selectedSize, selectedColor, selectedBrand, selectedPriceMin, selectedPriceMax])


  const addFilterApi = useCallback(async () => {
    dispatch(clearProducts());
    dispatch(setLoading(true));

    if (subcategory && type && category) {
      let url = `/products/filters?category=${category}&subcategory=${subcategory}&type=${type}&size=${filtersSize}&color=${filtersColor}&brand=${filtersBrand}&maxPrice=${selectedPriceMax}&minPrice=${selectedPriceMin}`
      const res = await api.get(url)
      const prod = res.data.data;
      setFilterUrl(url)
      dispatch(setProducts(prod));
      dispatch(setLoading(false));
      dispatch(setPaginationProducts(res.data.last_page, res.data.currentPage, res.data.per_page, res.data.total))
    } else if (!type && subcategory && category) {
      let url = `/products/filters?category=${category}&subcategory=${subcategory}&size=${filtersSize}&color=${filtersColor}&brand=${filtersBrand}&maxPrice=${selectedPriceMax}&minPrice=${selectedPriceMin}`
      const res = await api.get(url)
      const prod = res.data.data;
      setFilterUrl(url)
      dispatch(setProducts(prod));
      dispatch(setLoading(false));
      dispatch(setPaginationProducts(res.data.last_page, res.data.currentPage, res.data.per_page, res.data.total))
    } else if (!subcategory && !type && category) {
      const res = await api.get(
        `/products/filters?category=${category}&size=${filtersSize}&color=${filtersColor}&brand=${filtersBrand}&maxPrice=${selectedPriceMax}&minPrice=${selectedPriceMin}`
      );
      const prod = res.data.data;
      dispatch(setProducts(prod));
      dispatch(setLoading(false));
      dispatch(setPaginationProducts(res.data.last_page, res.data.currentPage, res.data.per_page, res.data.total))
    } else {
      const res = await api.get(
        `/products/filters?size=${filtersSize}&color=${filtersColor}&brand=${filtersBrand}&maxPrice=${selectedPriceMax}&minPrice=${selectedPriceMin}`
      );
      const prod = res.data.data;
      dispatch(setProducts(prod));
      dispatch(setLoading(false));
      dispatch(setPaginationProducts(res.data.last_page, res.data.currentPage, res.data.per_page, res.data.total))
    }
  }, [
    dispatch,
    products,
    filtersColor,
    filtersSize,
    filtersBrand,
    category,
    subcategory,
    type,
  ]);

  const animatedComponents = makeAnimated();

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

  const formatter = (value) => `R$${value},00`;

  function selectedPrice(value) {
    setSelectedPriceMin(value[0]);
    setSelectedPriceMax(value[1]);
  }

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
          options={sizes.map((el) => ({
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
          options={colors.map((el) => ({
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
          options={brands.map((el) => ({
            label: el,
            value: el,
          }))}
          classNamePrefix="select"
          onChange={setSelectedBrand}
          ref={selectInputRefBrand}
        />
      </div>

      <div className="filter-option-price">
        <h4 style={{ color: "#FF8B00" }}>Filtro de preço</h4>
        <Slider
          style={{ margin: "2rem 0" }}
          range
          defaultValue={[0, 2000]}
          max={2000}
          min={0}
          tipFormatter={formatter}
          onChange={selectedPrice}
          step={100}
        />
      </div>

      <div className="btn-actions-filter">
        <button className="btn-filter" onClick={addFilterApi}>
          BUSCAR
        </button>
        <button className="btn-filter-clean" onClick={cleanFilters}>
          LIMPAR
        </button>
      </div>
    </div>
  );
}

export default Filter;
