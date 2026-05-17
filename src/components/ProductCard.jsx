import './productCard.css'


function ProductCard({ plan, storage, actualprice, disprice, description1 }) {
  const discount = (actualprice - disprice);

  return (
    <div className='product-card'>
      <div className='product-price'>
        <p className='storage'>{plan} ({storage} GB)</p>
        <p className='price'><span className='actual'>₹{actualprice}</span> <span>₹{disprice}</span></p>
        <p className='duration'>{description1}</p>
        <p className='offer'>save upto ₹{discount} with offer</p>
      </div>
      <div className='product-purchase'>
        <button>Purchase</button>
        <p><span>✓</span>{storage}GB total storage for you</p>
      </div>
    </div>
  )
}

export default ProductCard