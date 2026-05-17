import React, { useEffect, useState } from 'react'
import ProductCard from './ProductCard'
import './services.css'


function Services() {
  const [isactive, setIsActive] = useState(1);
  return (
    <div className='container'>

      <div className='plans'>
        <button onClick={() => setIsActive(1)} style={isactive === 1 ? { backgroundColor: 'blue', color: "white" } : {}}>Monthly</button>
        <button onClick={() => setIsActive(2)} style={isactive === 2 ? { backgroundColor: 'blue', color: "white" } : {}}>Quarterly</button>
        <button onClick={() => setIsActive(3)} style={isactive === 3 ? { backgroundColor: 'blue', color: "white" } : {}}>Annually</button>
      </div>
      {
        isactive === 1 && (<div className='product-section'>
          <ProductCard plan="Lite" storage={30} actualprice={100} disprice={60} description1="for one month" />
          <ProductCard plan="Basic" storage={100} actualprice={150} disprice={110} description1="for one month" />
          <ProductCard plan="Standard" storage={200} actualprice={230} disprice={200} description1="for one month" />
        </div>)

      }
      {
        isactive === 2 && (
          <div className='product-section'>
            <ProductCard plan="Lite" storage={30} actualprice={500} disprice={480} description1="for one month" />
            <ProductCard plan="Basic" storage={100} actualprice={1400} disprice={1350} description1="for one month" />
            <ProductCard plan="Standard" storage={200} actualprice={2000} disprice={1870} description1="for one month" />
          </div>
        )
      }
      {
        isactive === 3 && (
          <div className='product-section'>
            <ProductCard plan="Lite" storage={30} actualprice={800} disprice={680} description1="for one month" />
            <ProductCard plan="Lite" storage={100} actualprice={1800} disprice={1620} description1="for one month" />
            <ProductCard plan="Lite" storage={200} actualprice={2600} disprice={2390} description1="for one month" />
          </div>
        )
      }
    </div>
  )
}

export default Services