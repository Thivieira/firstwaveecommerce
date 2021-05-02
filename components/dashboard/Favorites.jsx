import React from "react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { getFavoritesProd } from "../../store/selectors/products";
import { removeFromFavorites } from "../../store/actions/products";
import { List, Avatar, Empty } from "antd";
import { CloseCircleTwoTone } from "@ant-design/icons";

export default function Favorites() {
  const dispatch = useDispatch();
  const productsFavorites = useSelector(getFavoritesProd);
  const disp = (item) => {
    dispatch(removeFromFavorites(item));
  };

  return (
    <List
      itemLayout="horizontal"
      locale={{
        emptyText: (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="Sem favoritos para mostrar"
          ></Empty>
        ),
      }}
      dataSource={productsFavorites}
      renderItem={(item) => {
        const image = item.variacoes.map((el) => el.variacao)[0].imagem[0]
          ? item.variacoes.map((el) => el.variacao)[0].imagem[0].link
          : "/image1.jpg";
        return (
          <List.Item
            actions={[
              <a key="list-remove-item" onClick={() => disp(item.id)}>
                {" "}
                <CloseCircleTwoTone style={{ fontSize: "1.5rem" }} />{" "}
              </a>,
            ]}
          >
            <List.Item.Meta
              avatar={<Avatar shape="square" size={64} src={image} />}
              title={
                <Link href={`/produto/${item.codigo}`}>
                  {" " + item.descricao + " "}
                </Link>
              }
              description={
                "R$ " + parseFloat(item.preco).toFixed(2).replace(".", ",")
              }
            />
          </List.Item>
        );
      }}
    />
  );
}
