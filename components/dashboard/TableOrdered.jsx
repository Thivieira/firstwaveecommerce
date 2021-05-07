import React, { useEffect, useState } from "react";
import { Empty, Table } from "antd";
import api from "../../services/api";
import { useSelector } from "react-redux";
import { getCartState, getCartTotal } from "../../store/selectors/products";

function TableOrdered() {
  const [userName, setUserName] = useState("");
  const cart = useSelector(getCartState);
  const cartTotal = useSelector(getCartTotal);

  const dataAtual = new Date().toISOString().slice(0, 10);

  // console.log(cart);
  // console.log(cartTotal);
  // console.log(userName);

  async function getUserName() {
    await api.get("/usuario").then((res) => setUserName(res.data.nomeCompleto));
  }

  const postPedido = {
    pedido: {
      desconto: "0,00",
      observacoes: "",
      observacaointerna: "",
      data: dataAtual,
      numero: "1",
      numeroOrdemCompra: "",
      vendedor: "",
      valorfrete: "0.00",
      totalprodutos: cartTotal, //float duas casas
      totalvenda: cartTotal,
      situacao: "Atendido",
      dataSaida: dataAtual,
      loja: "203351750", //id loja
      cliente: {
        nome: userName, //obrigatorio
      },
      pagamento: {
        categoria: "Vendas",
      },
      itens: [
        {
          item: {
            codigo: "BB01A0649-3G",
            descricao: "CAMISETA COCONUT COR:CINZA ESCURO MESCLA;TAMANHO:3G",
            quantidade: "1.0000",
            valorunidade: "47.6000000000",
            precocusto: "26.0000000000",
            descontoItem: "30.00",
            un: "UN",
            pesoBruto: "0.00000",
            largura: "",
            altura: "",
            profundidade: "",
            descricaoDetalhada: "",
            unidadeMedida: "cm",
            gtin: "7908035640037",
          },
        },
        {
          item: {
            codigo: "BB01G0638-3G",
            descricao: "CAMISETA FIFTY COR:BRANCO;TAMANHO:3G",
            quantidade: "1.0000",
            valorunidade: "56.0000000000",
            precocusto: "31.0000000000",
            descontoItem: "30.00",
            un: "UN",
            pesoBruto: "0.00000",
            largura: "",
            altura: "",
            profundidade: "",
            descricaoDetalhada: "",
            unidadeMedida: "cm",
            gtin: "7908035639895",
          },
        },
        {
          item: {
            codigo: "BB01A0639-3G",
            descricao: "CAMISETA BASIC TEAM POCKET COR:PRETO;TAMANHO:3G",
            quantidade: "1.0000",
            valorunidade: "47.6000000000",
            precocusto: "26.0000000000",
            descontoItem: "30.00",
            un: "UN",
            pesoBruto: "0.00000",
            largura: "",
            altura: "",
            profundidade: "",
            descricaoDetalhada: "",
            unidadeMedida: "cm",
            gtin: "7908035639918",
          },
        },
      ],
      parcelas: [
        {
          parcela: {
            idLancamento: "6588650860",
            valor: "151.20",
            dataVencimento: "2019-09-25 00:00:00",
            obs: "",
            destino: "1",
            formaPagamento: {
              id: "772684",
              descricao: "Cartão de Débito",
              codigoFiscal: "4",
            },
          },
        },
      ],
    },
  };

  const headers = {
    Authorization: `Bearer ${sessionStorage.getItem("key")}`,
  };

  const [getPedidos, setGetPedidos] = useState([]);

  const postPedidosAPI = async () => {
    api
      .post("/pedidos", postPedido, { headers })
      .then((res) => console.log(res));
  };

  const getPedidosAPI = async () => {
    api.get("/pedidos", { headers }).then((res) => setGetPedidos(res.data));
  };

  const test =
    getPedidos !== [] ? getPedidos.map((el) => el.pedido) : getPedidos;

  useEffect(() => {
    getPedidosAPI();
    getUserName();
    // postPedidosAPI()
  }, []);

  const expandedRowRender = () => {
    const columns = [
      { title: "Código", dataIndex: "codigo", key: "codigo" },
      { title: "Descrição", dataIndex: "descricao", key: "descricao" },
      { title: "Quantidade", dataIndex: "quantidade", key: "quantidade" },
      { title: "Preço", dataIndex: "preco", key: "preco" },
      { title: "Cor", dataIndex: "cor", key: "cor" },
      { title: "Tamanho", dataIndex: "tamanho", key: "tamanho" },
    ];

    const pedidoExpanded = [];

    test.map((el, i) => {
      pedidoExpanded.push({
        key: i,
        codigo: el.itens.map((el) => el.codigo),
        descricao: el.itens.map((el) => el.descricao),
        quantidade: el.itens.map((el) => el.quantidade),
        preco: el.itens.map((el) => el.preco),
        cor: el.itens.map((el) => el.color),
        tamanho: el.itens.map((el) => el.size),
      });
    });

    return (
      <Table
        columns={columns}
        dataSource={pedidoExpanded}
        pagination={false}
        locale={{
          emptyText: (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="Sem pedidos para mostrar"
            ></Empty>
          ),
        }}
      />
    );
  };

  const columns = [
    { title: "Numero do Pedido", dataIndex: "numero", key: "numero" },
    { title: "Data do Pedido", dataIndex: "data", key: "data" },
    {
      title: "Quantidade de itens",
      dataIndex: "quantidade",
      key: "quantidade",
    },
    {
      title: "Preço Total do Pedido",
      dataIndex: "valor_total",
      key: "valor_total",
    },
    {
      title: "Forma de Pagamento do Pedido",
      dataIndex: "forma_pagamento",
      key: "forma_pagamento",
    },
  ];

  const pedido = [];

  test.map((el, i) => {
    pedido.push({
      key: i,
      numero: el.numero,
      data: el.data,
      quantidade: el.itens.length,
      valor_total: el.totalvenda,
      forma_pagamento: el.parcelas.map(
        (el) => el.parcela.formaPagamento.descricao
      ),
    });
  });

  return (
    <Table
      className="components-table-demo-nested"
      columns={columns}
      expandable={{ expandedRowRender }}
      dataSource={pedido}
      locale={{
        emptyText: (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="Sem pedidos para mostrar"
          ></Empty>
        ),
      }}
    />
  );
}

export default TableOrdered;
