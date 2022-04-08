import MercadoPago from '../../../services/mercadopago'

export default async function handler(req, res) {
  const mercadopago = MercadoPago()

  var response = await mercadopago.payment_methods.listAll()
  var payment_methods = response.body

  res.status(200).json(payment_methods)
}
