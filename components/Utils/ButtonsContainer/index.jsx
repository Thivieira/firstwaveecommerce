import React from 'react'

import './buttonsContainer.css'

function ButtonsContainer(props) {
    return (
        <div className='buttons-container'>
            {props.children}
        </div>
    )
}

export default ButtonsContainer
