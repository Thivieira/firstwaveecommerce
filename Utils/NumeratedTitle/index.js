import React from 'react'

import './numeratedTitle.css'

function NumeratedTitle({title}) {
    return (
        <div className='numerated-title-container'>

            <h2 className='numerated-title-title'>{title}</h2>
        </div>
    )
}

export default NumeratedTitle
