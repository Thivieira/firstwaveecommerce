import React from 'react'

import './box.css'

function Box(props) {
    return (
        <div className='box'>
            {props.children}
        </div>
    )
}

export default Box
