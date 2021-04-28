import React from 'react'

import './inputContainer.css'

function InputContainer(props) {
    return (
        <form onSubmit={props.onSubmit} className='input-container'>
            {props.children}
        </form>
    )
}

export default InputContainer
