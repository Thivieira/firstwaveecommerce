import { useState, useRef, useEffect, useCallback } from "react";

import Select from "react-select";
import makeAnimated from "react-select/animated";

import { Slider } from "antd";

import { useSelector, useDispatch } from "react-redux";
import { getFilterData } from "../../store/selectors/products";
import {
  setFilterData,
  setFilterUrl,
  setFilterMode,
} from "../../store/actions/products";
import { removeFromArray } from "../../helpers";

function Filter({ category, subcategory, type, brands, sizes, colors }) {
  const dispatch = useDispatch();

  const selectedFilterRedux = useSelector(getFilterData);

  const [selectedSize, setSelectedSize] = useState(selectedFilterRedux.size);
  const [selectedColor, setSelectedColor] = useState(selectedFilterRedux.color);
  const [selectedBrand, setSelectedBrand] = useState(selectedFilterRedux.brand);

  const [selectedPriceMin, setSelectedPriceMin] = useState(
    selectedFilterRedux.priceMin
  );
  const [selectedPriceMax, setSelectedPriceMax] = useState(
    selectedFilterRedux.priceMax
  );

  const [brandsArr, setBrandsArr] = useState([]);
  const [sizesArr, setSizesArr] = useState([]);
  const [colorsArr, setColorsArr] = useState([]);

  useEffect(() => {
    if (brands) {
      setBrandsArr(brands);
    }
    if (sizes) {
      const sizeOrder = removeFromArray(sizes, [
        "",
        "G",
        "GG",
        "GG1",
        "M",
        "P",
        "U",
      ]).concat(["P", "M", "G", "GG", "GG1", "U"]);
      setSizesArr(sizeOrder);
    }
    if (colors) {
      setColorsArr(colors);
    }
  }, [setBrandsArr, setSizesArr, setColorsArr, brands, sizes, colors]);

  var filtersSize =
    selectedSize.length > 0
      ? selectedSize.map((el) => (typeof el === "object" ? el.value : el))
      : selectedSize;
  var filtersColor =
    selectedColor.length > 0
      ? selectedColor.map((el) => (typeof el === "object" ? el.value : el))
      : selectedColor;
  var filtersBrand =
    selectedBrand.length > 0
      ? selectedBrand.map((el) => (typeof el === "object" ? el.value : el))
      : selectedBrand;

  const selectInputRefSize = useRef();
  const selectInputRefColor = useRef();
  const selectInputRefBrand = useRef();

  useEffect(() => {
    dispatch(
      setFilterData(
        filtersSize,
        filtersColor,
        filtersBrand,
        selectedPriceMin,
        selectedPriceMax
      )
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    selectedPriceMin,
    selectedPriceMax,
    dispatch,
    selectedSize,
    selectedColor,
    selectedBrand,
  ]);

  const addFilterApi = useCallback(() => {
    let url = "";

    if (subcategory && type && category) {
      url = `/products/filters?category=${category}&subcategory=${subcategory}&type=${type}&size=${selectedFilterRedux.size}&color=${selectedFilterRedux.color}&brand=${selectedFilterRedux.brand}&maxPrice=${selectedPriceMax}&minPrice=${selectedPriceMin}`;
    } else if (!type && subcategory && category) {
      url = `/products/filters?category=${category}&subcategory=${subcategory}&size=${selectedFilterRedux.size}&color=${selectedFilterRedux.color}&brand=${selectedFilterRedux.brand}&maxPrice=${selectedPriceMax}&minPrice=${selectedPriceMin}`;
    } else if (!subcategory && !type && category) {
      url = `/products/filters?category=${category}&size=${selectedFilterRedux.size}&color=${selectedFilterRedux.color}&brand=${selectedFilterRedux.brand}&maxPrice=${selectedPriceMax}&minPrice=${selectedPriceMin}`;
    } else {
      url = `/products/filters?size=${selectedFilterRedux.size}&color=${selectedFilterRedux.color}&brand=${selectedFilterRedux.brand}&maxPrice=${selectedPriceMax}&minPrice=${selectedPriceMin}`;
    }

    dispatch(setFilterUrl(url));
    dispatch(setFilterMode(true));
  }, [
    subcategory,
    type,
    category,
    dispatch,
    selectedFilterRedux.size,
    selectedFilterRedux.color,
    selectedFilterRedux.brand,
    selectedPriceMax,
    selectedPriceMin,
  ]);

  const animatedComponents = makeAnimated();

  const cleanFilters = useCallback(() => {
    selectInputRefSize.current.select.clearValue();
    selectInputRefColor.current.select.clearValue();
    selectInputRefBrand.current.select.clearValue();

    setSelectedPriceMin(0);
    setSelectedPriceMax(2000);
    dispatch(setFilterUrl(""));
    dispatch(setFilterMode(false));
  }, [dispatch]);

  const formatter = (value) => `R$${value},00`;

  function selectedPrice(value) {
    setSelectedPriceMin(value[0]);
    setSelectedPriceMax(value[1]);
  }

  const defaultSelected = (type) =>
    selectedFilterRedux[type].length > 0
      ? selectedFilterRedux[type].map((el) => ({ label: el, value: el }))
      : [];

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
          options={
            sizesArr.length > 0
              ? sizesArr.map((el) => ({
                  label: el,
                  value: el,
                }))
              : []
          }
          value={defaultSelected("size")}
          classNamePrefix="select"
          onChange={setSelectedSize}
          ref={selectInputRefSize}
          instanceId="sizesId"
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
          options={
            colorsArr.length > 0
              ? colorsArr.map((el) => ({
                  label: el,
                  value: el,
                }))
              : []
          }
          value={defaultSelected("color")}
          classNamePrefix="select"
          onChange={setSelectedColor}
          ref={selectInputRefColor}
          instanceId="colorsId"
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
          options={
            brandsArr.length > 0
              ? brandsArr.map((el) => ({
                  label: el,
                  value: el,
                }))
              : []
          }
          value={defaultSelected("brand")}
          classNamePrefix="select"
          onChange={setSelectedBrand}
          ref={selectInputRefBrand}
          instanceId="brandsId"
        />
      </div>

      <div className="filter-option-price">
        <h4 style={{ color: "#FF8B00" }}>Filtro de preço</h4>
        <Slider
          style={{ margin: "2rem 0" }}
          range
          defaultValue={[0, 2000]}
          value={[selectedFilterRedux.priceMin, selectedFilterRedux.priceMax]}
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
