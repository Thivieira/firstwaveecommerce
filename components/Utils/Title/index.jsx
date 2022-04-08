import React from 'react'

function Title(props) {
  return <h2 className="title">{props.children ? props.children : props.title}</h2>
}

export default Title
