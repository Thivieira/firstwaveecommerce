import React from 'react'
import Image from 'next/image'

import noImage from '../public/noimage.png'

const Thumb = ({ src, alt }) => (
  <div className="shelf-item__thumb">
    <Image src={src ? src : noImage} alt={alt} width={40} height={40} />
  </div>
)

export default Thumb
