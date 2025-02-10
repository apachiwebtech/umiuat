import React, { useState, useEffect, version } from "react";

import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import axios from "axios";
import image1 from "../../../Images/boy.png";
import { BASE_URL, IMAGE_URL, VERSION } from "../../Utils/BaseUrl";
import ReactPlayer from "react-player";
import { Link } from "react-router-dom";
import Bannerskelton from "../skelton/Bannerskelton";
// import { Browser } from '@capacitor/browser';

const CACHE_KEY = 'banner_data'; // Key for localStorage caching
const CACHE_EXPIRY_MS = 1000 * 60 * 15; // Cache expiry time (15 minutes)

const Banner = () => {

  const [banner, setBanner] = useState([]);
  const [loading, setLoading] = useState(true);
 
  function handleLoad() {
    // setLoading(false);
  }


  const responsive = {
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 1,
      slidesToSlide: 1, // optional, default to 1.
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
      slidesToSlide: 1, // optional, default to 1.
    },
  };

  const getBannerImage = async () => {

    const data = {
      locid: localStorage.getItem('locid'),
      version : VERSION
    }
    const response = await axios.post(`${BASE_URL}/banner`, data);

    setBanner(response.data);
    // Cache data in localStorage
    localStorage.setItem(CACHE_KEY, JSON.stringify({
      data: response.data,
      timestamp: Date.now()
    }));

  };

  useEffect(() => {
    // const cachedData = localStorage.getItem(CACHE_KEY);
    // if (cachedData) {
    //   const { data, timestamp } = JSON.parse(cachedData);
    //   // Check if cache is expired
    //   if (Date.now() - timestamp < CACHE_EXPIRY_MS) {
    //     setBanner(data);
    //   } else {
    //     getBannerImage(); // Fetch new data if cache is expired

    //   }
    // } else {
    //   getBannerImage(); // Fetch data if not cached
    // }
    
    getBannerImage(); // Fetch data if not cached

    // getBannerImage();
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);

  const checkExtension = (file) => {
    return file.split(".").pop().toLowerCase();
  };


  return (
    <div  className="Banner-Head" >
      <Carousel
        infinite={true}
        responsive={responsive}
        arrows={false}
        showDots={true}
        autoPlay={true}

      >

        {banner.map((item) => {


          let extent = checkExtension(item.upload_image);
          // console.log(extent);
          if (extent === "jpeg" || extent === "png" || extent === "jpg" || extent === "webp" || extent === "svg") {

            return (
              <div >
                {item.external_type === 1 ? <Link to={item.link} className="card banner-card" key={item.id}>
                  <img src={`${IMAGE_URL}/banner/${item.upload_image}`} alt="" />
                  {/* <img src={`${item.upload_image}`} alt="" /> */}
                </Link> : <Link to={`/vendorpage/${item.vendor}`} className="card banner-card" key={item.id}>
                  <img onLoad={() => handleLoad()} src={`${IMAGE_URL}/banner/${item.upload_image}`} alt="" style={{ display: loading ? 'none' : 'block' }} />
                  {/* <img src={`${item.upload_image}`} alt="" /> */}
                </Link>}




              </div>

            );

          } else {
            return (
              <>
                {item.external_type === 1 ?
                  <Link to={item.link} className="card banner-card" key={item.id} >

                    <ReactPlayer
                      width="100%"
                      height="200px"
                      url={`${IMAGE_URL}/banner/${item.upload_image}`}
                      playing={true}
                      loop={true}
                      controls={false}
                    />

                  </Link> : <Link to={`/vendorpage/${item.vendor}`} className="card banner-card" key={item.id} >

                    <ReactPlayer
                      width="100%"
                      height="200px"
                      url={`${IMAGE_URL}/banner/${item.upload_image}`}
                      playing={true}
                      loop={true}
                      controls={false}
                    />

                  </Link>}
              </>
            )
          }
        })}
      </Carousel>

      {loading ? <Bannerskelton /> : null}
    </div>
  );
};

export default Banner;
