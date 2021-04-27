import React from 'react'

const FormValidations = React.createContext(
    {password:noValidation, confirmPassword:noValidation, cpf:noValidation, phone:noValidation}
)

function noValidation() {
    return {valid:true, text:''}
}

export default FormValidations