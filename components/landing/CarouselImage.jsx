import NavLink from "../../components/NavLink";
import { Carousel } from "react-responsive-carousel";
import Image from "next/image";
import banner1 from "../../public/banner-topo1.jpg";
import banner2 from "../../public/banner-topo2.jpg";
import banner3 from "../../public/banner-topo3.jpg";

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
    width: 1200
  });

  return (
    <Carousel {...getConfigurableProps()}>
      <NavLink href="/produtos/Surf/Wetsuit">
        <div className="wrapper-carousel-landing">
          <Image
            src={banner1}
            alt="banner1"
            className="image-next"
            width={1200}
            height={420}
            priority
          />
        </div>
      </NavLink>
      <NavLink href="/produtos/Masculino/Vestuario/Bermuda">
        <div className="wrapper-carousel-landing">
          <Image
            src={banner2}
            alt="banner2"
            className="image-next"
            width={1200}
            height={420}
            priority
          />
        </div>
      </NavLink>
      <NavLink href="/produtos/Masculino/Vestuario/Camiseta">
        <div className="wrapper-carousel-landing">
          <Image
            src={banner3}
            alt="banner3"
            className="image-next"
            width={1200}
            height={420}
            priority
          />
        </div>
      </NavLink>
    </Carousel>
  );
};

export default ImageSlider;
