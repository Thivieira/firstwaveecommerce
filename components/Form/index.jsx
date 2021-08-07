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
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

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

  const MySwal = withReactContent(Swal);



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
        .post("/auth/login", {
          email: email,
          password: password,
        })
        .then((res) => {
          localStorage.setItem("key", res.data.access_token);

          localStorage.setItem("authorized", true);

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
      .post("/register", {
        cpf: collectedData.cpf.replace(/[^\d]/g, ""),
        email: collectedData.email,
        name: collectedData.name,
        password: collectedData.password,
        mobile: collectedData.phone.replace(/[^\d]/g, ""),
      })
      .then(() => {
        handleLogin()
          .then(() => {
            api
              .put("/address", {
                province: submitData.neighborhood,
                postalCode: submitData.cep.replace(/[^\d]/g, ""),
                city: submitData.city,
                complement: submitData.complement,
                uf: submitData.state,
                addressNumber: submitData.number,
                address: submitData.street,
              })
              .then(() => {
                    MySwal.fire({
                      title: (
                        <p>Conta cadastrada com sucesso!</p>
                      ),
                      confirmButtonText: "OK",
                    }).then((res) => {
                        if (res.isConfirmed) {
                          history.push("/");
                        }
                    });
              })
              .catch(() => {
                MySwal.fire({
                      title: (
                        <p>Falha ao cadastrar endereço!</p>
                      ),
                      confirmButtonText: "OK",
                    }).then((res) => {
                        if (res.isConfirmed) {
                        }
                    });
              });
          })
          .catch(() => MySwal.fire({
                      title: (
                        <p>Usuário ou senha incorretos!</p>
                      ),
                      confirmButtonText: "OK",
                    }));
      })
      .catch(() => MySwal.fire({
                      title: (
                        <p>Falha ao cadastrar usuário.</p>
                      ),
                      confirmButtonText: "OK",
                    }));
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
