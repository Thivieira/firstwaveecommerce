import React, { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSliderProduct } from "../../store/selectors/products";
import FadeLoader from "react-spinners/FadeLoader";

import Slider from "react-slick";

import Link from "next/link";
import { sliderProducts } from "../../store/actions/products";
import NumberFormat from "react-number-format";
import { useRouter } from "next/router";

export default function ProductsSlider({ prod }) {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);

  const router = useRouter();

  useMemo(() => {
    products.length > 0 ? setLoading(false) : setLoading(true);
    setProducts(prod);
  }, [products]);

  const settings = {
    dots: true,
    adaptiveHeight: true,
    autoplaySpeed: 3000,
    autoplay: true,
    speed: 1000,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 2,
    initialSlide: 0,

    responsive: [
      {
        breakpoint: 1400,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 2,
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
          {products.map((p, i) => {
            let test = p.variations.length > 0 ? p.variations[0] : [];
            let imageTest = JSON.parse(test.image);
            // console.log("imageTest", imageTest);
            const image =
              imageTest.length > 0 ? imageTest[0].link : "/image1.jpg";

            return (
              <div
                className="card-wrapper"
                key={i}
                onClick={() => router.push(`/produto/${p.codigo}`)}
              >
                <div className="card">
                  <div className="card-image">
                    <img src={image} alt="imagem do produto" />
                  </div>
                  <div className="details">
                    <h5>
                      {p.description}
                      <span className="price">
                        <NumberFormat
                          value={p.price}
                          displayType={"text"}
                          decimalScale={2}
                          thousandSeparator={true}
                          prefix={"R$"}
                        />
                      </span>
                    </h5>
                    <Link href={`/produto/${p.code}`}>
                      <button type="button">VER DETALHES</button>
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
