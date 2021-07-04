import Link from "next/link";
import FavoriteBtn from "../FavoriteBtn";

function Product({ product }) {
  const test = product.variations.length > 0 ? product.variations[0] : [];

  const testImage = JSON.parse(test.image);
  const image = testImage.length > 0 ? testImage[0].link : "/image1.jpg";

  return (
    <div className="card-grid" key={product.id}>
      <div className="img-content">
        <img src={image} alt={product.title} />
        <Link href={`/produto/${product.code}`}>
          <button>Ver detalhes</button>
        </Link>
      </div>

      <div className="content">
        <div className="title-and-heart">
          <h4>{product.description}</h4>
          <FavoriteBtn product={product} />
        </div>
        <div className="price">
          {"R$ " + parseFloat(product.price).toFixed(2).replace(".", ",")}
        </div>
        <p className="discount">{product.discount}</p>
      </div>
    </div>
  );
}

export default Product;
