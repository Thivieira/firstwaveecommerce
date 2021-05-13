import api from "../../services/api";
import { useRouter } from "next/router";
import { useEffect } from "react";
import axios from "axios";
import Status from "../../components/Status";
import { Button } from "antd";
import { clearCart } from "../../store/actions/products";
import { useDispatch } from "react-redux";

export default function index() {
  const router = useRouter();
  const dispatch = useDispatch();
  useEffect(async () => {
    const query = router.query;
    dispatch(clearCart());
    try {
      const { data } = await api.post("/brugman", {
        pedido: {
          loja: "203351750", //id loja
          cliente: {
            nome: userName, //obrigatorio
            cnpj: null,
            ie: null,
            rg: "",
            endereco: null,
            numero: "",
            complemento: "",
            cidade: null,
            bairro: null,
            cep: null,
            uf: null,
            email: null, //obrigatorio
            celular: null,
            fone: null,
          },
          pagamento: {
            categoria: "Vendas",
          },
          itens: [
            {
              codigo: "",
              descricao: "",
              qtde: "",
              vlr_unit: "",
            },
            {
              codigo: "",
              descricao: "",
              qtde: "",
              vlr_unit: "",
            },
            {
              codigo: "",
              descricao: "",
              qtde: "",
              vlr_unit: "",
            },
          ],
          parcelas: [
            // {
            //   parcela: {
            //     idLancamento: "6588650860",
            //     valor: "151.20",
            //     dataVencimento: "2019-09-25 00:00:00",
            //     obs: "",
            //     destino: "1",
            //     formaPagamento: {
            //       id: "772684",
            //       descricao: "Cartão de Débito",
            //       codigoFiscal: "4",
            //     },
            //   },
            // },
          ],
        },
        payment_id: query.payment_id,
        status: query.status,
        payment_type: query.payment_type,
        preference_id: query.preference_id,
      });
      if (data.message) {
      }
    } catch (e) {
      if (e) {
      }
    }
  }, []);
  // return(
  //   <h1>Sucesso</h1>
  // )

  const renderStatus = () => {
    switch (router.query.slug) {
      case "sucesso":
        return (
          <Status
            status="success"
            title="Sua compra foi efetuada com sucesso!"
            subTitle={`Pedido #${router.query.payment_id} Cloud server configuration takes 1-5 minutes, please wait.`}
            extra={[
              <Button
                type="primary"
                key="console"
                onClick={() => {
                  router.push("/");
                }}
              >
                Ver mais produtos
              </Button>,
              <Button
                key="buy"
                onClick={() => {
                  router.push("/dashboard");
                }}
              >
                Conferir pedido
              </Button>,
            ]}
          />
        );
      case "processando":
        return (
          <Status
            title="Successfully Purchased Cloud Server ECS!"
            extra={[
              <Button type="primary" key="console">
                Go Console
              </Button>,
            ]}
          />
        );
      case "erro":
        return (
          <Status
            status="danger"
            title="There are some problems with your operation."
            extra={[
              <Button type="primary" key="console">
                Go Console
              </Button>,
            ]}
          />
        );
      default:
        return null;
    }
  };

  return <div style={{ height: "58vh" }}>{renderStatus()}</div>;
}
