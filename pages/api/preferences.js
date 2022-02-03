import { getFeaturedImage } from '../../helpers'

export default function handler(req, res) {
  if (req.method === 'POST') {
    // SDK do Mercado Pago
    const mercadopago = require('mercadopago')
    // Adicione as credenciais
    mercadopago.configure({
      access_token: process.env.ACCESS_TOKEN
    })

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
        currency_id: 'BRL',
        category_id: 'fashion'
      }
    })

    let firstName = account.name.split(' ').slice(0, -1).join(' ')
    let lastName = account.name.split(' ').slice(-1).join(' ')
    let stripedPhone = account.phone.replace(/\D/g, '')
    let area_code = stripedPhone.substring(0, 2)
    let number = stripedPhone.substring(2)
    let preference = {
      items,
      back_urls: {
        success: `${process.env.NEXT_PUBLIC_SITE_URL}/status/sucesso`,
        failure: `${process.env.NEXT_PUBLIC_SITE_URL}/status/erro`,
        pending: `${process.env.NEXT_PUBLIC_SITE_URL}/status/processando`
      },
      payer: {
        name: firstName,
        surname: lastName,
        email: account.email,
        date_created: new Date().toISOString(),
        phone: {
          area_code: area_code,
          number: Number(number)
        },

        identification: {
          type: 'CPF',
          number: account.cpf
        },
        address: {
          zip_code: address.zipcode ? address.zipcode : '',
          street_name: address.street ? address.street : '',
          city_name: address.city ? address.city : '',
          state_name: address.state ? address.state : '',
          street_number: parseInt(address.number),
          apartment: address.complement ? address.complement : ''
        }
      },
      auto_return: 'approved',
      shipments: {
        receiver_address: {
          zip_code: address.zipcode ? address.zipcode : '',
          street_name: address.street ? address.street : '',
          city_name: address.city ? address.city : '',
          state_name: address.state ? address.state : '',
          street_number: parseInt(address.number),
          apartment: address.complement ? address.complement : ''
        }
      },
      statement_descriptor: 'LIFESTYLEFLN',
      notification_url: process.env.NOTIFICATION_URL
    }

    // console.log("PREFERENCE", preference);
    // console.log("access_token", process.env.ACCESS_TOKEN);

    mercadopago.preferences
      .create(preference)
      .then(function (response) {
        res.status(200).json({
          preferenceId: response.body.id,
          init_point: response.body.init_point
        })
      })
      .catch(function (error) {
        console.log(error)
        res.status(500).json({ error, message: 'Ocorreu um erro no servidor.' })
      })
  }
}
