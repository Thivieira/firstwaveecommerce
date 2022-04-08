import { NextSeo } from 'next-seo'
import { useState } from 'react'
import { TextField, InputAdornment, Button } from '@material-ui/core'
import { EmailRounded } from '@material-ui/icons'

import Container from '../components/Utils/Container'
import Title from '../components/Utils/Title'
import Box from '../components/Utils/Box'
import InputContainer from '../components/Utils/InputContainer'
import ButtonsContainer from '../components/Utils/ButtonsContainer'
import api from '../services/api'

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

function ForgotPassword() {
  const MySwal = withReactContent(Swal)
  const [email, setEmail] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    try {
      const { data } = await api.post(`/auth/forgot-password`, { email })
      MySwal.fire({
        title: <p>{data.status}</p>
      }).then((res) => {
        if (res.isConfirmed) {
          // router.push("/login");
        }
      })
    } catch (e) {}
  }

  return (
    <div className="flex flex-col mb-16 justify-center items-center h-[400px] mx-auto">
      <NextSeo
        title="Recuperar senha ou email - Lifestyle Floripa by Billabong"
        description={'Recuperar senha ou email - Sua surf shop na Praia Mole.'}
      />
      <Title>Recuperar senha ou email</Title>
      <Box>
        <InputContainer>
          <TextField
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <EmailRounded />
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
          <ButtonsContainer>
            <Button type="submit" onClick={submit} variant="contained" color="primary" fullWidth>
              Recuperar senha
            </Button>
          </ButtonsContainer>
        </InputContainer>
      </Box>
    </div>
  )
}

export default ForgotPassword
