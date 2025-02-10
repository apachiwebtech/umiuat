import React from 'react'

const CartSkelton = () => {
  return (
    <div>
        <div className='border d-flex' style={{borderRadius:"10px"}}>
           <div className='cart-card'>

           </div>
           <div className='cart-text m-2'>
               <p></p>
               <p></p>
           </div>
        </div>
        <div className='border d-flex mt-2' style={{borderRadius:"10px"}}>
           <div className='cart-card'>

           </div>
           <div className='cart-text m-2'>
               <p></p>
               <p></p>
           </div>
        </div>

        <div className='coupon-ske'>
             <p></p>
        </div>
    </div>
  )
}

export default CartSkelton