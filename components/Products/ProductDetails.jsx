import { useState, useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";
import Slider from "react-slick";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

import { addToCart, changeIsOpen } from "../../store/actions/products";
import { ReactComponent as Cart } from "../../public/shopping-cart-solid.svg";
import FavoriteBtn from "../FavoriteBtn";
import noImage from "../../public/noimage.png";
import { upFirst } from "../../helpers";

const ProductDetails = ({ product }) => {
  const dispatch = useDispatch();
  const MySwal = withReactContent(Swal);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [availableColorVariations, setAvailableColorVariations] = useState([]);
  const [triggerColor, setColorTrigger] = useState(false);
  const [activeVariation, setActiveVariation] = useState("");
  const [featuredImage, setFeaturedImage] = useState("");
  const [hasSizeVariation, setHasZizeVariation] = useState(false);
  const [supplyAndSize, setSupplyAndSize] = useState({});
  const [imageThumbs, setImageThumbs] = useState([]);

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
  };

  const [zoomImage, setZoomImage] = useState({
    backgroundImage: `url(${featuredImage})`,
    backgroundPosition: "0% 0%",
  });

  const price = `R$${parseFloat(product.price).toFixed(2).replace(".", ",")}`;
  const priceSale = `R$${parseFloat(product.variations[0].price)
    .toFixed(2)
    .replace(".", ",")}`;

  const installmentPrice = (price) => `R$${parseFloat(price / 6.0).toFixed(2).replace(".", ",")}`

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.target.getBoundingClientRect();
    const x = ((e.pageX - left) / width) * 100;
    const y = ((e.pageY - top) / height) * 100;
    setZoomImage({
      backgroundImage: `url(${featuredImage})`,
      backgroundPosition: `${x}% ${y}%`,
    });
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

      const availableSizeVariations = product.variations.filter(
        (el) => el.size == value
      );

      setAvailableColorVariations(availableSizeVariations);

      if (availableSizeVariations.length == 0) {
        return false;
      }

      setSelectedColor(availableSizeVariations[0].color);
      setColorTrigger(true);
    },
    [product.variations]
  );

  const onSelectedColorChange = useCallback(
    (value) => {
      const product_variations = availableColorVariations.filter(
        (el) => el.color == value
      );

      if (product_variations.length == 0) {
        return false;
      }

      const product_variation = product_variations[0];

      setImages(product_variation.image);

      setActiveVariation(product_variation);

      setColorTrigger(false);
    },
    [availableColorVariations, selectedColor]
  );

  const addToCartFn = () => {
    if (hasSizeVariation) {
      if (selectedSize === "" || selectedColor === "") {
        MySwal.fire({
          title: (
            <p>Selecione um tamanho e uma cor para adicionar ao carrinho</p>
          ),
          confirmButtonText: "OK",
        });
      } else {
        dispatch(addToCart({ ...activeVariation, product }));
        dispatch(changeIsOpen(true));
      }
    } else {
      if (selectedColor === "") {
        MySwal.fire({
          title: <p>Selecione uma cor para adicionar ao carrinho.</p>,
          confirmButtonText: "OK",
        });
      } else {
        dispatch(addToCart({ ...activeVariation, product }));
        dispatch(changeIsOpen(true));
      }
    }
  };

  useEffect(() => {
    if (triggerColor) {
      onSelectedColorChange(selectedColor);
    }
  }, [onSelectedColorChange, selectedColor, triggerColor]);

  useEffect(() => {
    /**
     *  INIT PRODUCT
     */
    const product_variations = product.variations;

    setHasZizeVariation(
      product_variations.filter((el) => (el.size ? true : false))
    );

    const supplys = product_variations.map((el) => el.supply);

    const sizes = product_variations.map((el) => el.size);

    const sizesNoRepeat = [...new Set(sizes)];

    var supplyAndSize = {};
    for (var i = 0; i < sizesNoRepeat.length; i++) {
      supplyAndSize[sizesNoRepeat[i]] = supplys[i];
    }

    setSupplyAndSize(supplyAndSize);

    const firstSizeWithSupply = Object.keys(supplyAndSize)
      .map((size) => supplyAndSize[size] > 0 && size)
      .filter((el) => el != false)[0];

    setImages(product_variations[0].image);

    if (firstSizeWithSupply) {
      onSelectedSizeChange(firstSizeWithSupply);
    } else {
      setAvailableColorVariations(product_variations);
    }
  }, [onSelectedSizeChange, product]);

  return (
    <div className="details-wrapper">
      <div className="gallery-img">
        <div className="thumb">
          <Slider {...settings}>
            {imageThumbs.map((image) => (
              <div key={image} onClick={() => setFeaturedImage(image)}>
                <img
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
          <img className="big-img" src={noImage.src} alt="img" />
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
            <img
              src={featuredImage ? featuredImage : noImage}
              alt="imagem do produto"
              className="big-img"
              width={400}
              height={400}
            />
          </figure>
        )}
      </div>

      <div className="details-content">
        <div className="title-and-heart">
          <h1 className="title-product">
            {product.description} <FavoriteBtn product={product}></FavoriteBtn>
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

        <p className="installment">
          {priceSale !== price ? (
            <>
              <strong>6x</strong> de <strong>{installmentPrice(product.variations[0].price)}</strong> sem juros
              no cartão ou <strong>12%</strong> de desconto no boleto ou pix.
            </>
          ) :
          (
            <>
              <strong>6x</strong> de <strong>{installmentPrice(product.price)}</strong> sem juros
              no cartão ou <strong>12%</strong> de desconto no boleto ou pix.
            </>
          )
          }
        </p>

        <div className="btn-buy">
          <button
            onClick={() => addToCartFn()}
            disabled={activeVariation.supply <= 0 ? true : false}
            title={
              activeVariation.supply <= 0
                ? "Este produto não tem esta quantidade disponível."
                : "Adicionar ao carrinho."
            }
          >
            ADICIONAR AO {<Cart height="20" width="20" color="#fff" />}
          </button>
        </div>

        {hasSizeVariation ? (
          <div className="sizes-btn">
            <strong>Tamanhos:</strong>
            <ul>
              {Object.keys(supplyAndSize).map((size, index) => {
                const supply = supplyAndSize[size];
                return supply > 0 ? (
                  <li
                    onClick={() => onSelectedSizeChange(size)}
                    key={size}
                    title={`Tamanho ${size}`}
                    className={size == selectedSize ? "active" : null}
                  >
                    {size}
                  </li>
                ) : (
                  <li
                    key={size}
                    title="Tamanho não disponível."
                    className="disabled"
                  >
                    {size}
                  </li>
                );
              })}
            </ul>
          </div>
        ) : null}

        {availableColorVariations ? (
          <div className="colors-product">
            <span>
              <b>Cor:</b>
              <div className="color-text-selected">
                {upFirst(selectedColor)}
              </div>
            </span>
            <div className="colors-thumb">
              {availableColorVariations.map((variation) => {
                const color = variation.color;
                let image = JSON.parse(variation.image);
                image = image.length > 0 ? image[0].link : noImage.src;

                return variation.supply > 0 ? (
                  <img
                    onClick={() => {
                      setSelectedColor(color);
                      setImages(variation.image);
                    }}
                    className={color === selectedColor ? "active" : ""}
                    key={variation.external_id}
                    src={image}
                    width={48}
                    height={48}
                    alt="Cor da imagem do produto."
                    title={`Cor ${color.toLowerCase()}.`}
                    style={{ height: "3rem" }}
                  />
                ) : (
                  <img
                    className={"disabled"}
                    key={variation.external_id}
                    src={image}
                    width={48}
                    height={48}
                    alt="Cor da imagem do produto."
                    title="Cor não disponível."
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
  );
};

export default ProductDetails;
