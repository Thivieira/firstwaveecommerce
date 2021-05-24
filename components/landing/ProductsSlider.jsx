import React, { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSliderProduct } from "../../store/selectors/products";
import FadeLoader from "react-spinners/FadeLoader";

import Slider from "react-slick";

import Link from "next/link";
import { sliderProducts } from "../../store/actions/products";
import NumberFormat from "react-number-format";

export default function ProductsSlider({ prod }) {
  // const products = useSelector(getSliderProduct);
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);

  useMemo(() => {
    products.length > 0 ? setLoading(false) : setLoading(true);
    // console.log(prod);
    setProducts(prod);
  }, [products])

  const settings = {
    dots: true,
    adaptiveHeight: true,
    autoplaySpeed: 3000,
    autoplay: true,
    speed: 1000,
    infinite: true,
    speed: 500,
    slidesToShow: 6,
    slidesToScroll: 2,
    initialSlide: 0,

    responsive: [
      {
        breakpoint: 1400,
        settings: {
          slidesToShow: 5,
          slidesToScroll: 3,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 1300,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 2,
          initialSlide: 0,
          dots: true,
        },
      },
      {
        breakpoint: 1100,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 2,
          initialSlide: 0,
          dots: true,
        },
      },
      {
        breakpoint: 850,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          dots: false,
        },
      },
      {
        breakpoint: 650,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          dots: false,
        },
      },
    ],
  };

  return (
    <>
      {loading === true ? (
        <div className="spinner-carousel">
          <FadeLoader
            color={"#0080A8"}
            loading={loading}
            height={35}
            width={7.5}
            radius={5}
            margin={15}
          />
        </div>
      ) : (
        <Slider {...settings}>
          {products
            .map((p) => p.produto)
            .map((p, i) => {
              return (
                <div className="card-wrapper" key={i}>
                  <div className="card">
                    <div className="card-image">
                      <img src={p.variacoes.map(el => el.variacao)[0].imagem[0] ? p.variacoes.map(el => el.variacao)[0].imagem[0].link : "/image1.jpg"} alt="imagem do produto" />
                    </div>
                    <div className="details">
                      <h5>
                        {p.descricao}
                        <span className="price">
                          <NumberFormat
                            value={p.preco}
                            displayType={"text"}
                            decimalScale={2}
                            thousandSeparator={true}
                            prefix={"R$"}
                          />
                        </span>
                      </h5>
                      <Link href={`/produto/${p.codigo}`}>
                        <button type="button">
                          VER DETALHES
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
        </Slider>
      )}
    </>
  );
}
