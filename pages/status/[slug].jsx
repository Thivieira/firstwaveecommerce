import api from '../../services/api'
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

export async function getStaticPaths(ctx) {
  const paths = [
    { params: { slug: 'sucesso' } },
    { params: { slug: 'processando' } },
    { params: { slug: 'erro' } }
  ]
  return {
    paths,
    fallback: 'blocking'
  }
}

export async function getStaticProps(ctx) {
  return { props: { slug: ctx.params.slug } }
}

export default function Index(props) {
  const router = useRouter()
  const { payment_id } = router.query
  const dispatch = useDispatch()
  const cart = useSelector(getCartState)
  const user = useSelector(getAccount)
  const address = useSelector(getAddress)
  const [pixData, setPixData] = useState(null)
  const [paymentData, setPaymentData] = useState(null)

  useEffect(() => {
    switch (props.slug) {
      case 'sucesso':
        dispatch(clearCart())
        break
      case 'processando':
        dispatch(clearCart())
        if (router.isReady && payment_id) {
          api
            .get(`/api/payments?payment_id=${payment_id}`)
            .then((data) => {
              setPaymentData(data)
              if (data.pix) {
                setPixData(data.pix)
              }
            })
            .catch((err) => {})
        }
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
              subTitle="Pode levar até 3 dias úteis após o pagamento do boleto. Você será notificado quando o pedido for liberado."
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
                      Ou você também pode usar o seguinte código como copiar e colar
                    </Paragraph>
                    <div
                      style={{
                        overFlow: 'scroll',
                        width: '300px'
                      }}
                    >
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
