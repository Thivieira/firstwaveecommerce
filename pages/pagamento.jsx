import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { TextField } from "@material-ui/core";

import { getCartState, getCartTotal } from "../store/selectors/products";
import { saveAccount, saveAddress } from "../store/actions/user";

import NumeratedTitled from "../components/Utils/NumeratedTitle";
import PaymentBox from "../components/Utils/PaymentBox";
import NavLink from "../components/NavLink";
import api from "../services/api";
import PaymentBtn from "../components/PaymentBtn";
import { useRouter } from "next/router";
import { getAccount } from "../store/selectors/user";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import useToken from "../contexts/TokenStorage";
import Image from "next/image";
import noImage from "../public/noimage.png";

function Payment() {
  const router = useRouter();
  const cart = useSelector(getCartState);
  const cartTotal = useSelector(getCartTotal);

  const [personalData, setPersonalData] = useState({
    name: "",
    email: "",
    mobile: "",
    cpf: "",
  });

  const [edit, setEdit] = useState(false);
  const [street, setStreet] = useState("");
  const [number, setNumber] = useState("");
  const [complement, setComplement] = useState("");
  const [cep, setCep] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const dispatch = useDispatch();
  const MySwal = withReactContent(Swal);

  const [token, setToken] = useToken();

  const getUserData = useCallback(() => {
    api
      .get("/auth/me")
      .then((res) => {
        dispatch(
          saveAccount({
            cpf: res.data.cpf,
            email: res.data.email,
            name: res.data.name,
            phone: res.data.mobile,
          })
        );
        setPersonalData({
          cpf: res.data.cpf,
          email: res.data.email,
          name: res.data.name,
          mobile: res.data.mobile,
        });
      })
      .catch((e) => {});
  }, [dispatch]);

  const getAddressData = useCallback(() => {
    api
      .get("/auth/address")
      .then((res) => {
        setStreet(res.data.address);
        setNumber(res.data.addressNumber);
        setComplement(res.data.complement);
        setCep(res.data.postalCode);
        setState(res.data.uf);
        setCity(res.data.city);
        setNeighborhood(res.data.province);
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
      })
      .catch(() => {});
  }, [dispatch]);

  useEffect(() => {
    if (token) {
      api.defaults.headers.common["Authorization"] = "Bearer " + token;
      setToken(token);
    }
  }, [token, setToken]);

  useEffect(() => {
    getUserData();
    getAddressData();
  }, [edit, getUserData, getAddressData]);

  async function handleEditAddress() {
    if (edit) {
      await api
        .post("/auth/address", {
          province: neighborhood,
          postalCode: cep,
          city,
          complement,
          uf: state,
          addressNumber: number,
          address: street,
        })
        .then(() => {
          MySwal.fire({
            title: <p>Endereço editado com sucesso!</p>,
            confirmButtonText: "OK",
          });
        })
        .catch(() => {
          MySwal.fire({
            title: <p>Falha ao editar endereço!</p>,
            confirmButtonText: "OK",
          });
        });
    } else {
      setEdit(true);
    }
  }

  useEffect(() => {
    if (cart.length == 0 || !token) {
      router.push("/");
    }
  }, [cart, token, router]);

  if (cart.length == 0 || !token) {
    return (
      <div className="payment-container">
        <div className="payment-top-container">
          <div className="column">
            <NumeratedTitled title="Dados Pessoais" />
            <PaymentBox type={3}>
              <TextField
                id="name"
                label="Nome Completo"
                variant="filled"
                margin="normal"
                className="white-background"
                size="small"
                InputProps={{
                  readOnly: !edit,
                }}
                fullWidth
              />
              <TextField
                id="email"
                label="Email"
                variant="filled"
                margin="normal"
                className="white-background"
                size="small"
                InputProps={{
                  readOnly: !edit,
                }}
                fullWidth
              />
              <TextField
                id="telefone"
                label="Telefone"
                variant="filled"
                margin="normal"
                className="white-background"
                size="small"
                InputProps={{
                  readOnly: !edit,
                }}
                fullWidth
              />
              <TextField
                id="cpf"
                label="Cpf"
                variant="filled"
                margin="normal"
                className="white-background"
                size="small"
                InputProps={{
                  readOnly: !edit,
                }}
                fullWidth
              />
            </PaymentBox>
          </div>
          <div className="column">
            <NumeratedTitled title="Endereço de entrega" />
            <PaymentBox type={1} onClick={handleEditAddress}>
              <TextField
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                id="street"
                label="Rua"
                variant="filled"
                margin="normal"
                className="white-background"
                size="small"
                InputProps={{
                  readOnly: !edit,
                }}
                fullWidth
              />
              <div className="line-input">
                <div className="first-line-input">
                  <TextField
                    value={number}
                    onChange={(e) => setNumber(e.target.value)}
                    id="number"
                    label="Número"
                    variant="filled"
                    margin="normal"
                    className="white-background"
                    size="small"
                    InputProps={{
                      readOnly: !edit,
                    }}
                  />
                </div>
                <TextField
                  value={complement}
                  onChange={(e) => setComplement(e.target.value)}
                  id="complement"
                  label="Complemento"
                  variant="filled"
                  margin="normal"
                  className="white-background"
                  size="small"
                  InputProps={{
                    readOnly: !edit,
                  }}
                  fullWidth
                />
              </div>
              <TextField
                value={cep}
                onChange={(e) => setCep(e.target.value)}
                id="cep"
                label="CEP"
                variant="filled"
                margin="normal"
                className="white-background"
                size="small"
                InputProps={{
                  readOnly: !edit,
                }}
                fullWidth
              />
              <div className="line-input">
                <div className="first-line-input">
                  <TextField
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    id="state"
                    label="Estado"
                    variant="filled"
                    margin="normal"
                    className="white-background"
                    size="small"
                    InputProps={{
                      readOnly: !edit,
                    }}
                  />
                </div>
                <TextField
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  id="city"
                  label="Cidade"
                  variant="filled"
                  margin="normal"
                  className="white-background"
                  size="small"
                  InputProps={{
                    readOnly: !edit,
                  }}
                  fullWidth
                />
              </div>
              <TextField
                value={neighborhood}
                onChange={(e) => setNeighborhood(e.target.value)}
                id="neighborhood"
                label="Bairro"
                variant="filled"
                margin="normal"
                className="white-background"
                size="small"
                InputProps={{
                  readOnly: !edit,
                }}
                fullWidth
              />
            </PaymentBox>
          </div>
          <div className="column">
            <NumeratedTitled title="Seu pedido" />
            <div className="cart-payment-container">
              <div className="cart-payment"></div>
              <div className="sub-price">
                <p className="sub-price__val"></p>
              </div>
            </div>
          </div>
        </div>
        <div className="payment-bottom-container">
          <NumeratedTitled title="Pagamento" />
          <div className="payment-data"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-container">
      <div className="payment-top-container">
        <div className="column">
          <NumeratedTitled title="Dados Pessoais" />
          <PaymentBox type={3}>
            <TextField
              value={personalData.name}
              id="name"
              label="Nome Completo"
              variant="filled"
              margin="normal"
              className="white-background"
              size="small"
              InputProps={{
                readOnly: !edit,
              }}
              fullWidth
            />
            <TextField
              value={personalData.email}
              id="email"
              label="Email"
              variant="filled"
              margin="normal"
              className="white-background"
              size="small"
              InputProps={{
                readOnly: !edit,
              }}
              fullWidth
            />
            <TextField
              value={personalData.mobile}
              id="telefone"
              label="Telefone"
              variant="filled"
              margin="normal"
              className="white-background"
              size="small"
              InputProps={{
                readOnly: !edit,
              }}
              fullWidth
            />
            <TextField
              value={personalData.cpf}
              id="cpf"
              label="Cpf"
              variant="filled"
              margin="normal"
              className="white-background"
              size="small"
              InputProps={{
                readOnly: !edit,
              }}
              fullWidth
            />
          </PaymentBox>
        </div>
        <div className="column">
          <NumeratedTitled title="Endereço de entrega" />
          <PaymentBox type={1} onClick={handleEditAddress}>
            <TextField
              value={street}
              onChange={(e) => setStreet(e.target.value)}
              id="street"
              label="Rua"
              variant="filled"
              margin="normal"
              className="white-background"
              size="small"
              InputProps={{
                readOnly: !edit,
              }}
              fullWidth
            />
            <div className="line-input">
              <div className="first-line-input">
                <TextField
                  value={number}
                  onChange={(e) => setNumber(e.target.value)}
                  id="number"
                  label="Número"
                  variant="filled"
                  margin="normal"
                  className="white-background"
                  size="small"
                  InputProps={{
                    readOnly: !edit,
                  }}
                />
              </div>
              <TextField
                value={complement}
                onChange={(e) => setComplement(e.target.value)}
                id="complement"
                label="Complemento"
                variant="filled"
                margin="normal"
                className="white-background"
                size="small"
                InputProps={{
                  readOnly: !edit,
                }}
                fullWidth
              />
            </div>
            <TextField
              value={cep}
              onChange={(e) => setCep(e.target.value)}
              id="cep"
              label="CEP"
              variant="filled"
              margin="normal"
              className="white-background"
              size="small"
              InputProps={{
                readOnly: !edit,
              }}
              fullWidth
            />
            <div className="line-input">
              <div className="first-line-input">
                <TextField
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  id="state"
                  label="Estado"
                  variant="filled"
                  margin="normal"
                  className="white-background"
                  size="small"
                  InputProps={{
                    readOnly: !edit,
                  }}
                />
              </div>
              <TextField
                value={city}
                onChange={(e) => setCity(e.target.value)}
                id="city"
                label="Cidade"
                variant="filled"
                margin="normal"
                className="white-background"
                size="small"
                InputProps={{
                  readOnly: !edit,
                }}
                fullWidth
              />
            </div>
            <TextField
              value={neighborhood}
              onChange={(e) => setNeighborhood(e.target.value)}
              id="neighborhood"
              label="Bairro"
              variant="filled"
              margin="normal"
              className="white-background"
              size="small"
              InputProps={{
                readOnly: !edit,
              }}
              fullWidth
            />
          </PaymentBox>
        </div>
        <div className="column">
          <NumeratedTitled title="Seu pedido" />
          <div className="cart-payment-container">
            <div className="cart-payment">
              {cart.map((product) => {
                return (
                  <div
                    className="cart-payment__details"
                    key={product.codigoVariacao}
                  >
                    <Image
                      className="thumb-cart-pay"
                      src={
                        product.imagemVariacao
                          ? product.imagemVariacao
                          : noImage
                      }
                      alt={product.description}
                      width={80}
                      height={80}
                    />
                    <div className="desc">
                      <NavLink href={`/produto/${product.code}`}>
                        <h3 className="title-cart">{product.description}</h3>
                      </NavLink>
                      <div className="color-size">
                        <p>Tamanho: {product.size}</p>
                        <p style={{ marginLeft: "10px" }}>
                          Cor: {product.color}
                        </p>
                      </div>
                      <div className="color-size">
                        <p>Quantidade: {product.quantity}</p>
                        <p style={{ marginLeft: "10px" }}>
                          {`R$ ${parseFloat(product.price)
                            .toFixed(2)
                            .replace(".", ",")}`}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="sub-price">
              <p className="sub-price__val">
                {`Total: R$${cartTotal.toFixed(2).replace(".", ",")}`}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="payment-bottom-container">
        <NumeratedTitled title="Pagamento" />
        <div className="payment-data">
          <PaymentBtn />
        </div>
      </div>
    </div>
  );
}

export default Payment;
