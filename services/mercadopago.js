const mercadopago = require('mercadopago')

export default function MercadoPago() {
  let token = null
  const env = process.env.NODE_ENV
  if (env == 'development') {
    token = process.env.ACCESS_TOKEN
  } else if (env == 'production') {
    token = process.env.PRODUCTION_ACCESS_TOKEN
  }

  mercadopago.configure({
    access_token: token
  })

  return mercadopago
}
