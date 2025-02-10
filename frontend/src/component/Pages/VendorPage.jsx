import SearchIcon from '@mui/icons-material/Search';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import nonveg from '../../Images/Non.png';
import veg from '../../Images/veg.png';
import CartFooter from '../Layout/CartFooter';
import { BASE_URL, IMAGE_URL } from '../Utils/BaseUrl';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import Loader2 from './Loader2';
import Footer from '../Layout/Footer';
import { useDispatch } from 'react-redux';
import { getCartCount } from '../store/CartProvider';
import ListSkelton from './skelton/ListSkelton';
import HeaderSkelton from './skelton/HeaderSkelton';
import Notimg from '../../Images/Not.png'
import DiscountIcon from '@mui/icons-material/Discount';

const VendorPage = () => {
    const [click, setclick] = useState('')
    const [toggle, settoggle] = useState(false);
    const [data, setData] = useState([])
    const [search, setSearch] = useState('')
    const [loading, setLoading] = useState(true);
    const [company, setCompany] = useState('')
    const [address, setaddress] = useState('')
    const [loader2, setLoader2] = useState(true)
    const [imgload , setImgLoad] = useState(true)
    const [logo, setlogo] = useState('')
    const dispatch = useDispatch()
    const handleclick = (e) => {
        
        settoggle(!toggle)
        settoggle2(false);
        if (!toggle) {
            setclick(e.target.value)
            localStorage.setItem('foodcat' , e.target.value)
        } else {
            setclick('')
            localStorage.setItem('foodcat' , '')
        }
    }


    const handleclick3 = (e) => {
        
        
        settoggle(false)
        settoggle2(!toggle2);
        setclick(e.target.value)
        
        if (!toggle2) {
            setclick(e.target.value)
            localStorage.setItem('foodcat' , e.target.value)
        } else {
            setclick('')
            localStorage.setItem('foodcat' , '')
        }
    }

    const [detail, setdetail] = useState([])
    const [open, setOpen] = useState(false)
    const handleclick2 = (id) => {
        setOpen(true)

        axios.post(`${BASE_URL}/detail_product`, { proid: id })
            .then((res) => {
                setdetail(res.data[0])
            })

    }
    const [toggle2, settoggle2] = useState(false);

    const handleclose = () => {
        setOpen(false)
        setdetail([])
    }
    const { vendid } = useParams()


    async function getcatlisting() {
        axios.post(`${BASE_URL}/getvendorlisting`, { vendid: vendid })
            .then((res) => {
                if (res.data) {
                    setLoader2(false)
                }
                if (res.data.length > 0) {
                    setData(res.data)
                    setCompany(res.data[0].company_name)
                    setaddress(res.data[0].city)
                    setlogo(res.data[0].logo)

                    setTimeout(() => {
                        setLoading(false)
                        setImgLoad(false)
                    }, 500);
                }

            })
    }

    useEffect(() => {
        getcatlisting()

        setclick(localStorage.getItem('foodcat'))

        if(localStorage.getItem('foodcat') == '1' ){
          settoggle(!toggle)
          settoggle2(false);
        } else if(localStorage.getItem('foodcat') == '2' ){
            settoggle(false)
            settoggle2(!toggle2);
          }
          if(localStorage.getItem('foodcat') == ''){
            settoggle(false)
          }
    }, [vendid])


    const [itemCounts, setItemCounts] = useState({});

    // Function to handle item count changes
    const handleItemCountChange = (itemId, newCount) => {
        setItemCounts(prevCounts => ({
            ...prevCounts,
            [itemId]: newCount
        }));
    };

    const navigate = useNavigate()


    return (
        <div style={{ paddingBottom: "90px" }}>
            {loader2 && <Loader2 />}
            <div className='menu-header p-3 ' style={{ position: "relative" }}>
                {/* <p className=''><span className='p-1 '>4.5 ⭐</span></p> */}

                {logo == "" ? <h2 style={{display : imgload ? "none" : "block"}}>{company}</h2> :     <div style={{ width: "100%", display: "flex", alignItems: 'center' }}>
                    <img onLoad={() =>{
                        setImgLoad(false)
                    }} style={{ width: "100px", margin: "auto" }} src={`${IMAGE_URL}/vendorlogo/${logo}`} alt="" />
                </div>}

                {imgload ?   <div style={{textAlign :"center"}}>
                   <HeaderSkelton style={{ margin: 'auto' }} />
                </div> :null }
             
            
                
                {/* <span className='p-3'>FAST FOOD</span> */}
                <h5 className='pt-2' style={{display : imgload ? "none" : "block"}}>{address}</h5>
                <div className="backbtn" onClick={() => navigate(-1)}>

                    <ArrowBackIosIcon />                </div>
            </div>
            <div className='row p-3 menu-search'>
             

                <div className='col-md-7 col-7 position-relative'>
                    <input onChange={(e) => setSearch(e.target.value)} className="border-yellow p-1 w-100" type='search' placeholder='Search (eg. Pav Bhaji)' />
                    <SearchIcon sx={{ color: "lightgray" }} className='search-icon' />
                </div>
                <div className='col-md-5 col-5 row dash-search align-items-center' >

                    <div className='col-md-6 col-6 text-center px-1 '>
                        <button style={{ color: "green" }} value='1' onClick={(e) => handleclick(e)} className={toggle === false ? "border-yellow p-1 w-100 " : "border-yellow p-1 back-yellow w-100"}><img style={{ width: "10px", paddingRight: "1px" }} src={veg} alt='' />VEG</button>

                    </div>
                    <div className='col-md-6 col-6 text-center'>
                        <button type='button' name='' style={{ color: "red" }} value='2' onClick={(e) => handleclick3(e)} className={toggle2 === false ? "border-yellow  p-1 w-100" : "border-yellow p-1  back-yellow w-100"} ><img style={{ width: "10px", paddingRight: "1px" }} src={nonveg} alt='' />NON VEG</button>
                    </div>
                </div>


            </div>

            <div className='menu-items p-3'>

                    {loading ?    <ListSkelton /> :null}
                <div className='menu-pro-card' style={{display : loading ? "none" : "block"}}>

                    {data.length == 0 && <h2>Not available...</h2>}
                    {data.filter((item) => (item.type).includes(click)).filter((item) => (item.title.toLowerCase()).includes(search.toLocaleLowerCase())).map((item) => {
                        return (
                            <div className='row p-1 border rounded-3 my-1' >
                                <div className='col-4 col-md-4 '>
                                    <div className='position-relative rounded pro-img d-flex'>
                                        <img onClick={() => handleclick2(item.id)} className='rounded' src={item.upload_image !== '' ? `${ IMAGE_URL}/product/` + item.upload_image : Notimg} alt='' />
                                        {/* <h3>Upto 30% Off</h3> */}
                                    </div>
                                </div>

                                <div className='col-8 col-md-8 pro-description position-relative'>
                                    <h2 onClick={() => handleclick2(item.id)}>{item.title}</h2>
                                    <p onClick={() => handleclick2(item.id)}>{item.company_name}</p>

                                    {item.type == "1" ? <img className='veg-icon' src={veg} alt='' /> : <img className='veg-icon' src={nonveg} alt='' />}

                                    {/* <p className='disc'>
                                    {item.description}
                                </p> */}
                                    <p className='disc py-1'>
                                        {/*  {item.type == "2" ? "Contain Eggs" : ""}<span className='text-danger'>*</span>*/}
                                    </p>
                                    <div className='d-flex justify-content-between align-items-center'>
                                        <h2>Rs.{Number(item.price) + Number(item.discount_price)}/-</h2>

                                        <div className='menu-add-remmove d-flex align-items-center '>
                                            <button onClick={() => {

                                                const newCount = itemCounts[item.id] ? itemCounts[item.id] - 1 : 0;
                                                handleItemCountChange(item.id, newCount)

                                                const cpercentage = (Number(item.cgst) + 100) / 100
                                                const newCgst = Number(item.price) / cpercentage
                                                const FCgst = Number(item.price) - newCgst

                                                const spercentage = (Number(item.sgst) + 100) / 100
                                                const newSgst = Number(item.price) / spercentage
                                                const FSgst = Number(item.price) - newSgst

                                                const data = {
                                                    cat_id: item.cat_id,
                                                    pro_id: item.id,
                                                    pro_name: item.title,
                                                    price: item.price,
                                                    p_qty: newCount,
                                                    orderid: localStorage.getItem("orderid"),
                                                    userId: localStorage.getItem("food_id"),
                                                    v_id: item.v_id,
                                                    hsnno: item.hsnno,
                                                    cgst: item.cgst,
                                                    sgst: item.sgst,
                                                    cgstamt: FCgst,
                                                    sgstamt: FSgst
                                                };

                                                axios.post(`${BASE_URL}/addToCart`, data)
                                                    .then((res) => {
                                                        if (res.data[0] && res.data[0].orderid) {
                                                            localStorage.setItem("orderid", res.data[0].orderid);
                                                        }
                                                        dispatch(getCartCount())
                                                    });

                                            }} className='minus'>
                                                -
                                            </button>
                                            <input value={itemCounts[item.id] || 0} className='text' disabled />
                                            <button onClick={() => {
                                                const newCount = (itemCounts[item.id] || 0) + 1;
                                                handleItemCountChange(item.id, newCount);

                                                const cpercentage = (Number(item.cgst) + 100) / 100
                                                const newCgst = Number(item.price) / cpercentage
                                                const FCgst = Number(item.price) - newCgst

                                                const spercentage = (Number(item.sgst) + 100) / 100
                                                const newSgst = Number(item.price) / spercentage
                                                const FSgst = Number(item.price) - newSgst



                                                const data = {
                                                    cat_id: item.cat_id,
                                                    pro_id: item.id,
                                                    pro_name: item.title,
                                                    price: item.price,
                                                    p_qty: newCount,
                                                    orderid: localStorage.getItem("orderid"),
                                                    userId: localStorage.getItem("food_id"),
                                                    v_id: item.v_id,
                                                    hsnno: item.hsnno,
                                                    cgst: item.cgst,
                                                    sgst: item.sgst,
                                                    cgstamt: FCgst,
                                                    sgstamt: FSgst
                                                };

                                                axios.post(`${BASE_URL}/addToCart`, data)
                                                    .then((res) => {
                                                        if (res.data[0] && res.data[0].orderid) {
                                                            localStorage.setItem("orderid", res.data[0].orderid);
                                                        }
                                                        dispatch(getCartCount())
                                                    });
                                            }} className='plus'>
                                                +
                                            </button>
                                        </div>
                                    </div>
                                    {item.discount_price > 0 &&   <div className='py-2'>
                                               <span className='discount-price' style={{fontSize :"16px"}}><DiscountIcon fontSize='16px'/>Get for <span className='disc-child'>Rs. {item.price}/-</span></span>
                                            </div> }
                                </div>
                            </div>
                        )
                    })}

             
                </div>
            </div>



            {open ? <div className='overlay'></div> : null}


            <div className={open ? 'dish-details show-details positon-relative' : 'dish-details'}>
                {open ? <div className='close-btn'>
                    <button onClick={handleclose}>Close &nbsp;X</button>
                </div> : null}

                <div className='pro-detail-card m-2 p-2'>
                    <div className='detail-img d-flex justify-content-center align-items-center'>
                        <img src={detail.upload_image !== '' ? `${ IMAGE_URL}/product/` + detail.upload_image : Notimg} alt='' />

                    </div>

                    <div>
                        <div className='d-flex align-items-center pt-3 justify-content-between'>
                            <div className='d-flex align-items-center'>
                                <h2 className='mb-0'>{detail.title}</h2>
                                {detail.type == "1" ? <img className='mx-1' style={{ width: "17px", height: "17px" }} src={veg} alt='' /> : <img className='mx-1' style={{ width: "17px", height: "17px" }} src={nonveg} alt='' />}
                            </div>

                            <div className='d-flex align-items-center '>
                                <i class="ri-heart-line text-danger"></i>
                                <i class="ri-share-forward-box-fill mx-2 share-icon"></i>
                            </div>
                        </div>
                        <p>Rs.{Number(detail.price) + Number(detail.discount_price)}/-</p>
                            {detail.discount_price > 0 &&   <div className='py-2'>
                                               <span className='discount-price' style={{fontSize :"16px"}}><DiscountIcon fontSize='16px'/>Get for <span className='disc-child'>Rs. {detail.price}/-</span></span>
                                            </div> }

                        <p className='disc'>
                            {detail.description}
                        </p>

                    </div>
                </div>


            </div>

            {open ? <div className='row cart-footer p-2 '>

                <div className=' d-flex align-items-center col-md-3 col-3 '>
                    <button onClick={() => {

                        const newCount = itemCounts[detail.id] ? itemCounts[detail.id] - 1 : 0;
                        handleItemCountChange(detail.id, newCount)

                        const cpercentage = (Number(detail.cgst) + 100) / 100
                        const newCgst = Number(detail.price) / cpercentage
                        const FCgst = Number(detail.price) - newCgst

                        const spercentage = (Number(detail.sgst) + 100) / 100
                        const newSgst = Number(detail.price) / spercentage
                        const FSgst = Number(detail.price) - newSgst

                        const data = {
                            cat_id: detail.cat_id,
                            pro_id: detail.id,
                            pro_name: detail.title,
                            price: detail.price,
                            p_qty: newCount,
                            orderid: localStorage.getItem("orderid"),
                            userId: localStorage.getItem("food_id"),
                            v_id: detail.v_id,
                            hsnno: detail.hsnno,
                            cgst: detail.cgst,
                            sgst: detail.sgst,
                            cgstamt: FCgst,
                            sgstamt: FSgst
                        };

                        axios.post(`${BASE_URL}/addToCart`, data)
                            .then((res) => {
                                if (res.data[0] && res.data[0].orderid) {
                                    localStorage.setItem("orderid", res.data[0].orderid);
                                }
                                dispatch(getCartCount())
                            });

                    }} className='minus'>
                        -
                    </button>
                    <input value={itemCounts[detail.id] || 0} className='text' disabled />
                    <button onClick={() => {
                        const newCount = (itemCounts[detail.id] || 0) + 1;
                        handleItemCountChange(detail.id, newCount);


                        const cpercentage = (Number(detail.cgst) + 100) / 100
                        const newCgst = Number(detail.price) / cpercentage
                        const FCgst = Number(detail.price) - newCgst

                        const spercentage = (Number(detail.sgst) + 100) / 100
                        const newSgst = Number(detail.price) / spercentage
                        const FSgst = Number(detail.price) - newSgst

                        const data = {
                            cat_id: detail.cat_id,
                            pro_id: detail.id,
                            pro_name: detail.title,
                            price: detail.price,
                            p_qty: newCount,
                            orderid: localStorage.getItem("orderid"),
                            userId: localStorage.getItem("food_id"),
                            v_id: detail.v_id,
                            hsnno: detail.hsnno,
                            cgst: detail.cgst,
                            sgst: detail.sgst,
                            cgstamt: FCgst,
                            sgstamt: FSgst
                        };

                        axios.post(`${BASE_URL}/addToCart`, data)
                            .then((res) => {
                                if (res.data[0] && res.data[0].orderid) {
                                    localStorage.setItem("orderid", res.data[0].orderid);
                                }
                                dispatch(getCartCount())
                            });


                    }} className='plus'>
                        +
                    </button>
                </div>

                <div className='col-md-9 col-9 text-center'>
                    <Link to="/cart"> <button>View Cart</button></Link>
                </div>
            </div> : null}
            {open ? null : <Footer />}

        </div>
    )
}

export default VendorPage