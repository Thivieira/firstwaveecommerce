import { TextField } from "@material-ui/core";

import NumeratedTitle from "../Utils/NumeratedTitle";
import PaymentBox from "../Utils/PaymentBox";

export default function PaymentPlaceholder() {
  return (
    <div className="payment-container">
      <div className="payment-top-container">
        <div className="column">
          <NumeratedTitle title="Dados Pessoais" />
          <PaymentBox type={3}>
            <TextField
              id="name"
              label="Nome Completo"
              variant="filled"
              margin="normal"
              className="white-background"
              size="small"
              InputProps={{
                readOnly: true,
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
                readOnly: true,
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
                readOnly: true,
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
                readOnly: true,
              }}
              fullWidth
            />
          </PaymentBox>
        </div>
        <div className="column">
          <NumeratedTitle title="Endereço de entrega" />
          <PaymentBox type={1} onClick={() => {}}>
            <TextField
              id="street"
              label="Rua"
              variant="filled"
              margin="normal"
              className="white-background"
              size="small"
              InputProps={{
                readOnly: true,
              }}
              fullWidth
            />
            <div className="line-input">
              <div className="first-line-input">
                <TextField
                  id="number"
                  label="Número"
                  variant="filled"
                  margin="normal"
                  className="white-background"
                  size="small"
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </div>
              <TextField
                id="complement"
                label="Complemento"
                variant="filled"
                margin="normal"
                className="white-background"
                size="small"
                InputProps={{
                  readOnly: true,
                }}
                fullWidth
              />
            </div>
            <TextField
              id="cep"
              label="CEP"
              variant="filled"
              margin="normal"
              className="white-background"
              size="small"
              InputProps={{
                readOnly: true,
              }}
              fullWidth
            />
            <div className="line-input">
              <div className="first-line-input">
                <TextField
                  id="state"
                  label="Estado"
                  variant="filled"
                  margin="normal"
                  className="white-background"
                  size="small"
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </div>
              <TextField
                id="city"
                label="Cidade"
                variant="filled"
                margin="normal"
                className="white-background"
                size="small"
                InputProps={{
                  readOnly: true,
                }}
                fullWidth
              />
            </div>
            <TextField
              id="neighborhood"
              label="Bairro"
              variant="filled"
              margin="normal"
              className="white-background"
              size="small"
              InputProps={{
                readOnly: true,
              }}
              fullWidth
            />
          </PaymentBox>
        </div>
        <div className="column">
          <NumeratedTitle title="Seu pedido" />
          <div className="cart-payment-container">
            <div className="cart-payment"></div>
            <div className="sub-price">
              <p className="sub-price__val"></p>
            </div>
          </div>
        </div>
      </div>
      <div className="payment-bottom-container">
        <NumeratedTitle title="Pagamento" />
        <div className="payment-data"></div>
      </div>
    </div>
  );
}
