import React, { useState } from "react";
import { useRouter } from "next/router";
import { Stepper, Step, StepLabel, Container } from "@material-ui/core";
import UserData from "./UserData";
import AddressData from "./AddressData";
import {
  passwordValidator,
  cpfValidator,
  phoneValidator,
} from "../../models/Form";
import FormValidations from "../../contexts/FormValidations";
import api from "../../services/api";

function Form() {
  const history = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [collectedData, setCollectedData] = useState({
    email: "",
    password: "",
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

  // console.log(collectedData.neighborhood);

  async function signUpUser({ name, password, email, cpf, phone }) {
    setCollectedData((prevState) => ({
      ...prevState,
      email: email,
      password: password,
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
        .post("/auth", {
          email: email,
          senha: password,
        })
        .then((res) => {
          sessionStorage.setItem("key", res.data.token);

          sessionStorage.setItem("authorized", true);

          api.defaults.headers.common["Authorization"] =
            "Bearer " + res.data.token;
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
      .post("/usuario", {
        cpf: collectedData.cpf.replace(/[^\d]/g, ""),
        email: collectedData.email,
        nomeCompleto: collectedData.name,
        senha: collectedData.password,
        telefone: collectedData.phone.replace(/[^\d]/g, ""),
      })
      .then(() => {
        handleLogin()
          .then(() => {
            api
              .post("/endereco", {
                bairro: submitData.neighborhood,
                cep: submitData.cep.replace(/[^\d]/g, ""),
                cidade: submitData.city,
                complemento: submitData.complement,
                estado: submitData.state,
                numero: submitData.number,
                rua: submitData.street,
              })
              .then(() => {
                alert("Conta cadastrada com sucesso!");
                history.push("/");
              })
              .catch(() => {
                alert("Falha ao cadastrar endereço!");
              });
          })
          .catch(() => alert("Usuário ou senha incorretos!"));
      })
      .catch(() => alert("Falha ao cadastrar usuário"));
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

  function next() {
    setCurrentStep(currentStep + 1);
  }

  function goBack() {
    setCurrentStep(currentStep - 1);
  }

  return (
    <Container component="article" maxWidth="sm">
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
