import MercadoPago from '../../../services/mercadopago'

export default function handler(req, res) {
  if (req.method === 'GET') {
    const mercadopago = MercadoPago()

    const id = req.body.id

    mercadopago.payment
      .get(id)
      .then(function (data) {
        if (data.payment_method_id == 'bank_transfer' && data.payment_type_id == 'pix') {
          res.status(200).json({
            pix: {
              id: data.id,
              status: data.status,
              detail: data.status_detail,
              qrCodeBase64: data.point_of_interaction['transaction_data'].qr_code_base64,
              qrCode: data.point_of_interaction['transaction_data'].qr_code
            },
            data
          })
        } else {
          res.status(200).json({
            pix: false
          })
        }
      })
      .catch(function (error) {
        res.status(error.status).json({ pix: false, error })
      })
  }
  if (req.method === 'POST') {
    mercadopago.configurations.setAccessToken('YOUR_ACCESS_TOKEN')

    mercadopago.payment
      .save(req.body)
      .then(function (response) {
        const { status, status_detail, id } = response.body
        res.status(response.status).json({ status, status_detail, id })
      })
      .catch(function (error) {
        console.error(error)
      })
  }
}
