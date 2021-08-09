import Link from "next/link";
import FavoriteBtn from "../FavoriteBtn";

function ProductCard({ product }) {
  const test = product.variations.length > 0 ? product.variations[0] : [];

  const testImage = JSON.parse(test.image);
  const image = testImage.length > 0 ? testImage[0].link : "/noimage.png";

  const price = `R$${parseFloat(product.price).toFixed(2).replace(".", ",")}`;
  const priceSale = `R$${parseFloat(product.variations[0].price)
    .toFixed(2)
    .replace(".", ",")}`;

  return (
    <div className="card-grid" key={product.id}>
      <div className="img-content">
        <img src={image} alt={product.title} />
        <Link href={`/produto/${product.code}`} passHref>
          <button>Ver detalhes</button>
        </Link>
      </div>

      <div className="content">
        <div className="title-and-heart">
          <Link href={`/produto/${product.code}`} passHref>
            <h4>{product.description}</h4>
          </Link>
          <FavoriteBtn product={product} />
        </div>
        <div className="price">
          {priceSale !== price ? (
            <>
              <div className="priceSale">
                <span>{price}</span>
                <p>{priceSale}</p>
              </div>
              <h3>PROMOÇÃO</h3>
            </>
          ) : (
            price
          )}
        </div>
        <p className="discount">{product.discount}</p>
      </div>
    </div>
  );
}

export default ProductCard;
