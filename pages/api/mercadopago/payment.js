export default async function handler(req, res) {
  const mercadopago = MercadoPago()

  mercadopago.payment
    .save(req.body)
    .then(function (response) {
      const { status, status_detail, id } = response.body
      res.status(response.status).json({ status, status_detail, id })
    })
    .catch(function (error) {
      console.error(error)
    })

  res.status(200).json(payment_methods)
}
