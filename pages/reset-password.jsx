import { NextSeo } from 'next-seo'
import { TextField, Button, Typography } from '@material-ui/core'

import Container from '../components/Utils/Container'
import Title from '../components/Utils/Title'
import Box from '../components/Utils/Box'
import InputContainer from '../components/Utils/InputContainer'
import ButtonsContainer from '../components/Utils/ButtonsContainer'
import api from '../services/api'

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { useRouter } from 'next/router'
import { useFormik } from 'formik'
import * as yup from 'yup'
import { useEffect } from 'react'

function ResetPassword() {
  const MySwal = withReactContent(Swal)
  const router = useRouter()
  const validationSchema = yup.object({
    email: yup
      .string('Digite seu email')
      .email('Entre com um email válido')
      .required('Email é obrigatório'),
    password: yup
      .string('Digite sua senha')
      .min(8, 'A senha deve ter no mínimo 8 caracteres')
      .required('Senha requerida'),
    password_confirmation: yup
      .string()
      .oneOf([yup.ref('password'), null], 'As senhas devem corresponder')
  })

  useEffect(() => {
    if (!router.query.token) {
      router.push('/forgot-password')
    }
  }, [router])

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      password_confirmation: ''
    },
    validationSchema: validationSchema,
    onSubmit: async ({ email, password, password_confirmation }) => {
      try {
        const res = await api.post(`/auth/reset-password`, {
          token: router.query.token,
          email,
          password,
          password_confirmation
        })

        if (res.response.status != 200) {
          MySwal.fire({
            title: <p>Erro</p>,
            body: (
              <ul>
                {Object.keys(res.response.data.errors).map((error) => (
                  <li key={error}>{error}</li>
                ))}
              </ul>
            )
          })
          return
        }

        MySwal.fire({
          title: <p>{res.response.data.status}</p>
        }).then((res) => {
          if (res.isConfirmed) {
            router.push('/login')
          }
        })
      } catch (e) {
        MySwal.fire({
          title: <p>Erro</p>,
          body: (
            <ul>
              {Object.keys(e.response.data.errors).map((error) => (
                <li key={error}>{error}</li>
              ))}
            </ul>
          )
        })
      }
    }
  })

  return (
    <Container>
      <NextSeo
        title="Resetar senha - Lifestyle Floripa by Billabong"
        description={'Resetar senha - Sua surf shop na Praia Mole.'}
      />
      <Box>
        <InputContainer onSubmit={formik.handleSubmit}>
          <Typography variant="subtitle1" component="h2" gutterBottom>
            Resetar senha
          </Typography>
          <TextField
            value={formik.values.email}
            onChange={formik.handleChange}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
            id="email"
            label="Email"
            type="email"
            variant="filled"
            margin="normal"
            fullWidth
            required
          />
          <div className="input-container-form">
            <div className="margin-form">
              <TextField
                value={formik.values.password}
                onChange={formik.handleChange}
                error={formik.touched.password && Boolean(formik.errors.password)}
                helperText={formik.touched.password && formik.errors.password}
                id="password"
                name="password"
                label="Senha"
                type="password"
                autoComplete="new-password"
                variant="filled"
                margin="normal"
                required={true}
                className="inline-input"
              />
            </div>
            <TextField
              value={formik.values.password_confirmation}
              onChange={formik.handleChange}
              error={
                formik.touched.password_confirmation && Boolean(formik.errors.password_confirmation)
              }
              helperText={
                formik.touched.password_confirmation && formik.errors.password_confirmation
              }
              id="password_confirmation"
              name="password_confirmation"
              autoComplete="new-password"
              label="Confirma Senha"
              type="password"
              variant="filled"
              margin="normal"
              required={true}
              className="inline-input"
            />
          </div>
          <ButtonsContainer>
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Resetar senha
            </Button>
          </ButtonsContainer>
        </InputContainer>
      </Box>
    </Container>
  )
}

export default ResetPassword
