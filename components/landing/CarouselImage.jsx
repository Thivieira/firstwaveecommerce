import { Carousel } from 'react-responsive-carousel'
import NavLink from '../NavLink'
// import banner1 from '../../public/banner-topo1.jpg'
// import banner2 from '../../public/banner-topo2.jpg'
// import banner3 from '../../public/banner-topo3.jpg'

function ImageSlider() {
  const getConfigurableProps = () => ({
    showArrows: true,
    showStatus: false,
    showIndicators: false,
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
    swipeScrollTolerance: 5
  })

  return (
    <Carousel {...getConfigurableProps()}>
      <NavLink href="/produtos/Masculino/Vestuario/Camiseta">
        <div className="wrapper-carousel-landing">
          <img
            src="/banner-topo1.jpg"
            alt="banner1"
            className="image-next"
            width={1200}
            height={430}
          />
        </div>
      </NavLink>
      <NavLink href="/produtos/Masculino/Vestuario/Bermuda">
        <div className="wrapper-carousel-landing">
          <img
            src="/banner-topo2.jpg"
            alt="banner2"
            className="image-next"
            width={1200}
            height={430}
          />
        </div>
      </NavLink>
      <NavLink href="/produtos/Surf">
        <div className="wrapper-carousel-landing">
          <img
            src="/banner-topo3.jpg"
            alt="banner3"
            className="image-next"
            width={1200}
            height={430}
          />
        </div>
      </NavLink>
    </Carousel>
  )
}

export default ImageSlider
