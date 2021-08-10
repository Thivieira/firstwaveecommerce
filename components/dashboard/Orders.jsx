import React, { useEffect, useState, useCallback } from "react";
import {
  Row,
  Col,
  Descriptions,
  Card,
  Icon,
  Avatar,
  Empty,
  Menu,
  Table,
  Button,
} from "antd";

import api from "../../services/api";
import { formatDate } from "../../date";
import {
  convert_mercadopago_payment_methods,
  convert_mercadopago_status,
  formatToMoney,
} from "../../helpers";

import { saveOrders } from "../../store/actions/user";
import { useDispatch, useSelector } from "react-redux";
import { getOrders } from "../../store/selectors/user";

const expandedRowRender = (order) => {
  const columns = [
    { title: "Código", dataIndex: "code", key: "code" },
    { title: "Descrição", dataIndex: "description", key: "description" },
    { title: "Quantidade", dataIndex: "quantity", key: "quantity" },
    { title: "Preço", dataIndex: "price", key: "price" },
    { title: "Cor", dataIndex: "color", key: "color" },
    { title: "Tamanho", dataIndex: "size", key: "size" },
    { title: "Marca", dataIndex: "brand", key: "brand" },
  ];

  return (
    <Table
      columns={columns}
      dataSource={order.products.map((product) => {
        const description = product.description.split("COR:").slice(0, 1)[0];
        const size = product.description
          .split(";")
          .slice(1, 2)[0]
          .split(":")
          .slice(1, 2)[0];
        const color = product.description
          .split(";")
          .slice(0, 1)[0]
          .split(":")
          .slice(1, 2)[0];
        return {
          ...product,
          key: product.id,
          price: formatToMoney(product.price),
          description,
          size,
          color,
          quantity: product.pivot.quantity,
        };
      })}
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

function Orders() {
  // const [orders, setOrders] = useState([]);
  const [activeOrder, setActiveOrder] = useState(null);
  const orders = useSelector(getOrders);
  const dispatch = useDispatch();

  const getOrdersFromApi = useCallback(async () => {
    try {
      const res = await api.get("/orders");
      dispatch(saveOrders(res.data));
    } catch (e) {}
  }, [dispatch]);

  useEffect(() => {
    getOrdersFromApi();
  }, [getOrdersFromApi]);

  const columns = [
    { title: "Numero do Pedido", dataIndex: "external_id", key: "external_id" },
    { title: "Pedido Realizado", dataIndex: "created_at", key: "created_at" },
    {
      title: "Quantidade de itens",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Status de Pagamento",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Total",
      dataIndex: "value",
      key: "value",
    },
    {
      title: "Forma de Pagamento",
      dataIndex: "billingType",
      key: "billingType",
    },
    {
      title: "Ações",
      dataIndex: "operation",
      key: "operation",
      render: function render(text, record) {
        return (
          <span className="table-operation">
            <a title="Abrir pedido" onClick={() => setActiveOrder(record)}>
              Abrir
            </a>
          </span>
        );
      },
    },
  ];
  if (activeOrder) {
    return (
      <>
        <Row type="flex" justify="center" align="middle">
          <Col span={24}>
            <Card
              cover={
                <img
                  alt="example"
                  src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                />
              }
            >
              <Card.Meta
                avatar={
                  <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
                }
                title="Card title"
                description="This is the description"
              />
            </Card>
            <Descriptions title="User Info">
              <Descriptions.Item label="UserName"></Descriptions.Item>
              <Descriptions.Item label="Telephone"></Descriptions.Item>
              <Descriptions.Item label="Live"></Descriptions.Item>
              <Descriptions.Item label="Remark"></Descriptions.Item>
              <Descriptions.Item label="Address"></Descriptions.Item>
            </Descriptions>
          </Col>
        </Row>
        <Row>
          <Col>{expandedRowRender(activeOrder)}</Col>
        </Row>
        <Row>
          <Col>
            <Button
              type="primary"
              onClick={() => {
                setActiveOrder(null);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              Voltar
            </Button>
          </Col>
        </Row>
      </>
    );
  }

  return (
    <Table
      className="components-table-demo-nested"
      columns={columns}
      expandedRowRender={(order) => expandedRowRender(order)}
      dataSource={orders.map((order) => {
        return {
          ...order,
          value: formatToMoney(order.value),
          quantity: order.products.length,
          key: order.id,
          created_at: formatDate(
            order.created_at,
            "DD [de] MMMM [de] YYYY"
          ).toLowerCase(),
          status: convert_mercadopago_status(order.status),
          billingType: convert_mercadopago_payment_methods(order.billingType),
        };
      })}
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

export default Orders;
