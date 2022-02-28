import { useState, useEffect } from 'react'

import { Stepper, Step, StepLabel, Container } from '@material-ui/core'
import { useRouter } from 'next/router'
import UserData from '../../components/register/UserData'
import AddressData from '../../components/register/AddressData'
import { passwordValidator, cpfValidator, phoneValidator } from '../../models/Form'
import FormValidations from '../../contexts/FormValidations'
import api from '../../services/api'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { NextSeo } from 'next-seo'
import { saveAccount } from '../../store/actions/user'
import { useDispatch } from 'react-redux'
import useLocalStorageState from 'use-local-storage-state'

function Form() {
  const [currentStep, setCurrentStep] = useState(0)
  const [collectedData, setCollectedData] = useState({
    email: '',
    password: '',
    passwordConfirmation: '',
    name: '',
    cpf: '',
    phone: '',
    cep: '',
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: ''
  })
  const router = useRouter()
  const dispatch = useDispatch()
  const MySwal = withReactContent(Swal)

  const next = () => setCurrentStep(currentStep + 1)

  const goBack = () => setCurrentStep(currentStep - 1)

  const [token, setToken] = useLocalStorageState('token', { ssr: true })

  useEffect(() => {
    if (token) {
      router.push('/dashboard')
    }
  }, [router, token])

  async function signUpUser({ name, password, passwordConfirmation, email, cpf, phone }) {
    setCollectedData((prevState) => ({
      ...prevState,
      email: email,
      password: password,
      passwordConfirmation: passwordConfirmation,
      name: name,
      cpf: cpf,
      phone: phone
    }))
    next()
  }

  function handleLogin() {
    const { email, password } = collectedData
    return new Promise((resolve, reject) => {
      api
        .post('/auth/login', {
          email: email,
          password: password
        })
        .then((res) => {
          const accessToken = res.data.access_token
          api.defaults.headers.common['Authorization'] = `Bearer ${accessToken.replace(
            /['"]+/g,
            ''
          )}`
          setToken(accessToken)
          resolve()
        })
        .catch(() => {
          reject()
        })
    })
  }

  function signUpAddress(submitData) {
    setCollectedData((prevState) => {
      return {
        ...prevState,
        cep: submitData.cep,
        street: submitData.street,
        number: submitData.number,
        complement: submitData.complement,
        neighborhood: submitData.neighborhood,
        city: submitData.city,
        state: submitData.state
      }
    })
    api
      .post('/auth/register', {
        cpf: collectedData.cpf.replace(/[^\d]/g, ''),
        email: collectedData.email,
        name: collectedData.name,
        password: collectedData.password,
        password_confirmation: collectedData.passwordConfirmation,
        mobile: collectedData.phone.replace(/[^\d]/g, '')
      })
      .then(() => {
        handleLogin()
          .then(() => {
            api
              .post('/auth/address', {
                province: submitData.neighborhood,
                postalCode: submitData.cep.replace(/[^\d]/g, ''),
                city: submitData.city,
                complement: submitData.complement,
                uf: submitData.state,
                addressNumber: submitData.number,
                address: submitData.street
              })
              .then(() => {
                api
                  .get('/auth/me')
                  .then((res) => {
                    dispatch(
                      saveAccount({
                        cpf: res.data.cpf,
                        email: res.data.email,
                        name: res.data.name,
                        phone: res.data.mobile
                      })
                    )
                    MySwal.fire('Conta cadastrada com sucesso!')
                    router.push('/')
                  })
                  .catch((e) => {
                    MySwal.fire('Conta cadastrada com sucesso!')
                    router.push('/')
                  })
              })
              .catch(() => {
                MySwal.fire('Falha ao cadastrar endereço!')
              })
          })
          .catch(() => MySwal.fire('Usuário ou senha incorretos!'))
      })
      .catch(() => MySwal.fire('Falha ao cadastrar usuário'))
  }

  const forms = [
    <UserData data={collectedData} onSubmit={signUpUser} key="user-data" signup={true} />,
    <AddressData
      data={collectedData}
      onSubmit={signUpAddress}
      goBack={goBack}
      signup={true}
      key="register-data"
    />
  ]

  return (
    <>
      <NextSeo
        title="Cadastre sua conta - Lifestyle Floripa by Billabong"
        description={'Identificação do Usuário - Sua surf shop na Praia Mole.'}
      />
      <Container component="article" maxWidth="sm" style={{ minHeight: '100vh' }}>
        <Stepper activeStep={currentStep}>
          <Step>
            <StepLabel>Login</StepLabel>
          </Step>
          <Step>
            <StepLabel>Endereço</StepLabel>
          </Step>
        </Stepper>
        <FormValidations.Provider
          value={{
            password: passwordValidator,
            cpf: cpfValidator,
            phone: phoneValidator
          }}
        >
          {forms[currentStep]}
        </FormValidations.Provider>
      </Container>
    </>
  )
}

export default Form
