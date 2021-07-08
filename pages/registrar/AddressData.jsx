import React, { useState, useContext } from "react";
import { Button, TextField } from "@material-ui/core";
import cepApi from "../../services/cepApi";
import InputMask from "react-input-mask";

function AddressData({ data, onSubmit, goBack, signup }) {
  const [cep, setCep] = useState(data.cep);
  const [cepError, setCepError] = useState({ error: false, text: "" });
  const [street, setStreet] = useState(data.rua);
  const [number, setNumber] = useState(data.numero);
  const [complement, setComplement] = useState(data.complemento);
  const [neighborhood, setNeighborhood] = useState(data.bairro);
  const [city, setCity] = useState(data.cidade);
  const [state, setState] = useState(data.estado);

  async function cepValidator() {
    await cepApi
      .get(`/${cep}/json`)
      .then((res) => {
        setStreet(res.data.logradouro);
        setNeighborhood(res.data.bairro);
        setCity(res.data.localidade);
        setState(res.data.uf);
        setCepError({ error: false, text: "" });
      })
      .catch(() => setCepError({ error: true, text: "CEP inválido" }));
  }

  return (
    <>
      {signup ? <h2 className="form-title">Endereço</h2> : ""}
      <form
        className="form"
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit({
            cep,
            street,
            number,
            complement,
            neighborhood,
            city,
            state,
          });
        }}
      >
        <InputMask
          mask="99999-999"
          maskChar=" "
          value={cep}
          onChange={(e) => {
            setCep(e.target.value);
          }}
          onBlur={cepValidator}
        >
          {(inputProps) => (
            <TextField
              {...inputProps}
              error={cepError.error}
              helperText={cepError.text}
              id="cep"
              name="cep"
              label="CEP"
              type="text"
              variant="filled"
              margin="normal"
              required
              fullWidth
            />
          )}
        </InputMask>

        <TextField
          value={street}
          onChange={(e) => {
            setStreet(e.target.value);
          }}
          id="street"
          label="Rua"
          type="text"
          variant="filled"
          margin="normal"
          required
          fullWidth
        />
        <div className="input-container-form">
          <div className="margin-form">
            <TextField
              value={number}
              onChange={(e) => {
                setNumber(e.target.value);
              }}
              id="number"
              label="Numero"
              type="number"
              variant="filled"
              margin="normal"
              required
              className="inline-input"
            />
          </div>
          <TextField
            value={complement}
            onChange={(e) => {
              setComplement(e.target.value);
            }}
            id="complement"
            label="Complemento"
            type="text"
            variant="filled"
            margin="normal"
            required
            className="inline-input"
          />
        </div>
        <TextField
          value={neighborhood}
          onChange={(e) => {
            setNeighborhood(e.target.value);
          }}
          id="neighborhood"
          label="Bairro"
          type="text"
          variant="filled"
          margin="normal"
          fullWidth
          required
        />
        <div className="input-container-form">
          <div className="margin-form">
            <TextField
              value={city}
              onChange={(e) => {
                setCity(e.target.value);
              }}
              id="city"
              label="Cidade"
              type="text"
              variant="filled"
              margin="normal"
              required
              className="inline-input"
            />
          </div>
          <TextField
            value={state}
            onChange={(e) => {
              setState(e.target.value);
            }}
            id="state"
            label="Estado"
            type="text"
            variant="filled"
            margin="normal"
            required
            className="inline-input"
          />
        </div>
        <div
          className={
            signup ? "navigation-container" : "navigation-container edit-button"
          }
        >
          {signup ? (
            <>
              <Button onClick={goBack} color="primary">
                Voltar
              </Button>
              <Button variant="contained" type="submit" color="primary">
                Cadastrar
              </Button>
            </>
          ) : (
            <Button color="primary" type="submit">
              Salvar alterações
            </Button>
          )}
        </div>
      </form>
    </>
  );
}

export default AddressData;
