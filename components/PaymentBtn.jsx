import React, { useEffect, useState, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { getCartState } from '../store/selectors/products'
import { getAccount, getAddress } from '../store/selectors/user'
import { setPreferenceId } from '../store/actions/products'
import { Spin } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'
import { useRouter } from 'next/router'

const loadMercadoPago = (callback) => {
  const existingScript = document.getElementById('mercadoPagoSdkScript')
  if (!existingScript) {
    const script = document.createElement('script')
    script.src = 'https://sdk.mercadopago.com/js/v2'
    script.id = 'mercadoPagoSdkScript'
    document.body.appendChild(script)
    script.onload = () => {
      if (callback) callback()
    }
  }
  if (existingScript && callback) callback()
}

async function create_preference(cart, address, account) {
  const { data } = await axios.post('/api/preferences', {
    cart,
    address,
    account
  })

  return {
    preferenceId: data.preferenceId,
    init_point: data.init_point
  }
}

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />

export default function PaymentBtn(props) {
  const router = useRouter()
  const [loaded, setLoaded] = useState(false)
  const [clicked, setClickState] = useState(false)
  const cart = useSelector(getCartState)
  const address = useSelector(getAddress)
  const account = useSelector(getAccount)
  const dispatch = useDispatch()

  const mpRun = useCallback((preferenceId, init_point_arg) => {
    const mp = new MercadoPago(process.env.NEXT_PUBLIC_PUBLIC_KEY, {
      locale: 'pt-BR'
    })

    const checkout = mp.checkout({
      preference: {
        id: preferenceId
      },
      render: {
        container: '.cho-container',
        label: 'Pagar'
      },
      theme: {
        elementsColor: '#1890ff',
        headerColor: '#1890ff'
      },
      autoOpen: true,
      init_point: 'redirect'
    })

    window.mp = mp
    window.checkout = checkout
    window.location = `${init_point_arg}`
  }, [])

  useEffect(() => {
    if (!account) {
      router.push('/')
    }
  }, [account])

  useEffect(() => {
    if (clicked) {
      loadMercadoPago(async () => {
        setLoaded(true)
        const preferenceObj = await create_preference(cart, address, account)
        dispatch(setPreferenceId(preferenceObj.preferenceId))
        mpRun(preferenceObj.preferenceId, preferenceObj.init_point)
      })
    }
  }, [account, address, cart, clicked, dispatch, mpRun])

  return !clicked ? (
    <div
      className={'pure-material-button-contained  cho-container'}
      onClick={() => {
        !loaded && setClickState(true)
      }}
    >
      <span>Pagar</span>
    </div>
  ) : (
    <>
      <span>
        Carregando... <Spin indicator={antIcon} />
      </span>
    </>
  )
}
