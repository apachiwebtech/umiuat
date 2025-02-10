import React from 'react'
import Failed from '../../Images/failed.png'
import { Link, useNavigate } from 'react-router-dom'
import Footer from '../Layout/Footer'


const PaymentFailed = () => {


    const navigate = useNavigate()

  return (
    <div className='p-5'>
    <div style={{ width: "200px", margin: "auto" }} >
        <img style={{ width: "100%" }} src={Failed} alt='' />
    </div>
    <div className='text-center py-4'>

        <h1 style={{ fontSize: "30px", color: "#FEBF10", fontWeight: "900" }}>Sorry for the inconvenience!</h1>
    </div>
    <div className='text-center py-4'>
        <p>Payment Failed</p>
   
    </div>
    <div className='text-center'>
        <Link  onClick={() =>navigate('/dash')}>Back to home</Link>
    </div>

</div>
  )
}

export default PaymentFailed