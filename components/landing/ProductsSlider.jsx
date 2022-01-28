import { useMemo, useState } from "react";
// import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

import Slider from "react-slick";
import FadeLoader from "react-spinners/FadeLoader";

import noImage from "../../public/noimage.png";

export default function ProductsSlider({ prod }) {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);

  const router = useRouter();

  useMemo(() => {
    products.length > 0 ? setLoading(false) : setLoading(true);
    setProducts(prod);
  }, [prod, products.length]);

  const settings = {
    dots: false,
    adaptiveHeight: true,
    speed: 1000,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 2,
    initialSlide: 0,

    responsive: [
      {
        breakpoint: 1650,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 2,
          infinite: true,
          dots: false,
        },
      },
      {
        breakpoint: 1300,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 2,
          initialSlide: 0,
          dots: false,
        },
      },
      {
        breakpoint: 1100,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 2,
          initialSlide: 0,
          dots: false,
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

  const installmentPrice = (price) =>
    `R$${parseFloat(price / 6.0)
      .toFixed(2)
      .replace(".", ",")}`;

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
            const images = p.variations.map((el) => el.image);

            const imagesOk = images.filter((el) => el !== "[]")[0];

            const imageOK = JSON.parse(imagesOk)[0].link;

            const image = imageOK ? imageOK : noImage.src;

            return (
              <div
                className="card-wrapper"
                key={i}
                onClick={() => router.push(`/produto/${p.code}`)}
              >
                <div className="card">
                  <div className="card-image">
                    <img
                      src={image}
                      alt="imagem do produto"
                      className="image-slider"
                    />
                  </div>
                  <div className="details">
                    <h3 className="title-card">{p.description}</h3>
                    <div className="price">
                      {p.price !== p.variations[0].price ? (
                        <div className="priceSale">
                          <p className="firstPrice">
                            R${parseFloat(p.price).toFixed(2).replace(".", ",")}{" "}
                          </p>
                          <p className="promoPrice">
                            R$
                            {parseFloat(p.variations[0].price)
                              .toFixed(2)
                              .replace(".", ",")}
                          </p>
                        </div>
                      ) : (
                        <p>
                          {" "}
                          R${parseFloat(p.price)
                            .toFixed(2)
                            .replace(".", ",")}{" "}
                        </p>
                      )}
                    </div>
                    <p className="installment-owl">
                      <strong>6x</strong> de{" "}
                      <strong>
                        {installmentPrice(
                          p.price !== p.variations[0].price
                            ? p.variations[0].price
                            : p.price
                        )}
                      </strong>{" "}
                      sem juros no cartão.
                    </p>
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
