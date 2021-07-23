import NavLink from '../../components/NavLink'
import { Carousel } from "react-responsive-carousel";

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
      <NavLink href='/produtos/Surf/Wetsuit'>
        <div className="wrapper-carousel-landing">
            <img
              src="/1.png"
              alt="banner"
            />
        </div>
      </NavLink>
      <NavLink href='/produtos/Masculino/Vestuario/Bermuda'>
        <div className="wrapper-carousel-landing">
          <img
            src="/13.png"
            alt="banner"
          />
        </div>
      </NavLink>
      <NavLink href='/produtos/Masculino/Vestuario/Camiseta'>
        <div className="wrapper-carousel-landing">
          <img
            src="/6.png"
            alt="banner"
          />
        </div>
      </NavLink>
    </Carousel>
  );
};

export default ImageSlider;
