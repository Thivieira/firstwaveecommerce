import React, { useState, useEffect, Fragment, useRef } from "react";
import { useDispatch } from "react-redux";
import { addToCart, changeIsOpen } from "../../store/actions/products";
import { ReactComponent as Cart } from "../../public/shopping-cart-solid.svg";

// import ProductSlider from "../ProductsSlider";

import image1 from "../../public/image1.jpg";
import image2 from "../../public/image2.jpg";
import image3 from "../../public/imaage3.jpg";
import image4 from "../../public/image4.jpg";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import FavoriteBtn from "../FavoriteBtn";

const MySwal = withReactContent(Swal);

const ProductDetails = ({ product }) => {
  const dispatch = useDispatch();

  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [availableVariations, setAvailableVariations] = useState([]);
  const [codigoVariacao, setCodigoVariacao] = useState("");
  const [estoqueAtual, setEstoqueAtual] = useState("");
  const [imageThumbs, setImageThumbs] = useState([
    image1,
    image2,
    image3,
    image4,
  ]);
  const [featuredImage, setFeaturedImage] = useState(image1);

  //CONDIÇÃO PARA EXIBIR SELECT DE TAMANHO
  const codigoProduto = product.variacoes
    .map((el) => el.variacao)
    .map((el) => el.codigo)[0]
    .includes("-");

  const variacoes = product.variacoes.map((el) => el.variacao);

  const tamanhos = variacoes.map(
    (el) => el.nome.split(";").slice(1, 2)[0].split(":").slice(1, 2)[0]
  );

  const sizesNoRepeat = [...new Set(tamanhos)];
  const size = sizesNoRepeat[0];

  useEffect(() => {
    onSelectedSizeChange(size);
  }, [product]);

  const onSelectedSizeChange = (value) => {
    setSelectedSize(value);

    const variacaoDisponivel = variacoes.filter(
      (el) =>
        el.nome.split(";").slice(1, 2)[0].split(":").slice(1, 2)[0] == value
    );

    setAvailableVariations(variacaoDisponivel);

    let color = variacaoDisponivel[0].nome
      .split(";")
      .slice(0, 1)[0]
      .split(":")
      .slice(1, 2)[0];

    setSelectedColor(color);
  };

  useEffect(() => {
    onSelectedColorChange(selectedColor);
  }, [selectedColor]);

  const onSelectedColorChange = (value) => {
    let cor = availableVariations.filter((el) => {
      return (
        el.nome.split(";").slice(0, 1)[0].split(":").slice(1, 2)[0] == value
      );
    })[0];

    if (!cor) {
      return;
    }

    const imagesLink = cor.imagem.map((el) => el.link);

    setImageThumbs(imagesLink);

    setFeaturedImage(imagesLink[0]);

    setCodigoVariacao(cor.codigo + "-" + selectedColor);
    setEstoqueAtual(cor.estoqueAtual);
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
          })
        );
        dispatch(changeIsOpen(true));
      }
    }
  };

  return (
    <Fragment>
      <div className="details-wrapper">
        <div className="gallery-img">
          <img className="big-img" src={featuredImage} alt="img" />
          <div className="thumb">
            {imageThumbs.map((image) => (
              <div key={image} onClick={() => setFeaturedImage(image)}>
                <img
                  className={featuredImage === image ? "active" : ""}
                  src={image}
                  alt="img"
                />
              </div>
            ))}
          </div>
        </div>
        <div className="details-content">
          <div className="title-and-heart">
            <h1 className="title-product">
              {product.descricao} <FavoriteBtn product={product}></FavoriteBtn>
            </h1>
          </div>

          <span className="price-product">
            R$ {parseFloat(product.preco).toFixed(2).replace(".", ",")}
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
              <ul>                                                              
                {sizesNoRepeat.map((value) => (
                  <li
                    onClick={() => onSelectedSizeChange(value)}
                    key={value}
                    className={value == selectedSize ? "active" : null}
                    title={value}
                  >
                    {value}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {availableVariations ? (
            <div className="colors-product">
              <span>
                <b>Cor:</b>
                <div className="color-text-selected">
                  {selectedColor.charAt(0).toUpperCase() +
                    selectedColor.toLowerCase().slice(1)}
                </div>
              </span>
              <div className="colors-thumb">
                {availableVariations.map((variacao) => {
                  const color = variacao.nome
                    .split(";")
                    .slice(0, 1)[0]
                    .split(":")
                    .slice(1, 2)[0];
                  return (
                    <img
                      onClick={() => setSelectedColor(color)}
                      className={color === selectedColor ? "active" : ""}
                      key={variacao.nome}
                      src={
                        variacao.imagem.length > 0
                          ? variacao.imagem[0].link
                          : "#"
                      }
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
            <p>Marca: {product.marca}</p>
            <p>{product.descricaoCurta}</p>
          </div>
        </div>
      </div>

      <div className="recomendados">
        {/* <h2>VEJA TAMBÉM</h2> */}
        {/* <ProductSlider /> */}
      </div>
    </Fragment>
  );
};

export default ProductDetails;
