import React, { useEffect, useRef, useState } from 'react'
import InnerHeader from '../Layout/InnerHeader'
import { Avatar, TextField } from '@mui/material'
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL, IMAGE_URL } from '../Utils/BaseUrl';
import offer from '../../Images/offer.png'
import Footer from '../Layout/Footer';
import { useDispatch, useSelector } from 'react-redux'
import PopulerSkelton from './skelton/PopulerSkelton';
import ListSkeleton from './skelton/ListSkelton';

function OfferPage() {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true);
    const offerCodeRef = useRef(null);

    // const copyCode = () => {
    //     const offerCode = offerCodeRef.current.value;
    //     navigator.clipboard.writeText(offerCode).then(() => {
    //         alert(`Copied the code: ${offerCode}`);
    //     }).catch(err => {
    //         console.error('Could not copy the code: ', err);
    //     });
    // };

    const Navigate = useNavigate()

    const count = useSelector((state) => state.cartCount.cartcount);

    const applycode = (code, price) => {
        if (count > 0) {
            localStorage.setItem('CopyCoupon', code)
            Navigate('/cart')
        } else {
            alert("Please add items")
        }
    }

    async function getofferdata() {
        const data = {
            company_id: localStorage.getItem('companyid')
        }
        axios.post(`${BASE_URL}/getofferdata`, data)
            .then((res) => {
                console.log(res)
                setData(res.data)
                setTimeout(() => {
                    setLoading(false)
                }, 500);
            })
    }

    useEffect(() => {
        getofferdata()
    }, [])

    return (
        <div className='profilepage'>

            <InnerHeader />

            <div>

                {loading ? <div className='p-3'>

                    <ListSkeleton />
                </div> : null}

                {data.map((item) => {
                    return (
                        <div className='bg-secondary-subtle px-1 pb-1 my-2'>
                            <div className='row bg-light align-items-center border m-1 p-2 rounded ' style={{ display: loading ? "none" : "flex" }}>
                                <div className='row'>
                                    <div className='col-md-9 col-9 d-flex'>
                                        <div style={{ width: "120px" }} className='px-2'>
                                            <img src={`${IMAGE_URL}/coupon/` + item.coupon_code_img} className='rounded' style={{ width: "100%" }} alt="" />
                                        </div>
                                        <div>
                                            <div>
                                                <input value={item.title}  style={{ fontSize: "14px", width: "60%", border: "none", fontWeight: "900" }} disabled />
                                            </div>
                                            <div>
                                                <span style={{fontSize : "12px"}}>Use Code</span>
                                                <input value={item.couponCode} ref={offerCodeRef} style={{ fontSize: "14px", marginLeft: "2px", width: "60%", border: "none", fontWeight: "900" }} disabled />
                                            </div>
                                        </div>

                                    </div>
                                    <div className='col-md-3 col-3 '>
                                        <button className='copy-btn rounded' onClick={() => applycode(item.couponCode, item.price)}>Apply </button>
                                    </div>
                                </div>

                                <div className='mt-2 ' style={{ borderTop :"1px dotted black"}}>
                                    <p className='pt-2' style={{ color: "lightslategray", overflow: "hidden", whiteSpace: "wrap" ,fontSize :"14px" }}>{item.description}</p>
                                </div>
                            </div>
                        </div>
                    )
                })}

            </div>

            <Footer />
        </div>
    )
}

export default OfferPage