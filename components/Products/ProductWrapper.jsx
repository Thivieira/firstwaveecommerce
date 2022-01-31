import Images from './Images'
import Content from './Content'
import ProductContextProvider from '../../contexts/ProductContextProvider'

const ProductWrapper = ({ product }) => {
  return (
    <div className="details-wrapper">
      <ProductContextProvider product={product}>
        <Images />
        <Content />
      </ProductContextProvider>
    </div>
  )
}

export default ProductWrapper
