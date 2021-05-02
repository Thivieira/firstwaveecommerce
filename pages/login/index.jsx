import React, { useState } from "react";
import { useRouter } from "next/router";
import api from "../../services/api";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

import { TextField, InputAdornment, Button } from "@material-ui/core";
import { Person, LockOpen, GroupAdd } from "@material-ui/icons";

import Separation from "../../Utils/Separation";
import Box from "../../Utils/Box";
import InputContainer from "../../Utils/InputContainer";
import ButtonsContainer from "../../Utils/ButtonsContainer";

function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const MySwal = withReactContent(Swal);

  async function handleSubmit(e) {
    e.preventDefault();
    await api
      .post("/auth", {
        email: email,
        senha: password,
      })
      .then((res) => {
        sessionStorage.setItem("key", res.data.token);
        sessionStorage.setItem("authorized", true);
        // MySwal.fire("Usuário logado com sucesso!");
        router.replace("/");
        // window.location.reload();
      })
      .catch(() => MySwal.fire("Usuário ou senha incorretos!"));
  }

  return (
    <div className="wrapper-login">
      <h1>Acesse sua conta</h1>
      <Box>
        <InputContainer onSubmit={handleSubmit}>
          <TextField
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment>
                  <Person />
                </InputAdornment>
              ),
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
                <InputAdornment>
                  <LockOpen />
                </InputAdornment>
              ),
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
            >
              Entrar
            </Button>
          </ButtonsContainer>
          <div className="forget-password">
            <p>
              Esqueceu sua senha?<a href="/forgetPassword">Clique aqui</a>
            </p>
          </div>
        </InputContainer>
        <Separation />
        <div className="sign-up">
          <Button href="/form" variant="contained" color="primary">
            <GroupAdd />
            Cadastre-se
          </Button>
        </div>
      </Box>
    </div>
  );
}

export default Login;
