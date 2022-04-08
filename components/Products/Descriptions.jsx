function Descriptions({ product }) {
  return (
    <div className="mt-4 info-product">
      <h3>DESCRIÇÃO DO PRODUTO</h3>
      <p>Marca: {product.brand}</p>
      <div
        className="description"
        dangerouslySetInnerHTML={{ __html: product.short_description }}
      />
    </div>
  )
}

export default Descriptions
