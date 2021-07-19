import React from "react";

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
      <div className="wrapper-carousel-landing">
        <img
          src="/1.png"
          alt="banner"
        />
      </div>
      <div className="wrapper-carousel-landing">
        <img
          src="/13.png"
          alt="banner"
        />
      </div>
      <div className="wrapper-carousel-landing">
        <img
          src="/6.png"
          alt="banner"
        />
      </div>
    </Carousel>
  );
};

export default ImageSlider;
