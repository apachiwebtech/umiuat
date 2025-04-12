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
    const locid = localStorage.getItem('locid');
    const vendorId = localStorage.getItem('VendorId');
    const comid = localStorage.getItem('companyid');
  
    const data = {
      locid,
      vendorId,
      comid,
      version: VERSION,
    };
  
    const response = await axios.post(`${BASE_URL}/banner`, data);
  
    const banners = response.data || [];
  
    const orBanners = banners.filter(banner => banner.add_type === 'OR');
  
    const andBanners = banners.filter(banner => {
      const isCompanyMatch = banner.company_id === comid;
      const isVendorMatch = banner.vendor === vendorId;
      const isLocationMatch = banner.location === locid;
  
      return (
        (banner.location === '' && isVendorMatch && isCompanyMatch) ||
        (banner.vendor === '' && isLocationMatch && isCompanyMatch) ||
        (isVendorMatch && isLocationMatch) 
      );
    });
  
    // Merge both sets and avoid duplicates (optional)
    const allBanners = [...orBanners, ...andBanners];
  
    // Remove duplicates if needed (based on unique id or some key)
    const uniqueBanners = Array.from(
      new Map(allBanners.map(b => [b.id, b])).values() // assuming `id` is unique
    );
  
    setBanner(uniqueBanners);
  };
  
  
  

  useEffect(() => {

    getBannerImage(); // Fetch data if not cached

    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);

  const checkExtension = (file) => {
    return file.split(".").pop().toLowerCase();
  };


  return (
    <div className="Banner-Head" >
      <Carousel
        infinite={true}
        responsive={responsive}
        arrows={false}
        showDots={true}
        autoPlay={true}
        autoPlaySpeed={5000} // 5 seconds
      >

        {banner.map((item) => {


          let extent = checkExtension(item.upload_image);
          // console.log(extent);
          if (extent === "jpeg" || extent === "png" || extent === "jpg" || extent === "webp" || extent === "svg") {

            return (
              <div >



                {item.external_type === 1 ? <Link to={item.link} className="card banner-card" key={item.id}>
                  <img src={`${IMAGE_URL}/banner/${item.upload_image}`} alt="" />
                </Link> : <Link to={`/vendorpage/${item.vendor}`} className="card banner-card" key={item.id}>
                  <img onLoad={() => handleLoad()} src={`${IMAGE_URL}/banner/${item.upload_image}`} alt="" style={{ display: loading ? 'none' : 'block' }} />
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
