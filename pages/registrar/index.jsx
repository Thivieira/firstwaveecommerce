import React, { useState } from "react";

import { Stepper, Step, StepLabel, Container } from "@material-ui/core";
import { useRouter } from "next/router";
import UserData from "./UserData";
import AddressData from "./AddressData";
import {
  passwordValidator,
  cpfValidator,
  phoneValidator,
} from "../../models/Form";
import FormValidations from "../../contexts/FormValidations";
import api from "../../services/api";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

function Form() {
  const [currentStep, setCurrentStep] = useState(0);
  const [collectedData, setCollectedData] = useState({
    email: "",
    password: "",
    passwordConfirmation: "",
    name: "",
    cpf: "",
    phone: "",
    cep: "",
    street: "",
    number: "",
    complement: "",
    neighborhood: "",
    city: "",
    state: "",
  });
  const router = useRouter();
  const MySwal = withReactContent(Swal);

  async function signUpUser({
    name,
    password,
    passwordConfirmation,
    email,
    cpf,
    phone,
  }) {
    setCollectedData((prevState) => ({
      ...prevState,
      email: email,
      password: password,
      passwordConfirmation: passwordConfirmation,
      name: name,
      cpf: cpf,
      phone: phone,
    }));
    next();
  }

  function handleLogin() {
    const { email, password } = collectedData;
    return new Promise((resolve, reject) => {
      api
        .post("/auth/login", {
          email: email,
          password: password,
        })
        .then((res) => {
          sessionStorage.setItem("key", res.data.access_token);
          sessionStorage.setItem("authorized", true);
          api.defaults.headers.common["Authorization"] =
            "Bearer " + res.data.access_token;
          resolve();
        })
        .catch(() => {
          reject();
        });
    });
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
        state: submitData.state,
      };
    });
    api
      .post("/auth/register", {
        cpf: collectedData.cpf.replace(/[^\d]/g, ""),
        email: collectedData.email,
        name: collectedData.name,
        password: collectedData.password,
        password_confirmation: collectedData.passwordConfirmation,
        mobile: collectedData.phone.replace(/[^\d]/g, ""),
      })
      .then(() => {
        handleLogin()
          .then(() => {
            api
              .post("/address", {
                province: submitData.neighborhood,
                postalCode: submitData.cep.replace(/[^\d]/g, ""),
                city: submitData.city,
                complement: submitData.complement,
                uf: submitData.state,
                addressNumber: submitData.number,
                address: submitData.street,
              })
              .then(() => {
                MySwal.fire("Conta cadastrada com sucesso!");
                router.push("/");
              })
              .catch(() => {
                MySwal.fire("Falha ao cadastrar endereço!");
              });
          })
          .catch(() => MySwal.fire("Usuário ou senha incorretos!"));
      })
      .catch(() => MySwal.fire("Falha ao cadastrar usuário"));
  }

  const forms = [
    <UserData data={collectedData} onSubmit={signUpUser} signup={true} />,
    <AddressData
      data={collectedData}
      onSubmit={signUpAddress}
      goBack={goBack}
      signup={true}
    />,
  ];

  const next = () => setCurrentStep(currentStep + 1);

  const goBack = () => setCurrentStep(currentStep - 1);

  return (
    <Container component="article" maxWidth="sm" style={{minHeight: '100vh'}}>
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
          phone: phoneValidator,
        }}
      >
        {forms[currentStep]}
      </FormValidations.Provider>
    </Container>
  );
}

export default Form;