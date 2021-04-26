import React, { useEffect } from "react";
import "./productCard.css";
import { Link } from "react-router-dom";
import image1 from "../../assets/image1.jpg";
import FavoriteBtn from '../FavoriteBtn'

function Product({ product }) {
    product.quantity = 1;

    return (
        <div className="card-grid" key={product.id}>
            <div className="img-content">
                <img src={image1} alt={product.title} />
                <Link to={`/detailsProducts/${product.codigo}`}>
                    <button>Ver detalhes</button>
                </Link>
            </div>
            <div className="content">
                <div className="title-and-heart">
                    <h4>{product.descricao}</h4>
                    <FavoriteBtn product={product}></FavoriteBtn>
                </div>
                <div className="price">
                    {"R$ " +
                        parseFloat(product.preco).toFixed(2).replace(".", ",")}
                </div>
                <p className="discount">{product.discount}</p>
            </div>
        </div>
    );
}

export default Product;
