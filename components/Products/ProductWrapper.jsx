import Images from './Images'
import Content from './Content'
import Descriptions from './Descriptions'
import ProductContextProvider from '../../contexts/ProductContextProvider'

function ProductWrapper({ product }) {
  return (
    <div className="details-wrapper">
      <ProductContextProvider product={product}>
        <div className="flex flex-col">
          <Images />
          <div className="hidden ml-20 md:flex">
            <Descriptions product={product} />
          </div>
        </div>
        <Content product={product} />
      </ProductContextProvider>
    </div>
  )
}

export default ProductWrapper
