import api from "../../services/api";
import { useRouter } from "next/router";
import { useEffect } from "react";
import axios from "axios";

export default function index() {
  const router = useRouter();
  useEffect(async () => {
    const query = router.query;
    try {
      axios.post("bling", recebeDoFront);

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

  switch (router.query.slug) {
    case "sucesso":
      return <h1>Sucesso</h1>;
    case "processando":
      return <h1>Processando</h1>;
    case "erro":
      return <h1>Erro</h1>;
    default:
      return null;
  }
}
