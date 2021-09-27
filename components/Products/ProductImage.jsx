import { useState, useEffect } from "react";
import Slider from "react-slick";
import noImage from "../../public/noimage.png";

export default function ProductImage(props) {
  const imageThumbs = props.imageThumbs;
  const [featuredImage, setFeaturedImage] = useState(props.featuredImage);

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

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.target.getBoundingClientRect();
    const x = ((e.pageX - left) / width) * 100;
    const y = ((e.pageY - top) / height) * 100;
    setZoomImage({
      backgroundImage: `url(${featuredImage})`,
      backgroundPosition: `${x}% ${y}%`,
    });
  };

  return (
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
  );
}
