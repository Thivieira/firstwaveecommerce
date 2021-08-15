import React from 'react'

function ButtonsContainer(props) {
    return (
        <div className='buttons-container'>
            {props.children}
        </div>
    )
}

export default ButtonsContainer
