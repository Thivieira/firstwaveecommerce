import axios from 'axios'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Status from '../../components/Status'
import { Button, Result, Typography } from 'antd'
import { clearCart } from '../../store/actions/products'
import { getCartState } from '../../store/selectors/products'
import { getAccount, getAddress } from '../../store/selectors/user'
import { useDispatch, useSelector } from 'react-redux'
import { NextSeo } from 'next-seo'
const { Paragraph, Text } = Typography

export async function getServerSideProps(ctx) {
  const payment_id = ctx.query.payment_id
  if (payment_id) {
    // console.log('before trying')
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_SITE_URL}/api/mercadopago/payment?payment_id=${payment_id}`
      )
      return { props: { paymentData: res.data, pix: res.data.pix, slug: ctx.query.slug } }
    } catch (e) {
      console.error(e)
      return { props: { paymentData: null, pix: null, slug: ctx.params.slug } }
    }
  }
  return { props: { paymentData: null, pix: null, slug: ctx.params.slug } }
}

export default function Index(props) {
  const router = useRouter()
  const dispatch = useDispatch()
  const [pixData, setPixData] = useState(props.pix)
  const [paymentData, setPaymentData] = useState(props.paymentData)

  // console.log(props)

  useEffect(() => {
    switch (props.slug) {
      case 'sucesso':
        dispatch(clearCart())
        break
      case 'processando':
        dispatch(clearCart())

        break
    }
  }, [dispatch, props.slug, router.isReady])

  const renderStatus = () => {
    switch (props.slug) {
      case 'sucesso':
        return (
          <>
            <NextSeo
              title="Sua compra foi efetuada com sucesso! - Lifestyle Floripa by Billabong"
              description="Status do pedido de compra - Sua surf shop na Praia Mole."
            />
            <Status
              status="success"
              title="Sua compra foi efetuada com sucesso!"
              subTitle={`Pedido #${router.query.payment_id} enviado, confira seu email para acompanhar a entrega.`}
              extra={[
                <Button
                  type="primary"
                  key="console"
                  onClick={() => {
                    router.push('/')
                  }}
                >
                  Ver mais produtos
                </Button>,
                <Button
                  key="buy"
                  onClick={() => {
                    router.push('/dashboard')
                  }}
                >
                  Conferir pedido
                </Button>
              ]}
            />
          </>
        )
      case 'processando':
        return (
          <>
            <NextSeo
              title="Seu pedido está sendo processado! - Lifestyle Floripa by Billabong"
              description="Status do pedido de compra - Sua surf shop na Praia Mole."
            />
            <Result
              title="Seu pedido está sendo processado!"
              subTitle={
                pixData
                  ? 'Pagamentos em PIX são quase instantâneos para processar. Você será notificado quando o pedido for liberado.'
                  : 'Pode levar até 3 dias úteis para processar o pagamento do boleto. Você será notificado quando o pedido for liberado.'
              }
            >
              {pixData && (
                <div
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '100%',
                    display: 'flex'
                  }}
                >
                  <div
                    style={{
                      width: 'auto',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                      display: 'flex',
                      padding: '15px 25px'
                    }}
                  >
                    <Paragraph
                      style={{
                        fontSize: 16
                      }}
                    >
                      Digitalize o seguinte código QR para concluir o pagamento:
                    </Paragraph>
                    <img
                      alt={pixData.qrCode}
                      title="Digitalize o seguinte código QR para concluir o pagamento."
                      src={`data:image/jpeg;base64,${pixData.qrCodeBase64}`}
                      id="qr-code-image"
                      width="150px"
                    />
                    {/* <img alt={pixData.qrCode} title="Digitalize o seguinte código QR para concluir o pagamento." src={`${pixData.qrCodeBase64}`} id="qr-code-image" width="150px" /> */}
                    <Paragraph
                      style={{
                        fontSize: 16,
                        marginTop: '1em'
                      }}
                    >
                      Ou você pode usar o seguinte código como copiar e colar
                    </Paragraph>
                    <div
                      className="w-full p-4 mb-4 bg-gray-200 md:w-1/2"
                      style={{
                        overFlow: 'scroll'
                      }}
                    >
                      <Paragraph
                        style={{
                          marginBottom: '0px',
                          overFlow: 'scroll'
                        }}
                      >
                        <Text
                          strong
                          style={{
                            fontSize: 14
                          }}
                          title="Ou você também pode usar o seguinte código como copiar e colar"
                        >
                          {pixData.qrCode}
                        </Text>
                      </Paragraph>
                    </div>

                    <Paragraph
                      style={{
                        fontSize: 16
                      }}
                    >
                      Ou você também pode usar a nossa chave pix de email
                    </Paragraph>
                    <Paragraph
                      className="flex justify-center w-full p-4 mb-4 bg-gray-200 md:w-1/2"
                      style={{
                        overFlow: 'scroll'
                      }}
                    >
                      <Text
                        strong
                        style={{
                          fontSize: 14
                        }}
                        title="Ou você também pode usar a nossa chave pix de email"
                      >
                        comercial@lifestylefloripa.com.br
                      </Text>
                    </Paragraph>
                  </div>
                </div>
              )}
              {paymentData && !pixData && (
                <div
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '100%',
                    display: 'flex'
                  }}
                >
                  <div
                    style={{
                      width: 'auto',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                      display: 'flex'
                    }}
                  >
                    <Paragraph
                      style={{
                        fontSize: 16
                      }}
                    >
                      Acessar o boleto pelo link:
                    </Paragraph>
                    <Paragraph
                      style={{
                        overFlow: 'scroll'
                      }}
                    >
                      <Text
                        strong
                        style={{
                          fontSize: 14
                        }}
                        title="acessar o boleto acessando este link"
                      >
                        <a target="_blank" href={paymentData.ticket_url}>
                          Ver boleto
                        </a>
                      </Text>
                    </Paragraph>
                  </div>
                </div>
              )}
            </Result>
          </>
        )
      case 'erro':
        return (
          <>
            <NextSeo
              title="Aconteceu um erro com o seu pedido - Lifestyle Floripa by Billabong"
              description="Status do pedido de compra - Sua surf shop na Praia Mole."
            />
            <Status
              status="error"
              title="Aconteceu um erro com o seu pedido."
              extra={[
                <Button
                  key="buy"
                  type="primary"
                  onClick={() => {
                    router.push('/pagamento')
                  }}
                >
                  Tentar novamente
                </Button>,
                <Button
                  key="console"
                  onClick={() => {
                    router.push('/')
                  }}
                >
                  Ver outros produtos
                </Button>
              ]}
            />
          </>
        )
      default:
        return null
    }
  }

  return (
    <div style={props.slug == 'processando' ? { height: 'auto' } : { height: '58vh' }}>
      {renderStatus()}
    </div>
  )
}
