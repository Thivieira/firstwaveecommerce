var mercadopago = require('mercadopago');

export default function handler(req, res) {
    if (req.method === "GET") {
        let token = null;
        const env = process.env.NODE_ENV
        if (env == "development") {
            token = process.env.ACCESS_TOKEN;
        }
        else if (env == "production") {
            token = process.env.PRODUCTION_ACCESS_TOKEN;
        }

        mercadopago.configure({
            access_token: token
        });

        const id = req.body.id;
        
        mercadopago.payment.get(id).then(function (data) {
            if(data.payment_method_id == 'bank_transfer' && data.payment_type_id == 'pix'){
                res.status(200).json({
                    pix: {
                        id: data.id,
                        status: data.status,
                        detail: data.status_detail,
                        qrCodeBase64: data.point_of_interaction['transaction_data'].qr_code_base64,
                        qrCode: data.point_of_interaction['transaction_data'].qr_code
                    },
                   data
                });
            } else {
                res.status(200).json({
                    pix: false,
                });
            }

        }).catch(function (error) {
            res.status(error.status).json({pix:false, error})
        });
    }
}