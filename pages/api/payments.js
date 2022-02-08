import axios from 'axios'
import MercadoPago from '../../services/mercadopago'
import { getFeaturedImage } from '../../helpers'

function getToken(req) {
  if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
    return req.headers.authorization.split(' ')[1]
  }
  return null
}

export default function handler(req, res) {
  if (req.method === 'POST') {
    const mercadopago = MercadoPago()

    const jwt = getToken(req)

    const { token, issuer_id, payment_method_id, transaction_amount, installments, payer } =
      req.body
    const { email, identification } = payer

    const cart = req.body.cart
    const address = req.body.address
    const account = req.body.account

    const items = cart.map((item) => {
      return {
        id: item.external_id,
        title: item.product.description,
        description: `${item.product.description} - ${item.brand}`,
        picture_url: getFeaturedImage(item.image),
        quantity: parseInt(item.quantity),
        unit_price: parseInt(item.price),
        category_id: 'fashion'
      }
    })

    let firstName = account.name.split(' ').slice(0, -1).join(' ')
    let lastName = account.name.split(' ').slice(-1).join(' ')
    let stripedPhone = account.phone.replace(/\D/g, '')
    let area_code = stripedPhone.substring(0, 2)
    let number = stripedPhone.substring(2)

    mercadopago.payment
      .save({
        additional_info: {
          items,
          payer: {
            first_name: firstName,
            last_name: lastName,
            phone: {
              area_code: area_code,
              number
            },
            address: {
              zip_code: address.zipcode ? address.zipcode : '',
              street_name: address.street ? address.street : '',
              street_number: parseInt(address.number)
            },
            registration_date: account.created_at
          },
          shipments: {
            receiver_address: {
              zip_code: address.zipcode ? address.zipcode : '',
              street_name: address.street ? address.street : '',
              city_name: address.city ? address.city : '',
              state_name: address.state ? address.state : '',
              street_number: parseInt(address.number),
              apartment: address.complement ? address.complement : ''
            }
          }
        },
        binary_mode: false,
        callback_url: `${process.env.NEXT_PUBLIC_SITE_URL}/status/processando`,
        capture: true,
        installments: Number(installments),
        issuer_id,
        notification_url: process.env.NOTIFICATION_URL,
        payer: {
          type: 'customer',
          email,
          identification: {
            type: identification.type,
            number: identification.number
          },
          first_name: firstName,
          last_name: lastName
        },
        payment_method_id,
        statement_descriptor: 'LIFESTYLEFLN',
        token,
        transaction_amount: Number(transaction_amount)
      })
      .then(function (response) {
        const {
          status,
          status_detail,
          id,
          payment_method_id,
          payment_type_id,
          point_of_interaction
        } = response.body

        axios
          .post(
            `${process.env.API_URL}/orders`,
            { payment_id: id },
            {
              headers: {
                'Content-type': 'application/json',
                Authorization: `Bearer ${jwt}`
              }
            }
          )
          .then((data) => {})

        if (payment_method_id == 'bank_transfer' && payment_type_id == 'pix') {
          res.status(200).json({
            pix: {
              id,
              status: status,
              detail: status_detail,
              qrCodeBase64: point_of_interaction['transaction_data'].qr_code_base64,
              qrCode: point_of_interaction['transaction_data'].qr_code
            },
            action: 'processando',
            data: response.body
          })
          return true
        }

        if (payment_method_id == 'bank_transfer' && payment_type_id == 'pix') {
        }

        res.status(200).json({
          pix: false,
          action: 'sucesso',
          data: response.body
        })
      })
      .catch(function (error) {
        console.error(error)
        res.status(error.status).json({ pix: false, action: 'error', error })
      })
  }
}
