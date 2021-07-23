import React, { useCallback, useState, useRef } from "react";

import { useRouter } from "next/router";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { InputAdornment, TextField } from "@material-ui/core";
import { Slider } from "antd";
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
  setProducts,
  clearProducts,
  setLoading,
} from "../../store/actions/products";

export const getStaticProps = async (ctx) => {
  console.log(ctx);
  const category = ctx.params.param[0];
  const subcategory = ctx.params.param[1];
  const type = ctx.params.param[2];

  return {
    props: { category, subcategory, type },
  };
};

function Filter({ category, subcategory, type }) {
  const dispatch = useDispatch();

  const products = useSelector(getAllProducts);

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

  console.log(
    filtersSize,
    filtersColor,
    filtersBrand,
    selectedPriceMin,
    selectedPriceMax
  );

  console.log(products);

  const addFilterApi = useCallback(async () => {
    dispatch(clearProducts());
    dispatch(setLoading(true));

    if (subcategory && type && category) {
      const res = await api.get(
        `/produtos?category=${category}&subcategory=${subcategory}&type=${type}&size=${filtersSize}&color=${filtersColor}&brand=${filtersBrand}&maxPrice=${selectedPriceMax}&minPrice=${selectedPriceMin}`
      );
      const prod = res.data.data;
      dispatch(setProducts(prod));
      dispatch(setLoading(false));
    } else if (!type && subcategory && category) {
      const res = await api.get(
        `/produtos?category=${category}&subcategory=${subcategory}&size=${filtersSize}&color=${filtersColor}&brand=${filtersBrand}&maxPrice=${selectedPriceMax}&minPrice=${selectedPriceMin}`
      );
      const prod = res.data.data;
      dispatch(setProducts(prod));
      dispatch(setLoading(false));
    } else if (!subcategory && !type && category) {
      const res = await api.get(
        `/produtos?category=${category}&size=${filtersSize}&color=${filtersColor}&brand=${filtersBrand}&maxPrice=${selectedPriceMax}&minPrice=${selectedPriceMin}`
      );
      const prod = res.data.data;
      dispatch(setProducts(prod));
      dispatch(setLoading(false));
    } else {
      const res = await api.get(
        `/produtos?size=${filtersSize}&color=${filtersColor}&brand=${filtersBrand}&maxPrice=${selectedPriceMax}&minPrice=${selectedPriceMin}`
      );
      const prod = res.data.data;
      dispatch(setProducts(prod));
      dispatch(setLoading(false));
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

  const brands = useSelector(getAllProductBrands);
  const brandsNoRepeat = [...new Set(brands)].filter(Boolean);

  const colors = useSelector(getAllProductColor);
  const colorsNoRepeat = [...new Set(colors)].filter(Boolean);

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

    // addFilterApi();
  };

  const formatter = (value) => `R$${value},00`;

  function selectedPrice(value) {
    setSelectedPriceMin(value[0]);
    setSelectedPriceMax(value[1]);
    console.log(selectedPriceMin, selectedPriceMax);
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
