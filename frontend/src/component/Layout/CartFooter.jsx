import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const CartFooter = () => {
    const [count, setCount] = useState(0)


    return (
        <div className='row justify-content-center cart-footer p-2 '>

            {/* <div className=' d-flex align-items-center col-md-3 col-3 '>
                <button onClick={() => {

                    if (count > 0) {
                        setCount(count - 1)
                    }

                }} className='minus'>
                    -
                </button>
                <input value={count} className='text' disabled />
                <button onClick={() => setCount(count + 1)} className='plus'>
                    +
                </button>
            </div> */}

            <div className='col-md-9 col-9 text-center'>
               <Link to="/cart"> <button>View Cart</button></Link>
            </div>
        </div>
    )
}

export default CartFooter