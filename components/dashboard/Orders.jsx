import React, { useEffect, useState, useCallback } from 'react'
import { Row, Col, Descriptions, Card, Avatar, Empty, Table, Button, Tag } from 'antd'

import api, { fetcher } from '../../services/api'
import { formatDate } from '../../date'
import {
  convert_mercadopago_payment_methods,
  convert_mercadopago_status,
  formatToMoney
} from '../../helpers'

import { saveOrders } from '../../store/actions/user'
import { useDispatch, useSelector } from 'react-redux'
import { getOrders } from '../../store/selectors/user'
import Link from 'next/link'
import useSWR from 'swr'

const expandedRowRender = (order) => {
  const columns = [
    {
      title: 'Código',
      dataIndex: 'code',
      key: 'code',
      // eslint-disable-next-line react/display-name
      render: (code, row) => (
        <Link href={`/produto/${row.father_code}`} passHref>
          <a title="Abrir produto">{code}</a>
        </Link>
      )
    },
    { title: 'Descrição', dataIndex: 'description', key: 'description' },
    { title: 'Quantidade', dataIndex: 'quantity', key: 'quantity' },
    { title: 'Preço', dataIndex: 'price', key: 'price' },
    { title: 'Cor', dataIndex: 'color', key: 'color' },
    { title: 'Tamanho', dataIndex: 'size', key: 'size' },
    { title: 'Marca', dataIndex: 'brand', key: 'brand' }
  ]

  return (
    <Table
      columns={columns}
      dataSource={order.products.map((product) => {
        const description = product.description.split('COR:').slice(0, 1)[0]
        const size = product.description.split(';').slice(1, 2)[0].split(':').slice(1, 2)[0]
        const color = product.description.split(';').slice(0, 1)[0].split(':').slice(1, 2)[0]
        return {
          ...product,
          key: product.id,
          price: formatToMoney(product.price),
          description,
          size,
          color,
          quantity: product.pivot.quantity
        }
      })}
      pagination={false}
      locale={{
        emptyText: (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="Sem pedidos para mostrar"
          ></Empty>
        )
      }}
    />
  )
}

function Orders() {
  const [activeOrder, setActiveOrder] = useState(null)
  const orders = useSelector(getOrders)
  const dispatch = useDispatch()

  const { data } = useSWR(`/orders`, fetcher)

  useEffect(() => {
    if (data) {
      dispatch(saveOrders(data.data))
    }
  }, [data, dispatch])

  const columns = [
    {
      title: 'Numero do Pedido',
      dataIndex: 'external_id',
      key: 'external_id'
    },
    { title: 'Pedido Realizado', dataIndex: 'created_at', key: 'created_at' },
    {
      title: 'Quantidade de itens',
      dataIndex: 'quantity',
      key: 'quantity'
    },
    {
      title: 'Status de Pagamento',
      dataIndex: 'status',
      key: 'status',
      // eslint-disable-next-line react/display-name
      render: (status) => (
        <Tag
          color={convert_mercadopago_status(status, 'colors')}
          title={convert_mercadopago_status(status)}
          style={{ textTransform: 'uppercase', cursor: 'default' }}
        >
          {convert_mercadopago_status(status)}
        </Tag>
      )
    },
    {
      title: 'Total',
      dataIndex: 'value',
      key: 'value'
    },
    {
      title: 'Forma de Pagamento',
      dataIndex: 'billingType',
      key: 'billingType'
    }
    // {
    //   title: 'Ações',
    //   dataIndex: 'operation',
    //   key: 'operation',
    //   render: function render(text, record) {
    //     return (
    //       <div className="table-operation">
    //         <Row>
    //           <Col>
    //             <Button title="Abrir pedido" onClick={() => setActiveOrder(record)}>
    //               Detalhes
    //             </Button>
    //           </Col>
    //         </Row>
    //       </div>
    //     )
    //   }
    // }
  ]

  if (activeOrder) {
    // console.log(activeOrder)
    return (
      <>
        <Row type="flex" justify="center" align="middle">
          <Col span={24}>
            <Card>
              <Card.Meta
                title={'Pedido #' + activeOrder.id}
                description={'Realizado em ' + activeOrder.created_at}
              />
            </Card>
            <Descriptions title="Detalhes">
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
                setActiveOrder(null)
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }}
            >
              Voltar
            </Button>
          </Col>
        </Row>
      </>
    )
  }

  if (!orders) {
    return null
  }

  return (
    <Table
      className="components-table-demo-nested"
      columns={columns}
      expandedRowRender={(order) => expandedRowRender(order)}
      dataSource={orders.map((order) => {
        let count = 0
        order.products.forEach((product) => {
          count += product.pivot.quantity
        })
        return {
          ...order,
          external_id: order.external_id ? order.external_id : order.id,
          value: formatToMoney(order.value),
          quantity: count,
          key: order.id,
          created_at: formatDate(order.created_at, 'DD [de] MMMM [de] YYYY').toLowerCase(),
          billingType: convert_mercadopago_payment_methods(order.billingType)
        }
      })}
      locale={{
        emptyText: (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="Sem pedidos para mostrar"
          ></Empty>
        )
      }}
    />
  )
}

export default Orders
