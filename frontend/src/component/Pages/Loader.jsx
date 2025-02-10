import React from 'react'

const Loader = () => {
    return (
        <div >
            <div class="spinner-border text-dark" style={{position :"absolute" , left :"47%", top:"50%",zIndex :"100000000"}} role="status">
                <span class="visually-hidden">Loading...</span>
            </div>

        </div>
    )
}

export default Loader