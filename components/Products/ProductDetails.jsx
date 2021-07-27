import React, { useState, useEffect, Fragment, useRef } from "react";
import { useDispatch } from "react-redux";
import { addToCart, changeIsOpen } from "../../store/actions/products";
import { ReactComponent as Cart } from "../../public/shopping-cart-solid.svg";
import FavoriteBtn from "../FavoriteBtn";
import Slider from "react-slick";

import noImage from "../../public/noimage.png";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const ProductDetails = ({ product }) => {
  const dispatch = useDispatch();
  const [selectedSize, setSelectedSize] = useState("");
  const [availableColorVariations, setAvailableColorVariations] = useState([]);
  const [selectedColor, setSelectedColor] = useState("");
  const [triggerColor, setColorTrigger] = useState(false);
  const [codigoVariacao, setCodigoVariacao] = useState("");
  const [estoqueAtual, setEstoqueAtual] = useState("");
  const [imageThumbs, setImageThumbs] = useState([noImage]);
  const [featuredImage, setFeaturedImage] = useState([noImage]);
  const [zoomImage, setZoomImage] = useState({
    backgroundImage: `url(${featuredImage})`,
    backgroundPosition: "0% 0%",
  });
  const [thePrice, setPrice] = useState(product.price);

  const variations = product.variations;

  if (!product) {
    return null;
  }
  if (variations.length == 0) {
    return null;
  }

  function setImages(imageJson) {
    let imageObj = JSON.parse(imageJson);
    const imagesLink = imageObj.map((el) => el.link);

    setImageThumbs(imagesLink);

    setFeaturedImage(imagesLink[0]);
  }

  //CONDIÇÃO PARA EXIBIR SELECT DE TAMANHO
  const codigoProduto = variations.map((el) => el.code)[0].includes("-");

  const estoque = variations.map((el) => el.supply);

  console.log("VARIATIONS", variations);
  const tamanhos = variations.map(
    (el) => el.description.split(";").slice(1, 2)[0].split(":").slice(1, 2)[0]
  );

  const sizesNoRepeat = [...new Set(tamanhos)];

  var supplyAndSize = {};
  for (var i = 0; i < sizesNoRepeat.length; i++) {
    supplyAndSize[sizesNoRepeat[i]] = estoque[i];
  }

  useEffect(() => {
    const size = sizesNoRepeat[0];

    onSelectedSizeChange(size);
  }, [variations]);

  useEffect(() => {
    if (triggerColor) {
      onSelectedColorChange(selectedColor);
    }
  }, [triggerColor]);

  const onSelectedSizeChange = (value) => {
    setSelectedSize(value);

    const variacaoDisponivel = variations.filter(
      (el) =>
        el.description.split(";").slice(1, 2)[0].split(":").slice(1, 2)[0] ==
        value
    );

    setAvailableColorVariations(variacaoDisponivel);

    let color = variacaoDisponivel[0].description
      .split(";")
      .slice(0, 1)[0]
      .split(":")
      .slice(1, 2)[0];

    setSelectedColor(color);
    setColorTrigger(true);
  };

  const onSelectedColorChange = (value) => {
    let cor = availableColorVariations.filter((el) => {
      return (
        el.description.split(";").slice(0, 1)[0].split(":").slice(1, 2)[0] ==
        value
      );
    })[0];

    if (!cor) {
      return;
    }

    setImages(cor.image);

    setCodigoVariacao(
      `${cor.code}-${selectedSize}-${selectedColor.replace(/\s/g, "_")}`
    );
    setEstoqueAtual(cor.supply);
    setPrice(cor.price ? cor.price : product.price);
    setColorTrigger(false);
  };

  const addToCartFn = () => {
    if (codigoProduto) {
      if (selectedSize === "" || selectedColor === "") {
        MySwal.fire({
          title: (
            <p>Selecione um tamanho e uma cor para adicionar ao carrinho</p>
          ),
          confirmButtonText: "OK",
        });
      } else {
        dispatch(
          addToCart({
            ...product,
            size: selectedSize,
            color: selectedColor,
            codigoVariacao: codigoVariacao,
            estoqueAtual: estoqueAtual,
            imagemVariacao: featuredImage,
            thePrice,
          })
        );
        dispatch(changeIsOpen(true));
      }
    } else {
      if (selectedColor === "") {
        MySwal.fire({
          title: <p>Selecione uma cor para adicionar ao carrinho.</p>,
          confirmButtonText: "OK",
        });
      } else {
        dispatch(
          addToCart({
            ...product,
            color: selectedColor,
            codigoVariacao: codigoVariacao,
            estoqueAtual: estoqueAtual,
            imagemVariacao: featuredImage,
            thePrice,
          })
        );
        dispatch(changeIsOpen(true));
      }
    }
  };

  const MySwal = withReactContent(Swal);

  const price = `R$${parseFloat(product.price).toFixed(2).replace(".", ",")}`;
  const priceSale = `R$${parseFloat(variations[0].price)
    .toFixed(2)
    .replace(".", ",")}`;

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.target.getBoundingClientRect();
    const x = ((e.pageX - left) / width) * 100;
    const y = ((e.pageY - top) / height) * 100;
    setZoomImage({
      backgroundImage: `url(${featuredImage})`,
      backgroundPosition: `${x}% ${y}%`,
    });
  };

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    infinite: imageThumbs.length > 3,
    slidesToShow: 4,
    slidesToScroll: 1,
    vertical: true,
    verticalSwiping: true,
    swipeToSlide: true,
    arrows: false,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          vertical: false,
        },
      },
    ],
  };

  return (
    <Fragment>
      <div className="details-wrapper">
        <div className="gallery-img">
          <div className="thumb">
            <Slider {...settings}>
              {imageThumbs.map((image) => (
                <div key={image} onClick={() => setFeaturedImage(image)}>
                  <img
                    className={featuredImage === image ? "active" : ""}
                    src={image}
                    alt="img"
                  />
                </div>
              ))}
            </Slider>
          </div>

          {!featuredImage ? (
            <img className="big-img" src="/noimage.png" alt="img" />
          ) : (
            <figure style={zoomImage} onMouseMove={handleMouseMove}>
              <img className="big-img" src={featuredImage} alt="img" />
            </figure>
          )}
        </div>

        <div className="details-content">
          <div className="title-and-heart">
            <h1 className="title-product">
              {product.description}{" "}
              <FavoriteBtn product={product}></FavoriteBtn>
            </h1>
          </div>

          <h5>{product.code}</h5>

          <span className="price-product">
            {priceSale !== price ? (
              <>
                <div className="priceSaleProduct">
                  <span>
                    De: <p>{price}</p>
                  </span>
                  <p>
                    <span>Por:</span>
                    {priceSale}
                  </p>
                </div>
              </>
            ) : (
              price
            )}
          </span>

          <div className="btn-buy">
            <button
              onClick={() => addToCartFn()}
              disabled={estoqueAtual === 0 ? true : false}
              title={
                estoqueAtual === 0
                  ? "Este produto não tem esta quantidade disponível."
                  : null
              }
            >
              ADICIONAR AO
              {<Cart height="20" width="20" color="#fff" />}
            </button>
          </div>

          {codigoProduto ? (
            <div className="sizes-btn">
              <strong>Tamanhos:</strong>
              <ul>
                {Object.keys(supplyAndSize).map((tamanho, index) =>
                  supplyAndSize[tamanho] > 0 ? (
                    <li
                      onClick={() => onSelectedSizeChange(tamanho)}
                      key={tamanho}
                      className={tamanho == selectedSize ? "active" : null}
                    >
                      {tamanho}
                    </li>
                  ) : (
                    <li
                      key={tamanho}
                      title="Tamanho não disponível."
                      className="disabled"
                    >
                      {tamanho}
                    </li>
                  )
                )}
              </ul>
            </div>
          ) : null}

          {availableColorVariations ? (
            <div className="colors-product">
              <span>
                <b>Cor:</b>
                <div className="color-text-selected">
                  {selectedColor.charAt(0).toUpperCase() +
                    selectedColor.toLowerCase().slice(1)}
                </div>
              </span>
              <div className="colors-thumb">
                {availableColorVariations.map((variation) => {
                  const color = variation.description
                    .split(";")
                    .slice(0, 1)[0]
                    .split(":")
                    .slice(1, 2)[0];
                  let image = JSON.parse(variation.image);
                  image = image.length > 0 ? image[0].link : "/noimage.png";
                  return (
                    <img
                      onClick={() => setSelectedColor(color)}
                      className={color === selectedColor ? "active" : ""}
                      key={variation.id}
                      src={image}
                      alt="img"
                      style={{ height: "3rem" }}
                    />
                  );
                })}
              </div>
            </div>
          ) : null}

          <div className="info-product">
            <h3>DESCRIÇÃO</h3>
            <p>Marca: {product.brand}</p>
            <div
              className="description"
              dangerouslySetInnerHTML={{ __html: product.short_description }}
            ></div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default ProductDetails;
