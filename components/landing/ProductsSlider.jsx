import { useMemo, useState } from "react";
import Image from 'next/image'
import Link from "next/link";
import { useRouter } from "next/router";

import Slider from "react-slick";
import FadeLoader from "react-spinners/FadeLoader";

export default function ProductsSlider({ prod }) {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);

  const router = useRouter();

  useMemo(() => {
    products.length > 0 ? setLoading(false) : setLoading(true);
    setProducts(prod);
  }, [products]);

  const settings = {
    dots: false,
    adaptiveHeight: true,
    // autoplaySpeed: 3000,
    // autoplay: true,
    speed: 1000,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
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
            const image = imageTest.length > 0 ? imageTest[0].link : "/noimage.png";

            return (
              <div
                className="card-wrapper"
                key={i}
                onClick={() => router.push(`/produto/${p.code}`)}
              >
                <div className="card">
                  <div className="card-image">
                    <Image 
                      src={image} 
                      alt="imagem do produto"  
                      // width={200}
                      // height={270}
                      className='image-slider'
                      layout='fill'
                    />
                  </div>
                  <div className="details">
                    <h5>
                      {p.description}
                      <span className="price">
                        {p.price !== p.variations[0].price ? (
                          <div className="priceSale">
                            <p>R${parseFloat(p.price).toFixed(2).replace(".", ",")}</p>
                            <p>R${parseFloat(p.variations[0].price).toFixed(2).replace(".", ",")}</p>
                          </div>
                        ) : (
                          <p>R${parseFloat(p.price).toFixed(2).replace(".", ",")}</p>  
                        )}
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
