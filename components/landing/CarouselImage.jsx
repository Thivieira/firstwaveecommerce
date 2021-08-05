import NavLink from "../../components/NavLink";
import { Carousel } from "react-responsive-carousel";
import Image from "next/image";
import banner1 from "../../public/banner1.png";
import banner2 from "../../public/banner2.png";
import banner3 from "../../public/banner3.png";

const ImageSlider = () => {
  const getConfigurableProps = () => ({
    showArrows: true,
    showStatus: false,
    showIndicators: true,
    infiniteLoop: true,
    showThumbs: false,
    useKeyboardArrows: true,
    autoPlay: true,
    swipeable: true,
    dynamicHeight: true,
    emulateTouch: true,
    selectedItem: 0,
    interval: 3000,
    transitionTime: 900,
    swipeScrollTolerance: 5,
  });

  return (
    <Carousel {...getConfigurableProps()}>
      <NavLink href="/produtos/Surf/Wetsuit">
        <div className="wrapper-carousel-landing">
          <Image
            src={banner1}
            alt="banner1"
            className="image-next"
            width={2048}
            height={1449}
          />
        </div>
      </NavLink>
      <NavLink href="/produtos/Masculino/Vestuario/Bermuda">
        <div className="wrapper-carousel-landing">
          <Image
            src={banner2}
            alt="banner2"
            className="image-next"
            width={2048}
            height={1449}
          />
        </div>
      </NavLink>
      <NavLink href="/produtos/Masculino/Vestuario/Camiseta">
        <div className="wrapper-carousel-landing">
          <Image
            src={banner3}
            alt="banner3"
            className="image-next"
            width={2048}
            height={1449}
          />
        </div>
      </NavLink>
    </Carousel>
  );
};

export default ImageSlider;
