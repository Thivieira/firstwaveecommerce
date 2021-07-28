import React, { useEffect, useState } from "react";
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
import { useDispatch } from "react-redux";
import { saveAccount } from "../../store/actions/user";

function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  // const [ user, setUser ] = useState()

  const MySwal = withReactContent(Swal);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/auth/login", {
        email: email,
        password: password,
      });
      const token = res.data.access_token;
      localStorage.setItem("key", token);
      localStorage.setItem("authorized", true);
      api.defaults.headers.common["Authorization"] = "Bearer " + token;
      try {
        const { data } = await api.get("/auth/me");
        dispatch(
          saveAccount({
            name: data.name,
            email: data.email,
            phone: data.mobile,
            cpf: data.cpf,
          })
        );
        setLoading(false);
        router.replace("/");
      } catch (e) {}
    } catch (e) {
      setLoading(false);
      MySwal.fire("Usuário ou senha incorretos!");
    }
  }

  // useEffect(() => {
  //   const unsubscribe = auth.onAuthStateChanged(user => {
  //     if (user) {
  //       const { displayName, email, uid } = user

  //       if (!displayName || !email) {
  //         throw new Error('Missing information from Google account.')
  //       }

  //       setEmail()
  //       setPassword()
  //       // setUser({
  //       //   id: uid,
  //       //   name: displayName,
  //       //   avatar: photoURL
  //       // })
  //     }
  //   })

  //   return () => {
  //     unsubscribe()
  //   }
  // }, [])

  // async function signInWithGoogle() {
  //   const provider = new firebase.auth.GoogleAuthProvider()

  //   const result = await auth.signInWithPopup(provider)

  //   console.log(result.user)

  //   if (result.user) {
  //     const { displayName, email, uid } = result.user

  //     if (!displayName || !email) {
  //       throw new Error('Missing information from Google account.')
  //     }

  //     setEmail(email)
  //     setPassword(uid)
  //     handleSubmit()
  //     // setUser({
  //     //   id: uid,
  //     //   name: displayName,
  //     //   avatar: photoURL
  //     // })
  //   }
  // }

  return (
    <div className="wrapper-login">
      <h2>ACESSE SUA CONTA</h2>
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
              disabled={loading}
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
          {/* <Button onClick={signInWithGoogle} className='create-google' variant="contained" color="primary">
            <img src='/google-icon.svg' alt="Logo do Google" />
            Criar conta com o Google
          </Button> */}
          <Button
            className="login-button"
            href="/registrar"
            variant="contained"
            color="primary"
            style={{ width: "260px" }}
          >
            <GroupAdd style={{ marginRight: "5px" }} />
            Cadastre-se
          </Button>
        </div>
      </Box>
    </div>
  );
}

export default Login;
