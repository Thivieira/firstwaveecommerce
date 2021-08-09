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
} from "antd";
import api from "../../services/api";
import { formatDate } from "../../date";
import { formatToMoney } from "../../helpers";

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
  const [orders, setOrders] = useState([]);
  const [activeOrder, setActiveOrder] = useState(null);

  const getOrders = useCallback(async () => {
    try {
      const res = await api.get("/orders");
      setOrders(res.data);
    } catch (e) {}
  }, [setOrders]);

  useEffect(() => {
    getOrders();
  }, [getOrders]);

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
            <a onClick={() => setActiveOrder(record.id)}>Abrir</a>
          </span>
        );
      },
    },
  ];
  if (activeOrder) {
    return (
      <Row type="flex" justify="center" align="middle">
        <Col span={24}>
          <Card
            cover={
              <img
                alt="example"
                src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
              />
            }
            actions={
              [
                // <Icon type="setting" key="setting" />,
                // <Icon type="edit" key="edit" />,
                // <Icon type="ellipsis" key="ellipsis" />,
              ]
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
            <Descriptions.Item label="UserName">Zhou Maomao</Descriptions.Item>
            <Descriptions.Item label="Telephone">1810000000</Descriptions.Item>
            <Descriptions.Item label="Live">
              Hangzhou, Zhejiang
            </Descriptions.Item>
            <Descriptions.Item label="Remark">empty</Descriptions.Item>
            <Descriptions.Item label="Address">
              No. 18, Wantang Road, Xihu District, Hangzhou, Zhejiang, China
            </Descriptions.Item>
          </Descriptions>
        </Col>
      </Row>
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
