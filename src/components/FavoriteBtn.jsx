import { useDispatch, useSelector } from "react-redux";

import { HeartTwoTone } from "@ant-design/icons";
import { Tooltip } from "antd";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
// import {
//     addToFavorites,
//     setFavorite,
//     removeFromFavorites,
//     clearFavoritesProd,
// } from "../actions/products";

// import { getFavoritesProd } from "../selectors/products";

// import { useHistory } from "react-router-dom";

export default ({product}) => {

    // const history = useHistory();
    const dispatch = useDispatch();

    // const productsFavorites = useSelector(getFavoritesProd);

    
    const authorized = sessionStorage.getItem("authorized");
    const MySwal = withReactContent(Swal);

    const toggleFavorites = () => {
        const existingProductInFavorites = productsFavorites.find(
            (prod) => prod.id === product.id
        );

        if (authorized) {
            if (existingProductInFavorites) {
                dispatch(
                    setFavorite({
                        favorite: false,
                        id: existingProductInFavorites.id,
                    })
                );
                dispatch(removeFromFavorites(existingProductInFavorites.id));
            } else {
                dispatch(setFavorite({ favorite: true, id: product.id }));
                dispatch(addToFavorites(product.id));
            }
        } else {
            MySwal.fire({
                title: <p>Para favoritar um produto é necessário se logar.</p>,
                confirmButtonText: "Entrar",
                cancelButtonText: "Cancelar",
                showCancelButton: true,
            }).then((res) => {
                if (res.isConfirmed) {
                    history.push("/login");
                }
            });
        }
    };

    return (
        <Tooltip
            placement="bottom"
            title={
                product.favorite
                    ? "Remover dos favoritos"
                    : "Adicionar aos favoritos"
            }
        >
            <HeartTwoTone
                className="heart"
                twoToneColor={product.favorite ? "#ff0000" : "#0080A8"}
                onClick={toggleFavorites}
            />
        </Tooltip>
    );
};
