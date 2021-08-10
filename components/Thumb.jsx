import Image from "next/image";
import React from "react";

const Thumb = ({ src, alt }) => (
  <div className="shelf-item__thumb">
    <Image src={src} alt={alt} width={40} height={40} />
  </div>
);

export default Thumb;
