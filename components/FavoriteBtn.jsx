import { useDispatch, useSelector } from "react-redux";

import { HeartTwoTone } from "@ant-design/icons";
import { Tooltip } from "antd";
import api from "../services/api";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import {
  addToFavorites,
  setFavorite,
  removeFromFavorites,
  clearFavoritesProd,
} from "../store/actions/products";

import { getFavoritesProd } from "../store/selectors/products";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import useToken from "../contexts/TokenStorage";

export default function FavoriteBtn({ product }) {
  const router = useRouter();
  const dispatch = useDispatch();

  const productsFavorites = useSelector(getFavoritesProd);

  const [token, setToken] = useToken();

  useEffect(() => {
    if (token) {
      api.defaults.headers.common["Authorization"] = "Bearer " + token;
      setToken(token);
    }
  }, [setToken, token]);

  const MySwal = withReactContent(Swal);
  const [favorite, setFavoriteState] = useState(product.favorite);

  function alertLogin() {
    MySwal.fire({
      title: <p>Para favoritar um produto é necessário se logar.</p>,
      confirmButtonText: "Entrar",
      cancelButtonText: "Cancelar",
      showCancelButton: true,
    }).then((res) => {
      if (res.isConfirmed) {
        router.push("/login");
      }
    });
  }

  useEffect(() => {
    let isFavorite = productsFavorites.map(
      (favorite) => product.id === favorite.product.id
    )[0];
    setFavoriteState(isFavorite);
  }, [product.id, productsFavorites]);

  const toggleFavorites = async () => {
    let existingProductInFavorites = productsFavorites.filter(
      (favorite) => favorite.product.id === product.id
    );

    if (token) {
      if (existingProductInFavorites.length > 0) {
        existingProductInFavorites = existingProductInFavorites[0];
        const favoriteId = existingProductInFavorites.id;
        try {
          await api.delete(`/favorites/${favoriteId}`);
          dispatch(removeFromFavorites(existingProductInFavorites.product.id));
        } catch (e) {}
      } else {
        try {
          const { data } = await api.post(`/favorites`, {
            product_id: product.id,
          });
          dispatch(addToFavorites(data));
        } catch (e) {}
      }
    } else {
      alertLogin();
    }
  };

  return (
    <Tooltip
      placement="bottom"
      title={favorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
    >
      <HeartTwoTone
        className="heart"
        twoToneColor={favorite ? "#ff0000" : "#0080A8"}
        onClick={() => {
          if (token) {
            setFavoriteState(!favorite);
            toggleFavorites();
          } else {
            alertLogin();
          }
        }}
      />
    </Tooltip>
  );
}
