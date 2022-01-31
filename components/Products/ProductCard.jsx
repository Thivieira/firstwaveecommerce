import NavLink from '../NavLink'
import FavoriteBtn from '../FavoriteBtn'
import noImage from '../../public/noimage.png'

function ProductCard({ product }) {
  const images = product.variations.map((el) => JSON.parse(el.image))
  const imagesOk = images.filter((el) => el.length !== 0)

  const imageOk = imagesOk[0].map((el) => el.link)[0]

  const image = imageOk ? imageOk : noImage.src

  const price = `R$${parseFloat(product.price).toFixed(2).replace('.', ',')}`
  const priceSale = `R$${parseFloat(product.variations[0].price).toFixed(2).replace('.', ',')}`

  const installmentPrice = (price) =>
    `R$${parseFloat(price / 6.0)
      .toFixed(2)
      .replace('.', ',')}`

  return (
    <div className="card-grid" key={product.id}>
      <div className="img-content">
        <NavLink href={`/produto/${product.code}`}>
          <img src={image} alt={product.title} />
        </NavLink>
      </div>

      <div className="content">
        <div className="title-and-heart">
          <NavLink href={`/produto/${product.code}`} passHref>
            <h4>{product.description}</h4>
          </NavLink>
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
        <p className="discount">
          {priceSale !== price ? (
            <>
              <strong>6x</strong> de{' '}
              <strong>{installmentPrice(product.variations[0].price)}</strong> sem juros no cartão.
            </>
          ) : (
            <>
              <strong>6x</strong> de <strong>{installmentPrice(product.price)}</strong> sem juros no
              cartão.
            </>
          )}
        </p>
      </div>
    </div>
  )
}

export default ProductCard
