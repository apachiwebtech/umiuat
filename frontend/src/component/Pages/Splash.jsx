import React from 'react';
import videoSrc from '../../Images/loader.mp4'; // Path to your video

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
            {/* Video for the loader */}
            <video 
                src={videoSrc} 
                autoPlay 
                loop 
                muted 
                style={{
                    position: 'absolute',  // Position video behind the content
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'cover' // Make the video cover the entire container without distortion
                }} 
            />
            
            <div className='text-center' style={{ zIndex: 10 }}>
                {/* Your text or any other content */}
                <img className='splash-text' src={videoSrc} alt='' /> {/* Replace with actual text or image */}
            </div>
        </div>
    );
};

export default Splash;
