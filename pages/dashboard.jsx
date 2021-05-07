import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import api from "../services/api";
import { Button } from "@material-ui/core";

import UserData from "../components/Form/UserData";
import AddressData from "../components/Form/AddressData";
import TableOrdered from "../components/dashboard/TableOrdered";
import Favorites from "../components/dashboard/Favorites";
import Title from "../components/Utils/Title";
import { saveAddress } from "../store/actions/user";
import { useDispatch } from "react-redux";

function Dashboard() {
  const [formOption, setFormOption] = useState(1);
  const router = useRouter();
  const [personalData, setPersonalData] = useState([]);
  const [addressData, setAddressData] = useState([]);
  const [json, setJson] = useState({});
  const dispatch = useDispatch();
  const token = sessionStorage.getItem("key");
  api.defaults.headers.common["Authorization"] = "Bearer " + token;
  const authenticated = Boolean(sessionStorage.getItem("authorized"));

  if (!authenticated) {
    router.replace("/");
    return null;
  }

  useEffect(() => {
    getUserData();
    getAdressData();
  }, [formOption]);

  async function getUserData() {
    await api
      .get("/usuario")
      .then((res) => {
        setPersonalData({
          cpf: res.data.cpf,
          email: res.data.email,
          name: res.data.nomeCompleto,
          phone: res.data.telefone,
        });
        dispatch(
          saveAccount({
            cpf: res.data.cpf,
            email: res.data.email,
            name: res.data.nomeCompleto,
            phone: res.data.telefone,
          })
        );
      })
      .catch(() => alert("Não foi possível pegar os dados!"));
  }

  async function getAdressData() {
    await api.get("endereco").then((res) => {
      setAddressData(res.data);
      dispatch(
        saveAddress({
          street: res.data.rua,
          number: res.data.numero,
          complement: res.data.complemento,
          zipcode: res.data.cep,
          state: res.data.state,
          city: res.data.cidade,
          neighborhood: res.data.bairro,
        })
      );
    });
  }

  async function updateUser({ name, password, email, phone }) {
    if (password) {
      setJson({
        email: email,
        nomeCompleto: name,
        senha: password,
        telefone: phone,
      });
    } else {
      setJson({ email: email, nomeCompleto: name, telefone: phone });
    }
    await api
      .patch("/usuario", json)
      .then(() => alert("usuário editado com sucesso!"))
      .catch(() => alert("falha ao editar usuário!"));
  }

  async function updateAddress({
    cep,
    street,
    number,
    complement,
    neighborhood,
    city,
    state,
  }) {
    await api
      .put("endereco", {
        bairro: neighborhood,
        cep: cep,
        cidade: city,
        complemento: complement,
        estado: state,
        numero: number,
        rua: street,
      })
      .then(() => alert("Endereço editado com sucesso!"))
      .catch(() => alert("Falha ao editar endereço!"));
  }

  function pageTitle() {
    switch (formOption) {
      case 1:
        return "Meus Pedidos";
      case 2:
        return "Editar Dados de Usuário";
      case 3:
        return "Editar Endereço";
      case 4:
        return "Meus Favoritos";
      case 5:
        return "Trocas e devoluções";
      default:
        return "Meus Pedidos";
    }
  }

  function switchFormOption() {
    switch (formOption) {
      case 1:
        return <TableOrdered />;
      case 2:
        return (
          <UserData onSubmit={updateUser} data={personalData} signup={false} />
        );
      case 3:
        return (
          <AddressData
            onSubmit={updateAddress}
            data={addressData}
            signup={false}
          />
        );
      case 4:
        return <Favorites />;
      case 5:
        return <p>Trocas e devoluções</p>;
      default:
        return <p>Meus Pedidos</p>;
    }
  }

  return (
    <div id="edit-account">
      <Title title={pageTitle()} />
      <div className="edit-account-container">
        <ul className="edit-account-list" style={{ overflow: "auto" }}>
          <li className={formOption === 1 ? "edit-bordered" : ""}>
            <Button onClick={() => setFormOption(1)} color="primary">
              Meus Pedidos
            </Button>
          </li>
          <li className={formOption === 2 ? "edit-bordered" : ""}>
            <Button onClick={() => setFormOption(2)} color="primary">
              Dados de usuário
            </Button>
          </li>
          <li className={formOption === 3 ? "edit-bordered" : ""}>
            <Button onClick={() => setFormOption(3)} color="primary">
              Endereço
            </Button>
          </li>
          <li className={formOption === 4 ? "edit-bordered" : ""}>
            <Button onClick={() => setFormOption(4)} color="primary">
              Meus Favoritos
            </Button>
          </li>
          <li className={formOption === 5 ? "edit-bordered" : ""}>
            <Button onClick={() => setFormOption(5)} color="primary">
              Trocas e Devoluções
            </Button>
          </li>
          <li>
            <Link href="/">
              <>
                <Button color="primary">Voltar</Button>
              </>
            </Link>
          </li>
        </ul>
        <div className="form-container">
          {personalData.length !== 0 ? switchFormOption() : ""}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
