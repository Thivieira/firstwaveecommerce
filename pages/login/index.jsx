import { NextSeo } from 'next-seo'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import api from '../../services/api'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

import { TextField, InputAdornment, Button } from '@material-ui/core'
import { Person, LockOpen, GroupAdd } from '@material-ui/icons'

import Separation from '../../components/Utils/Separation'
import Box from '../../components/Utils/Box'
import InputContainer from '../../components/Utils/InputContainer'
import ButtonsContainer from '../../components/Utils/ButtonsContainer'
import { useDispatch } from 'react-redux'
import { saveAccount } from '../../store/actions/user'
import useToken from '../../contexts/TokenStorage'
import Link from 'next/link'

function Login() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()

  const [token, setToken] = useToken()

  useEffect(() => {
    if (token) {
      router.push('/dashboard')
    }
  }, [token, router])

  const MySwal = withReactContent(Swal)

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await api.post('/auth/login', {
        email: email,
        password: password
      })
      const token = res.data.access_token
      setToken(token)
      console.log(token)
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      try {
        const { data } = await api.get('/auth/me')
        dispatch(
          saveAccount({
            name: data.name,
            email: data.email,
            phone: data.mobile,
            cpf: data.cpf
          })
        )
        setLoading(false)
        router.replace('/')
      } catch (e) {}
    } catch (e) {
      setLoading(false)
      MySwal.fire('Usuário ou senha incorretos!')
    }
  }

  return (
    <div className="wrapper-login">
      <NextSeo
        title="Entre na sua conta pessoal - Lifestyle Floripa by Billabong"
        description={'Identificação do Usuário - Sua surf shop na Praia Mole.'}
      />
      <h2>ACESSE SUA CONTA</h2>
      <Box>
        <InputContainer onSubmit={handleSubmit}>
          <TextField
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Person />
                </InputAdornment>
              )
            }}
            id="email"
            label="E-mail"
            variant="filled"
            size="small"
            type="text"
            margin="normal"
            fullWidth
          />
          <TextField
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <LockOpen />
                </InputAdornment>
              )
            }}
            id="password"
            label="Senha"
            variant="filled"
            size="small"
            type="password"
            margin="normal"
            fullWidth
          />
          <ButtonsContainer>
            <Button
              type="submit"
              className="login-button"
              variant="contained"
              color="primary"
              fullWidth
              disabled={loading}
            >
              Entrar
            </Button>
          </ButtonsContainer>
          <div className="forget-password">
            <p>
              Esqueceu sua senha? <Link href="/forgot-password">Clique aqui</Link>
            </p>
          </div>
        </InputContainer>
        <Separation />
        <div className="sign-up">
          <Button
            className="login-button"
            href="/registrar"
            variant="contained"
            color="primary"
            style={{ width: '260px' }}
          >
            <GroupAdd style={{ marginRight: '5px' }} />
            Cadastre-se
          </Button>
        </div>
      </Box>
    </div>
  )
}

export default Login
