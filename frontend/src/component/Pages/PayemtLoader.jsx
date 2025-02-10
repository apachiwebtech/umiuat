import React from 'react'

const PaymentLoader = () => {
    return (
        <div style={{ height: "100vh", background: "#fff", position: "fixed", width: "100%", zIndex: "10000000000000" ,top:"0px" }} >
            {/* <div class="spinner-border text-dark" style={{ position: "absolute", left: "47%", top: "50%", zIndex: "100000000" }} role="status"> */}
                <div class="container" >
                    <div class="dash uno"></div>
                    <div class="dash dos"></div>
                    <div class="dash tres"></div>
                    <div class="dash cuatro"></div>
                </div>

                <p className='verify'>Payment verifying... </p>
                <p className='verify-2' style={{background:"lightgrey"}}> Don't close the app</p>
            {/* </div> */}

        </div>
    )
}

export default PaymentLoader;