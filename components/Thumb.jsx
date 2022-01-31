import React from 'react'

import noImage from '../public/noimage.png'

const Thumb = ({ src, alt }) => (
  <div className="shelf-item__thumb">
    <img src={src ? src : noImage} alt={alt} width={40} height={40} />
  </div>
)

export default Thumb
