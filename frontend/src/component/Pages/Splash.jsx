import React from 'react';
import videoSrc from '../../Images/Umigif.gif'; // Path to your video

const Splash = () => {
    return (
        <div 
            className='splash-main' 
            style={{
                position: "fixed", 
                zIndex: 200, 
                top: 0, 
                left: 0, 
                right: 0, 
                bottom: 0, 
                backgroundColor: 'rgba(0, 0, 0, 0.5)', // Example background color (semi-transparent black)
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                overflow: 'hidden'
            }}
        >
     

            <div className='text-center' style={{ zIndex: 10 }}>
                {/* Your text or any other content */}
                <img className='splash_img' src={videoSrc} alt='' /> {/* Replace with actual text or image */}
            </div>
        </div>
    );
};

export default Splash;
