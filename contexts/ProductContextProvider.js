import { createContext, useState } from "react";

export const ProductContext = createContext();

const ProductContextProvider = (props) => {
  const [product, setProduct] = useState(props.product);
  const [imageThumbs, setImageThumbs] = useState([]);
  const [featuredImage, setFeaturedImage] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [availableColorVariations, setAvailableColorVariations] = useState([]);
  const [triggerColor, setColorTrigger] = useState(false);
  const [activeVariation, setActiveVariation] = useState("");

  const [hasSizeVariation, setHasSizeVariation] = useState(false);
  const [supplyAndSize, setSupplyAndSize] = useState({});

  function setImages(imageJson) {
    let imageObj = JSON.parse(imageJson);
    const imagesLink = imageObj.map((el) => el.link);

    setImageThumbs(imagesLink);

    setFeaturedImage(imagesLink[0]);
  }

  return (
    <ProductContext.Provider
      value={{
        imageThumbs,
        setImageThumbs,
        featuredImage,
        setFeaturedImage,
        setImages,
        product,
        selectedSize,
        setSelectedSize,
        selectedColor,
        setSelectedColor,
        availableColorVariations,
        setAvailableColorVariations,
        triggerColor,
        setColorTrigger,
        activeVariation,
        setActiveVariation,
        hasSizeVariation,
        setHasSizeVariation,
        supplyAndSize,
        setSupplyAndSize,
      }}
    >
      {props.children}
    </ProductContext.Provider>
  );
};

export default ProductContextProvider;
