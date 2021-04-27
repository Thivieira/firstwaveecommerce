function passwordValidator(password) {
    if(password.length < 8) {
        return {valid: false, text: 'Senha deve conter no mínimo 8 caracteres'}
    } else {
        return {valid: true, text: ''}
    }
}

const cpf = ''

function cpfValidator(cpfForm) {
    if(!cpf.isValid(cpfForm)) {
        return {valid: false, text: 'CPF inválido!'}
    } else {
        return {valid: true, text: ''}
    }
}

function phoneValidator(phone) {
    if(10 > phone > 14) {
        return {valid: false, text: 'telefone inválido!'}
    } else {
        return {valid: true, text: ''}
    }
}

export {passwordValidator, cpfValidator, phoneValidator}