import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import api from "../services/api";
import { Button } from "@material-ui/core";

import UserData from "../components/Form/UserData";
import AddressData from "../components/Form/AddressData";
import Orders from "../components/dashboard/Orders";
import Favorites from "../components/dashboard/Favorites";
import Title from "../components/Utils/Title";
import { getAccount } from "../store/selectors/user";
import { saveAccount, saveAddress } from "../store/actions/user";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import useToken from "../contexts/TokenStorage";

function Dashboard() {
  const [formOption, setFormOption] = useState(1);
  const router = useRouter();
  const [personalData, setPersonalData] = useState([]);
  const [addressData, setAddressData] = useState([]);
  const [json, setJson] = useState({});
  const dispatch = useDispatch();
  const user = useSelector(getAccount);
  const MySwal = withReactContent(Swal);

  const [token, setToken] = useToken();

  useEffect(() => {
    if (token) {
      api.defaults.headers.common["Authorization"] = "Bearer " + token;
    } else {
      localStorage.removeItem("token");
      dispatch(saveAccount({}));
      dispatch(saveAddress({}));
      router.replace("/");
    }
  }, [token, router, dispatch]);

  const getUserData = useCallback(async () => {
    try {
      const res = await api.get("/auth/me");
      setPersonalData({
        cpf: res.data.cpf,
        email: res.data.email,
        name: res.data.name,
        phone: res.data.mobile,
      });
      dispatch(
        saveAccount({
          cpf: res.data.cpf,
          email: res.data.email,
          name: res.data.name,
          phone: res.data.mobile,
        })
      );
    } catch (e) {}
  }, [setPersonalData, dispatch]);

  const getAdressData = useCallback(async () => {
    try {
      const res = await api.get("auth/address");
      setAddressData({
        cep: res.data.postalCode,
        rua: res.data.address,
        numero: res.data.addressNumber,
        complemento: res.data.complement,
        bairro: res.data.province,
        cidade: res.data.city,
        estado: res.data.uf,
      });
      dispatch(
        saveAddress({
          street: res.data.address,
          number: res.data.addressNumber,
          complement: res.data.complement,
          zipcode: res.data.postalCode,
          state: res.data.uf,
          city: res.data.city,
          neighborhood: res.data.province,
        })
      );
    } catch (e) {}
  }, [setAddressData, dispatch]);

  const updateUser = useCallback(
    async ({ name, password, email, phone, cpf }) => {
      if (password) {
        setJson({
          email: email,
          name: name,
          password: password,
          mobile: phone,
          cpf,
        });
      } else {
        setJson({ email: email, name: name, mobile: phone, cpf });
      }
      try {
        const res = await api.post("/auth/me", json);
        MySwal.fire({
          title: <p>Usuário editado com sucesso!</p>,
          confirmButtonText: "OK",
        });
      } catch (e) {
        MySwal.fire({
          title: <p>Falha ao editar usuário!</p>,
          confirmButtonText: "OK",
        });
      }
    },
    [json, MySwal]
  );

  const updateAddress = useCallback(
    async ({ cep, street, number, complement, neighborhood, city, state }) => {
      try {
        const res = await api.post("/auth/address", {
          province: neighborhood,
          postalCode: cep,
          city,
          complement,
          uf: state,
          addressNumber: number,
          address: street,
        });
        MySwal.fire({
          title: <p>Endereço editado com sucesso!</p>,
          confirmButtonText: "OK",
        });
      } catch (e) {
        MySwal.fire({
          title: <p>Falha ao editar endereço!</p>,
          confirmButtonText: "OK",
        });
      }
    },
    [MySwal]
  );

  useEffect(() => {
    getUserData();
    getAdressData();
  }, [getUserData, getAdressData]);

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
      default:
        return "Meus Pedidos";
    }
  }

  function switchFormOption() {
    switch (formOption) {
      case 1:
        return <Orders />;
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
      default:
        return <p>Meus Pedidos</p>;
    }
  }

  return (
    <div className="dashboard-container">
      <div id="edit-account">
        <Title title={pageTitle()} />
        <div className="edit-account-container">
          <ul className="edit-account-list" style={{ overflow: "auto" }}>
            <li className={formOption === 1 ? "edit-bordered" : ""}>
              <Button onClick={() => setFormOption(1)} color="primary">
                Pedidos
              </Button>
            </li>
            <li className={formOption === 2 ? "edit-bordered" : ""}>
              <Button onClick={() => setFormOption(2)} color="primary">
                Usuário
              </Button>
            </li>
            <li className={formOption === 3 ? "edit-bordered" : ""}>
              <Button onClick={() => setFormOption(3)} color="primary">
                Endereço
              </Button>
            </li>
            <li className={formOption === 4 ? "edit-bordered" : ""}>
              <Button onClick={() => setFormOption(4)} color="primary">
                Favoritos
              </Button>
            </li>
            <li>
              <Link href="/" passHref>
                <Button color="primary">Voltar</Button>
              </Link>
            </li>
          </ul>
          <div className="form-container">
            {personalData.length !== 0 ? switchFormOption() : ""}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
