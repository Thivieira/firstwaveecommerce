import Link from "next/link";
import FavoriteBtn from "../FavoriteBtn";

function Product({ product }) {
  const variationImage = product.variacoes.map(el => el.variacao)[0].imagem[0]

  const image = variationImage ? variationImage.link : "/image1.jpg"
  
  return (
    <div className="card-grid" key={product.id}>
      <div className="img-content">
        <img src={image} alt={product.title} />
        <Link href={`/produto/${product.codigo}`}>
          <button>Ver detalhes</button>
        </Link>
      </div>

      <div className="content">
        <div className="title-and-heart">
          <h4>{product.descricao}</h4>
          <FavoriteBtn product={product} />
        </div>
        <div className="price">
          {"R$ " + parseFloat(product.preco).toFixed(2).replace(".", ",")}
        </div>
        <p className="discount">{product.discount}</p>
      </div>
    </div>
  );
}

export default Product;
