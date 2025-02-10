import React, { useEffect, useState, version } from 'react'

import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { Link } from 'react-router-dom';
import { BASE_URL, IMAGE_URL, VERSION } from '../../Utils/BaseUrl';
import axios from 'axios';
import Catskelton from '../skelton/Catskelton';
import { styled } from '@mui/material';
const Category = ({currentloc}) => {
    const [category, setCategory] = useState([]);
    const [loading, setLoading] = useState(true);

    
    const responsive = {
        tablet: {
            breakpoint: { max: 1024, min: 464 },
            items: 4,
            slidesToSlide: 2 // optional, default to 1.
        },
        mobile: {
            breakpoint: { max: 464, min: 0 },
            items: 5,
            slidesToSlide: 1 // optional, default to 1.
        }
    };

    const getCategory = async () => {
        const data = {
          locid : currentloc,
          version: VERSION
        }

        const response = await axios.post(`${BASE_URL}/category` ,data);
 
        setCategory(response.data);
        setTimeout(() => {
            setLoading(false);
         }, 500);
    }
    useEffect(() => {
        getCategory();
    }, [currentloc])

    return (
        <div>
            <div className='Cat-head'>
                <hr />
               {category.length > 0 &&   <p className='p0'>CATEGORY</p> }
            </div>
            <Carousel responsive={responsive} autoPlay={true} infinite={true} arrows={false} >


                {
                    category.map((item) => {
                        return (
                            <div className='text-center cat-sec  ' style={{display : loading ? "none" : "block"}}>
                                <Link to={`/menupage/${item.id}`}>
                                    <div className='circle m-auto'>
                                        <img src={`${IMAGE_URL}/category/${item.upload_image}`} alt="" />
                                    </div>
                                    <p>{item.category}</p>
                                </Link>

                            </div>
                        )
                    })
                }
            </Carousel>

           { loading ?  <Carousel responsive={responsive} autoPlay={true} infinite={true} arrows={false}>
                <Catskelton />
                <Catskelton />
                <Catskelton />
                <Catskelton />
                <Catskelton />
                <Catskelton />
            </Carousel> : null}

        </div>
    )
}

export default Category