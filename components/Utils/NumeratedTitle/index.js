import React from 'react'

import './numeratedTitle.css'

function NumeratedTitle({title}) {
    return (
        <div className='numerated-title-container'>

            <h3 className='numerated-title-title'>{title}</h3>
        </div>
    )
}

export default NumeratedTitle
