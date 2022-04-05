import React from 'react'

export default function Ellipsis(props) {
  return (
    <div className="relative block w-20 h-5 loader-dots" {...props}>
      <div className="absolute top-0 w-3 h-3 mt-1 bg-white rounded-full"></div>
      <div className="absolute top-0 w-3 h-3 mt-1 bg-white rounded-full"></div>
      <div className="absolute top-0 w-3 h-3 mt-1 bg-white rounded-full"></div>
      <div className="absolute top-0 w-3 h-3 mt-1 bg-white rounded-full"></div>
    </div>
  )
}
