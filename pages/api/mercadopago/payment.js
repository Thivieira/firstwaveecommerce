import MercadoPago from '../../../services/mercadopago'

export default async function handler(req, res) {
  const mercadopago = MercadoPago()
  if (req.method === 'POST') {
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
  if (req.method === 'GET') {
    const payment_id = req.query.payment_id
    if (!payment_id) {
      res.status(400).json('Parameter not present')
      return false
    }
    mercadopago.payment
      .get(payment_id)
      .then(function (response) {
        const {
          status,
          status_detail,
          id,
          payment_method_id,
          payment_type_id,
          point_of_interaction,
          transaction_details
        } = response.body
        if (payment_type_id == 'bank_transfer' && payment_method_id == 'pix') {
          res.status(200).json({
            pix: {
              id,
              status: status,
              detail: status_detail,
              qrCodeBase64: point_of_interaction['transaction_data'].qr_code_base64,
              qrCode: point_of_interaction['transaction_data'].qr_code
            },
            status: status,
            status_detail: status_detail,
            ticket_url: transaction_details['external_resource_url']
          })
          return true
        }

        res.status(200).json({
          pix: false,
          status: status,
          status_detail: status_detail,
          ticket_url: transaction_details['external_resource_url']
        })
        // res.status(response.status).json({ status, status_detail, transaction_details, id })
      })
      .catch(function (error) {
        res.status(error.status).json({ pix: false, action: 'error', error })
      })
  }
}
