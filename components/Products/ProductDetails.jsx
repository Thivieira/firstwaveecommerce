import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { useDispatch } from "react-redux";
import Slider from "react-slick";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

import { addToCart, changeIsOpen } from "../../store/actions/products";
import { ReactComponent as Cart } from "../../public/shopping-cart-solid.svg";
import FavoriteBtn from "../FavoriteBtn";
import noImage from "../../public/noimage.png";
import { defaultBlur } from "../../helpers";

const ProductDetails = ({ product }) => {
  const dispatch = useDispatch();
  const [selectedSize, setSelectedSize] = useState("");
  const [availableColorVariations, setAvailableColorVariations] = useState([]);
  const [selectedColor, setSelectedColor] = useState("");
  const [triggerColor, setColorTrigger] = useState(false);
  const [codigoVariacao, setCodigoVariacao] = useState("");
  const [estoqueAtual, setEstoqueAtual] = useState("");
  const [imageThumbs, setImageThumbs] = useState([]);
  const [featuredImage, setFeaturedImage] = useState("");
  const [zoomImage, setZoomImage] = useState({
    backgroundImage: `url(${featuredImage})`,
    backgroundPosition: "0% 0%",
  });
  const [thePrice, setPrice] = useState(product.price);
  const [codigoProduto, setCodigoProduto] = useState("");
  const [supplyAndSize, setSupplyAndSize] = useState({});

  const MySwal = withReactContent(Swal);

  const price = `R$${parseFloat(product.price).toFixed(2).replace(".", ",")}`;
  const priceSale = `R$${parseFloat(product.variations[0].price)
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

  function setImages(imageJson) {
    let imageObj = JSON.parse(imageJson);
    const imagesLink = imageObj.map((el) => el.link);

    setImageThumbs(imagesLink);

    setFeaturedImage(imagesLink[0]);
  }

  const onSelectedSizeChange = useCallback(
    (value) => {
      setSelectedSize(value);

      const variacaoDisponivel = product.variations.filter((el) => {
        let sizes = el.description.split(";").slice(1, 2);
        if (sizes.length > 0) {
          return sizes[0].split(":").slice(1, 2)[0] == value;
        }
      });

      setAvailableColorVariations(variacaoDisponivel);

      let color = variacaoDisponivel[0].description
        .split(";")
        .slice(0, 1)[0]
        .split(":")
        .slice(1, 2)[0];

      setSelectedColor(color);
      setColorTrigger(true);
    },
    [product.variations]
  );

  const onSelectedColorChange = useCallback(
    (value) => {
      let cor = availableColorVariations.filter(
        (el) =>
          el.description.split(";").slice(0, 1)[0].split(":").slice(1, 2)[0] ==
          value
      )[0];

      if (!cor) {
        return;
      }

      setImages(cor.image);

      setCodigoVariacao(cor.external_id);
      setEstoqueAtual(cor.supply);
      setPrice(cor.price ? cor.price : product.price);
      setColorTrigger(false);
    },
    [availableColorVariations, product.price]
  );

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

  useEffect(() => {
    const variations = product.variations;

    //CONDIÇÃO PARA EXIBIR SELECT DE TAMANHO
    let codigoProduto = variations.map((el) => el.code)[0].includes("-");

    setCodigoProduto(codigoProduto);

    const estoque = variations.map((el) => el.supply);

    const tamanhos = variations.map((el) => {
      let sizes = el.description.split(";").slice(1, 2);
      if (sizes.length > 0) {
        return sizes[0].split(":").slice(1, 2)[0];
      }
    });

    const sizesNoRepeat = [...new Set(tamanhos)];

    var supplyAndSize = {};
    for (var i = 0; i < sizesNoRepeat.length; i++) {
      supplyAndSize[sizesNoRepeat[i]] = estoque[i];
    }

    setSupplyAndSize(supplyAndSize);

    const firstSizeWithSupply = Object.keys(supplyAndSize)
      .map((tamanho) => supplyAndSize[tamanho] > 0 && tamanho)
      .filter((el) => el != false)[0];

    onSelectedSizeChange(firstSizeWithSupply);
  }, [onSelectedSizeChange, product]);

  useEffect(() => {
    if (triggerColor) {
      onSelectedColorChange(selectedColor);
    }
  }, [onSelectedColorChange, selectedColor, triggerColor]);

  return (
    <>
      <div className="details-wrapper">
        <div className="gallery-img">
          <div className="thumb">
            <Slider {...settings}>
              {imageThumbs.map((image) => (
                <div key={image} onClick={() => setFeaturedImage(image)}>
                  <Image
                    className={featuredImage === image ? "active" : ""}
                    src={image}
                    alt="imagem em miniatura do produto"
                    width={70}
                    height={70}
                  />
                </div>
              ))}
            </Slider>
          </div>

          {!featuredImage ? (
            <Image className="big-img" src={noImage} alt="img" />
          ) : (
            <figure
              style={zoomImage}
              onMouseMove={handleMouseMove}
              onMouseLeave={(e) => {
                setZoomImage({
                  backgroundImage: `url('')`,
                  backgroundPosition: `0% 0%`,
                });
              }}
            >
              <Image
                src={featuredImage ? featuredImage : noImage}
                alt="imagem do produto"
                className="big-img"
                width={400}
                height={400}
                blurDataURL={defaultBlur()}
              />
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
                {availableColorVariations
                  .filter(
                    (el, index, arr) =>
                      index === arr.findIndex((t) => t.code === el.code)
                  )
                  .map((variation) => {
                    const color = variation.description
                      .split(";")
                      .slice(0, 1)[0]
                      .split(":")
                      .slice(1, 2)[0];
                    let image = JSON.parse(variation.image);
                    image = image.length > 0 ? image[0].link : noImage.src;
                    return (
                      <Image
                        onClick={() => {
                          setSelectedColor(color);
                          setImages(variation.image);
                        }}
                        className={color === selectedColor ? "active" : ""}
                        key={variation.id}
                        src={image}
                        width={48}
                        height={48}
                        alt="cor da imagem do produto"
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
    </>
  );
};

export default ProductDetails;
