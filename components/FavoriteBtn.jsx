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

export default function FavoriteBtn({ product }) {
  const router = useRouter();
  const dispatch = useDispatch();

  const productsFavorites = useSelector(getFavoritesProd);

  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    setAuthorized(localStorage.getItem("authorized"));
  }, []);
  const MySwal = withReactContent(Swal);
  const [favorite, setFavoriteState] = useState(product.favorite);

  useEffect(() => {
    let isFavorite = productsFavorites.map(
      (favorite) => product.id === favorite.product.id
    )[0];
    setFavoriteState(isFavorite);
  }, [productsFavorites]);

  const toggleFavorites = async () => {
    let existingProductInFavorites = productsFavorites.filter(
      (favorite) => favorite.product.id === product.id
    );

    if (authorized) {
      if (existingProductInFavorites.length > 0) {
        existingProductInFavorites = existingProductInFavorites[0];
        const favoriteId = existingProductInFavorites.id;
        try {
          await api.delete(`/favorites/${favoriteId}`);
          // dispatch(
          //   setFavorite({
          //     favorite: false,
          //     id: existingProductInFavorites.product.id,
          //   })
          // );
          dispatch(removeFromFavorites(existingProductInFavorites.product.id));
        } catch (e) {}
      } else {
        try {
          const { data } = await api.post(`/favorites`, {
            product_id: product.id,
          });
          // dispatch(setFavorite({ favorite: true, id: data.product.id }));
          dispatch(addToFavorites(data));
        } catch (e) {}
      }
    } else {
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
          setFavoriteState(!favorite);
          toggleFavorites();
        }}
      />
    </Tooltip>
  );
}
