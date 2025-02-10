import React from 'react'

const PopulerSkelton = () => {
    return (
        <div className='p-2 col-6'>
            <div className='d-flex p-2' style={{height : "80px" ,border :"1px solid lightgrey", borderRadius :"10px"}}>
                <div className='popimg-ske '>

                </div>
                <div className='popimg-text m-2'>
                  <p></p>
                  <p></p>
                  <p></p>
                </div>
            </div>
        </div>
    )
}

export default PopulerSkelton