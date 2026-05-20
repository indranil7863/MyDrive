import { useState } from 'react';
import './productCard.css'
import CheckOutCard from './CheckOutCard';


function ProductCard({ plan, storage, actualprice, disprice, description }) {
  const discount = (actualprice - disprice);
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className='product-card'>
        <div className='product-price'>
          <p className='storage'>{plan} ({storage} GB)</p>
          <p className='price'><span className='actual'>₹{actualprice}</span> <span>₹{disprice}</span></p>
          <p className='duration'>{description}</p>
          <p className='offer'>save upto ₹{discount} with offer</p>
        </div>
        <div className='product-purchase'>
          <button onClick={() => setOpen(true)}>Purchase</button>
          <p><span>✓</span>{storage}GB total storage for you</p>
        </div>
      </div>
      {
        open && <CheckOutCard open={open} setOpen={setOpen} plandetails={{ plan, description, disprice }} />
      }
    </>
  )
}

export default ProductCard