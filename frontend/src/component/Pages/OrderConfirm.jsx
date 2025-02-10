import React from 'react'
import boy from '../../Images/boy.png'
import { Link } from 'react-router-dom'
const OrderConfirm = () => {

    const Finalamt = localStorage.getItem('finalamt')
    return (

        <div className='p-5'>
            <div style={{ width: "200px", margin: "auto" }} >
                <img style={{ width: "100%" }} src={boy} alt='' />
            </div>
            <div className='text-center'>

                <h1 style={{ fontSize: "30px", color: "#FEBF10", fontWeight: "900" }}>Thanks For OrderRing With Us!</h1>
            </div>
            <div className='text-center py-5'>
                <p>Payment Confirmed</p>
                <p>₹ {Finalamt}</p>
            </div>
            <div className='text-center'>
                <Link to="/dash">Back to home</Link>
            </div>
        </div>
        
    )
}

export default OrderConfirm