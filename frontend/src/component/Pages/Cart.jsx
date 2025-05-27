import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Modal from '@mui/material/Modal'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import axios from 'axios'
import { Checkout } from 'capacitor-razorpay'
import React, { useEffect, useState, version } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import nonveg from '../../Images/Non.png'
import ecart from '../../Images/empty-cart.webp'
import veg from '../../Images/veg.png'
import { BASE_URL, IMAGE_URL, VERSION } from '../Utils/BaseUrl'
import Loader from './Loader'
import Loader2 from './Loader2'
import CancelIcon from '@mui/icons-material/Cancel';
import home from '../../Images/icon/Vector.png';
import { useDispatch, useSelector } from 'react-redux';
import { getCartCount } from '../store/CartProvider';
import CartSkelton from './skelton/CartSkelton'
import Calculation from './skelton/Calculation'
import Notimg from '../../Images/Not.png'
// import logo from '../../Images/umi_red.png'
import logo from '../../Images/LOG.jpg'
import PaymentLoader from './PayemtLoader'
import { Alert } from '@mui/material'
import offer from '../../Images/icon/Group 2 (1).png'
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const Cart = () => {

    const [data, setData] = useState([])
    const [loader, setLoader] = useState(false)
    const [loader2, setLoader2] = useState(true)
    const [quantities, setQuantities] = useState({});
    const [loading, setLoading] = useState(true);
    const [product, setProduct] = useState([])
    const [gst, setGst] = useState([])
    const [calloading, setCalLoading] = useState(true);
    const [cerr, setCERR] = useState('')
    const [discount, setDiscount] = useState([])
    const [hide, setHide] = useState(false)
    const [code, setCode] = useState(localStorage.getItem('CopyCoupon'))
    const [open, setOpen] = React.useState(false);
    const [mobile, setMobile] = useState(localStorage.getItem('food_mobile'));
    const dispatch = useDispatch()
    const [payloader, setPayloader] = useState(false)
    const count = useSelector((state) => state.cartCount.cartcount);

    const handleOpen = () => {
        getMobile();
        setOpen(true)
    };
    const handleClose = () => setOpen(false);

    const name = localStorage.getItem("Name")

    const navigate = useNavigate()



    const [number, setNUmber] = useState({
        number: "",
    })

    const [numberError, setNumberError] = useState(false);
    const [numberErrortext, setNUmberErrorText] = useState('');
    const onNumberchange = (e) => {
        const { name, value } = e.target;

        setNUmber(prevState => ({
            ...prevState,
            [name]: value,
        }))
        setNumberError(false);
        setNUmberErrorText('');
    }




    const paymentHandler = async (e) => {

        const lastamt = discount ? totalPrice - discount : totalPrice

        if (lastamt > 0) {

            setLoader(true)

            localStorage.setItem('finalamt', discount ? totalPrice - discount : totalPrice)

            setTimeout(() => {

            }, 1000);


            const orderdata = {
                locationid: localStorage.getItem(`lastloc`),
                firstname: localStorage.getItem(`Name`),
                order_id: localStorage.getItem(`orderid`),
                mobile: localStorage.getItem(`food_mobile`),
                email: localStorage.getItem(`food_email`),
                totalPrice: discount ? totalPrice - discount : totalPrice,
                v_id: vendor_id
            }

            axios.post(`${BASE_URL}/orderadd`, orderdata)
                .then((res) => {
                    getcalculation(localStorage.getItem('Coupon'))

                })

            const data = {
                amount: (totalPrice - discount) * 100,
                currency: "INR",

            }
            const response = await axios.post(`${BASE_URL}/order`, data)

            const order = await response.data;



            if (response.data) {
                setLoader(false)
                const data = {
                    razor_order_id: response.data.id,
                    order_id: localStorage.getItem(`orderid`),
                    price: discount ? totalPrice - discount : totalPrice


                }

                axios.post(`${BASE_URL}/update_order_id`, data)
                    .then((res) => {
                        console.log(res.data)
                    })

            }

            const options = {
                "key": "rzp_live_Hq27Hd3Q43EKV3", // Enter the Key ID generated from the Dashboard
                "amount": order.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
                "currency": order.currency,
                "name": "UMI", //your business name
                "description": "NONE",
                "image": 'https://viggorventures.com/weblogin/img/LOG.jpg',
                "order_id": order.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
                "prefill": { //We recommend using the prefill parameter to auto-fill customer's contact information, especially their phone number
                    "name": localStorage.getItem('Name'), //your customer's name
                    "email": localStorage.getItem('food_email'),
                    "contact": localStorage.getItem('food_mobile')  //Provide the customer's phone number for better conversion rates 
                },
                "notes": {
                    "address": "UMI OFFICE"
                },
                "theme": {
                    "color": "#febf10"
                }
            };

            try {


                let data = (await Checkout.open(options));
                e.preventDefault()


                const razorpay_order_id = (data.response.razorpay_order_id);
                const razorpay_payment_id = (data.response.razorpay_payment_id);
                const razorpay_signature = (data.response.razorpay_signature);

                localStorage.setItem('razorpay_order_id', razorpay_order_id)
                localStorage.setItem('razorpay_payment_id', razorpay_payment_id)
                localStorage.setItem('razorpay_signature', razorpay_signature)


                const paydata = {
                    razorpay_payment_id: razorpay_payment_id,
                    razorpay_order_id: razorpay_order_id,
                    razorpay_signature: razorpay_signature,
                    order_id: localStorage.getItem(`orderid`),
                    transactionamt: discount ? totalPrice - discount : totalPrice,
                }

                axios.post(`${BASE_URL}/payment_verify`, paydata)
                    .then((res) => {

                        setPayloader(true)

                        const status = res.data.pstatus

                        if (status == 1) {

                            const orderadddata = {
                                razorpay_payment_id: localStorage.getItem('razorpay_payment_id'),
                                razorpay_order_id: localStorage.getItem('razorpay_order_id'),
                                razorpay_signature: localStorage.getItem('razorpay_signature'),
                                transactionamt: discount ? totalPrice - discount : totalPrice,
                                order_id: localStorage.getItem(`orderid`)
                            }

                            axios.post(`${BASE_URL}/ordercomplete`, orderadddata)
                                .then((res) => {

                                    const status = res.data.status;

                                    if (status == 1) {
                                        // getcalculation(localStorage.getItem('Coupon'))
                                        localStorage.removeItem(`orderid`)
                                        localStorage.removeItem(`Coupon`)
                                        localStorage.removeItem(`razorpay_payment_id`)
                                        localStorage.removeItem(`razorpay_order_id`)
                                        localStorage.removeItem(`razorpay_signature`)
                                        localStorage.removeItem('Couponcode');
                                        localStorage.removeItem('Coupon');
                                        localStorage.removeItem('Discper')
                                        localStorage.removeItem('minamt')

                                        setTimeout(() => {
                                            setPayloader(false)
                                            navigate(`/orderconfirm`)

                                        }, 1000);

                                    } else {

                                        setPayloader(false)

                                        localStorage.removeItem(`razorpay_payment_id`)
                                        localStorage.removeItem(`razorpay_order_id`)
                                        localStorage.removeItem(`razorpay_signature`)
                                        alert("Payment completed but order failed")
                                    }


                                })




                        } else {
                            // alert("Payment Failed")
                            localStorage.removeItem(`razorpay_payment_id`)
                            localStorage.removeItem(`razorpay_order_id`)
                            localStorage.removeItem(`razorpay_signature`)
                            navigate(`/failed`)


                        }
                    })




            } catch (error) {
                if (error.code === "checkout.window.dismiss") {
                    // User closed the payment gateway without completing the payment
                    console.log("Payment cancelled by user");

                }
                //it's paramount that you parse the data into a JSONObject
                // let errorObj = JSON.parse(error['code'])
                console.log(error);
            }

        } else {
            alert("Please add some items")
        }






    }






    async function getcartdata() {

        const data = {
            order_id: localStorage.getItem("orderid"),
            version: VERSION
        }
        axios.post(`${BASE_URL}/getcartData`, data)
            .then((res) => {

                if (res.data) {
                    setProduct(res.data)

                    setTimeout(() => {
                        setLoading(false)
                    }, 500);


                    dispatch(getCartCount())
                }


            })

        setTimeout(() => {

            getcalculation(localStorage.getItem('Coupon'))
        }, 500);
    }

    const vendor_id = product.map((item) => item.v_id)

    useEffect(() => {

        if (localStorage.getItem("orderid")) {
            getcartdata()
        }
        if (!localStorage.getItem("orderid")) {
            setTimeout(() => {
                setLoading(false)
            }, 500);
        }

        setTimeout(() => {
            setLoader2(false)
        }, 500);

    }, [])

    const getMobile = async () => {
        const user_id = localStorage.getItem('food_id')

        axios.post(`${BASE_URL}/getMobile`, { user_id: user_id })
            .then((res) => {
                console.log(res);
                setNUmber(prevState => ({
                    ...prevState,
                    number: res.data[0].mobile
                }))
            }).catch((err) => {
                console.log(err)
            })
    }


    const handleNumberSubmit = (e) => {
        e.preventDefault();

        const numberRegex = /^\d+$/; // Regular expression to allow only digits

        if (!numberRegex.test(number.number)) {
            setNumberError(true);
            setNUmberErrorText("Error: Mobile number should only contain digits.");
            console.error("Error: Mobile number should only contain digits.");
            return;
        } else if (number.number.length !== 10) {
            setNumberError(true);
            setNUmberErrorText("Error: Mobile number should only contain 10 digits.");
            return
        }


        const user = {
            mobile: number.number,
            user_id: localStorage.getItem('food_id'),
        }

        axios.post(`${BASE_URL}/updateMobile`, user)
            .then((res) => {
                console.log(res);
                localStorage.setItem("food_mobile", number.number)
                setMobile(number.number)

            }).catch((err) => {
                console.log(err);
            })
        console.log(user);
        handleClose();
    }


    const removeitem = (id) => {
        setLoader(true)
        const newtotalPrice = product.reduce((acc, item) => {
            const itemTotal = item.price * (quantities[item.id] - 1 || item.pqty - 1); // Use 1 as default quantity if not 
            return acc + itemTotal;
        }, 0);
        const minamt = localStorage.getItem('minamt')

        const userConfirmed = window.confirm('Are you sure you want to delete?');

        if (userConfirmed) {

            if (minamt <= newtotalPrice) {

                const data = {
                    cart_id: id
                }

                axios.post(`${BASE_URL}/remove_product`, data)
                    .then((res) => {
                        console.log(res)
                        setLoader(false)
                        getcartdata()
                        getseparatecalculation()
                        getcalculation(localStorage.getItem('Coupon'))
                    })
            } else {
                alert('Remove the coupon first')
            }


        } else {

            console.log('Action canceled.');
        }

    }




    const handleIncrease = (itemId, newpqty, cgst, sgst, price) => {

        setQuantities(prevQuantities => ({
            ...prevQuantities,
            [itemId]: (prevQuantities[itemId] || newpqty) + 1
        }));

        let pqty;

        if (quantities[itemId] == null) {
            pqty = 1
        } else {
            pqty = quantities[itemId] + 1
        }



        if (discount != '') {

            const newtotalPrice = product.reduce((acc, item) => {
                const itemTotal = item.price * (quantities[item.id] + 1 || item.pqty + 1); // Use 1 as default quantity if not 
                return acc + itemTotal;
            }, 0);

            let discper = (100 * discount) / newtotalPrice

            let newprice = discper / 100;

            let fprice = price - (price * newprice);

            localStorage.setItem('Discper', discper)

            const cpercentage = (Number(cgst) + 100) / 100
            const newCgst = Number(fprice) / cpercentage
            const FCgst = Number(fprice) - newCgst

            const spercentage = (Number(sgst) + 100) / 100
            const newSgst = Number(fprice) / spercentage
            const FSgst = Number(fprice) - newSgst

            const data = {
                cartid: itemId,
                proqty: pqty,
                cgstamt: FCgst,
                sgstamt: FSgst,
            }

            axios.post(`${BASE_URL}/update_product_count`, data)
                .then((res) => {

                    getseparatecalculation()
                })
        } else {


            const cpercentage = (Number(cgst) + 100) / 100
            const newCgst = Number(price) / cpercentage
            const FCgst = Number(price) - newCgst

            const spercentage = (Number(sgst) + 100) / 100
            const newSgst = Number(price) / spercentage
            const FSgst = Number(price) - newSgst

            const data = {
                cartid: itemId,
                proqty: pqty,
                cgstamt: FCgst,
                sgstamt: FSgst,
            }

            axios.post(`${BASE_URL}/update_product_count`, data)
                .then((res) => {

                    getseparatecalculation()
                })
        }


    };

    const handleDecrease = (itemId, pqty, cgst, sgst, price) => {

        const newtotalPrice = product.reduce((acc, item) => {
            const itemTotal = item.price * (quantities[item.id] - 1 || item.pqty - 1); // Use 1 as default quantity if not 
            return acc + itemTotal;
        }, 0);
        const minamt = localStorage.getItem('minamt')


        if (minamt <= newtotalPrice) {



            setQuantities(prevQuantities => ({
                ...prevQuantities,
                [itemId]: Math.max((prevQuantities[itemId] || pqty) - 1, 1)  // Ensuring quantity doesn't go below 1
            }));

            let proqty;

            if (quantities[itemId] === 1) {
                proqty = 1;
            } else if (quantities[itemId] == null) {
                proqty = 1;
            } else {
                proqty = Math.max(quantities[itemId] - 1, 1);  // Ensuring quantity doesn't go below 1
            }



            if (discount != '') {
                const newtotalPrice = product.reduce((acc, item) => {
                    const itemTotal = item.price * (quantities[item.id] - 1 || item.pqty - 1); // Use 1 as default quantity if not 
                    return acc + itemTotal;
                }, 0);




                let discper = (100 * discount) / newtotalPrice

                let newprice = discper / 100;

                let fprice = price - (price * newprice);

                localStorage.setItem('Discper', discper)


                const cpercentage = (Number(cgst) + 100) / 100
                const newCgst = Number(fprice) / cpercentage
                const FCgst = Number(fprice) - newCgst

                const spercentage = (Number(sgst) + 100) / 100
                const newSgst = Number(fprice) / spercentage
                const FSgst = Number(fprice) - newSgst

                const data = {
                    cartid: itemId,
                    proqty: proqty,
                    cgstamt: FCgst,
                    sgstamt: FSgst,
                }
                checkcoupon()
                axios.post(`${BASE_URL}/update_product_count`, data)
                    .then((res) => {

                        getseparatecalculation()
                    })
            } else {


                const cpercentage = (Number(cgst) + 100) / 100
                const newCgst = Number(price) / cpercentage
                const FCgst = Number(price) - newCgst

                const spercentage = (Number(sgst) + 100) / 100
                const newSgst = Number(price) / spercentage
                const FSgst = Number(price) - newSgst

                const data = {
                    cartid: itemId,
                    proqty: proqty,
                    cgstamt: FCgst,
                    sgstamt: FSgst,
                };
                checkcoupon()
                axios.post(`${BASE_URL}/update_product_count`, data)
                    .then((res) => {
                        // Handle the response if necessary
                        getcartdata()
                        getseparatecalculation()
                    });
            }

        } else {
            alert('Remove the coupon first')

        }


    }




    const totalPrice = product.reduce((acc, item) => {
        const itemTotal = item.price * (quantities[item.id] || item.pqty); // Use 1 as default quantity if not 
        return acc + itemTotal;
    }, 0);
    const totalCgst = gst.reduce((acc, item) => {
        const itemTotal = item.cgstamt; // Use 1 as default quantity if not 
        return acc + itemTotal;
    }, 0);
    const totalSgst = gst.reduce((acc, item) => {
        const itemTotal = item.sgstamt; // Use 1 as default quantity if not 
        return acc + itemTotal;
    }, 0);

    let discountper = (discount / totalPrice) * 100;

    const totalgstamt = totalCgst + totalSgst



    const amtbeforegst = (totalPrice - discount) - totalgstamt;


    function checkcoupon() {

    }

    const ApplyCode = () => {
        const data = {
            coupon: code.toLocaleLowerCase(),
            v_id: vendor_id,
            companyid: localStorage.getItem(`companyid`),
            amount: totalPrice,
            user_id: localStorage.getItem(`food_id`)
        }

        localStorage.removeItem('CopyCoupon')

        axios.post(`https://viggorventures.com/webloginuat/api/php_api.php`, data)
            .then((res) => {

                setDiscount(res.data[0] && res.data[0].discountAmtPer)



                setCERR(res.data && res.data.msg)



                if (res.data[0] && res.data[0].discountAmtPer) {

                    // if(res.data[0].couponType == 1){

                    //     localStorage.setItem('Coupon', res.data[0] && res.data[0].discountAmtPer)

                    // }else{
                    //     const incomingdisc = res.data[0] && res.data[0].discountAmtPer

                    //     let discper = (100 * incomingdisc) / totalPrice

                    //     let newprice = discper / 100;

                    //     localStorage.setItem('Coupon', newprice)
                    // }

                    setHide(true)

                    localStorage.setItem('Coupon', res.data[0] && res.data[0].discountAmtPer)
                    localStorage.setItem('Discper', discountper)
                    localStorage.setItem('Couponcode', res.data[0] && res.data[0].couponCode)
                    localStorage.setItem('minamt', res.data[0] && res.data[0].minamt)


                    getcalculation(res.data[0] && res.data[0].discountAmtPer)

                }
                if (res.data && res.data.message) {
                    setHide(false)
                }

                setTimeout(() => {
                    setCERR('')
                }, 3000)


            })

    }






    async function getcalculation(discountp) {

        let newdiscountper = (100 * discountp) / totalPrice

        const data = {
            orderid: localStorage.getItem('orderid'),
            discper: newdiscountper
        }
        // if ( localStorage.getItem('Discper')) {

        axios.post(`${BASE_URL}/getcalculation`, data)
            .then((res) => {
                getseparatecalculation()
                localStorage.setItem('Discper', newdiscountper)
                setTimeout(() => {

                    setCalLoading(false)
                }, 500);
            })
        // }

    }

    useEffect(() => {
        const value = localStorage.getItem('Coupon')
        setDiscount(value)

    }, [])

    async function getseparatecalculation() {
        const data = {
            orderid: localStorage.getItem('orderid')
        }

        axios.post(`${BASE_URL}/gstcalculation`, data)
            .then((res) => {
                setGst(res.data)
            })
    }

    const couponcancel = () => {

        localStorage.removeItem('Couponcode');
        localStorage.removeItem('Coupon');
        localStorage.removeItem('Discper')
        localStorage.removeItem('minamt')
        setDiscount([])
        setHide(false)
        getseparatecalculation()
        getcalculation(0)
    }



    return (
        <>
            {loader && <Loader />}
            {payloader && <PaymentLoader />}
            <div className='p-3 ' style={{ marginBottom: "90px" }}>
                {loading ? <CartSkelton /> : null}
                <div style={{ display: loading ? "none" : "block" }}>
                    <p>Total ({count}) item in cart</p>
                </div>

                {product.map((item) => {

                    const prototal = item.price * (quantities[item.id] || item.pqty)

                    return (
                        <div className='cart-pro-card ' style={{ display: loading ? "none" : "block" }}>
                            <div className='row p-1 border rounded-3 my-1'>
                                <div className='col-2 col-md-2 '>
                                    <div className='position-relative rounded pro-img d-flex' style={{ border: item.type == 1 ? '1px solid green' : '1px solid red' }}>
                                        <img style={{ height: "60px" }} src={item.upload_image !== '' ? `${IMAGE_URL}/product/` + item.upload_image : Notimg} alt='' />
                                    </div>
                                </div>

                                <div className='col-5 col-md-5 pro-description position-relative'>
                                    <div className='d-flex'>
                                        <h2>{item.pname}</h2>
                                        {item.type == "1" ? <img className='veg-icon' style={{ width: "10px", height: "10px" }} src={veg} alt='' /> : <img className='veg-icon' style={{ width: "10px", height: "10px" }} src={nonveg} alt='' />}
                                    </div>
                                    <h3>₹{item.price}/-</h3>
                                    <p className='disc' style={{ overflow: "hidden", textOverflow: "ellipsis", width: "100px", textWrap: "nowrap" }}>
                                        {item.description}
                                    </p>
                                </div>

                                <div className='col-4 col-md-4 border-end '>
                                    <div className='d-flex mx-2' style={{ justifyContent: "end" }}>
                                        <div className='d-flex justify-content-between align-items-center'>
                                            <div className='menu-add-remmove d-flex align-items-center '>
                                                <button onClick={() => {

                                                    handleDecrease(item.id, item.pqty, item.CGST, item.SGST, item.price)

                                                }} className='minus'>
                                                    -
                                                </button>
                                                <input value={quantities[item.id] || item.pqty} className='text' disabled />

                                                <button onClick={() => handleIncrease(item.id, item.pqty, item.CGST, item.SGST, item.price)} className='plus'  >
                                                    +
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className='d-flex mx-2 mt-1' style={{ justifyContent: "end" }}>
                                        <p >₹{prototal}/-</p>

                                    </div>
                                </div>


                                <div className='col-1 col-md-1 position-relative'>
                                    <DeleteOutlineOutlinedIcon onClick={() => removeitem(item.id)} sx={{ color: "red", position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)" }} />
                                </div>


                            </div>


                        </div>
                    )
                })}

                {/* {product.length < 0 && <div>
             <img style={{ width: "100%" }} src={ecart} alt='' /> </div>} */}

                <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={style}>
                        <Typography className='mb-2' id="modal-modal-title" variant="h6" component="h2">
                            Edit Number

                        </Typography>
                        <TextField id="outlined-basic" label="Mobile No" variant="outlined" fullWidth className='mb-2' name='number' value={number.number} onChange={onNumberchange} />
                        {numberError && <Typography>{numberErrortext}</Typography>}
                        <Button style={{ background: "#FEBF10" }} fullWidth variant='contained' onClick={handleNumberSubmit}>Edit</Button>
                    </Box>
                </Modal>


                {product.length > 0 && <div className='instruction mt-4'>


                    <div className='row align-items-center'>
                        <p className='col-3 col-md-3'>HAVE COUPON?</p>
                        <div className='col-6 col-md-6'>
                            <input className='border-yellow px-2' name='code' value={code} onChange={(e) => setCode(e.target.value)} type='text' alt='' />
                        </div>
                        <div className='col-3 col-md-3 '>
                            <button className='btn-yellow' onClick={() => ApplyCode()} >APPLY CODE</button>
                        </div>
                    </div>
                    <span className='text-danger'>{cerr}</span>

                    <hr />

                    <div className='coupon-navigate    row align-items-center'>
                        <p className='fw-bold col-3'>Check Coupon</p>
                        <p className='col-6'><img style={{ width: "20px" }} src={offer} alt='' /></p>
                        <div className='col-3'>
                            <Link to={`/offerpage`}> <button className=''>View</button></Link>
                        </div>
                    </div>
                </div>}


                <hr />

                {product.length > 0 && <div className='info-sec'>
                    <p>{name} &nbsp; +91 {mobile} &nbsp;<span onClick={handleOpen}>Edit</span></p>

                    {(localStorage.getItem('Coupon') || hide) && <div style={{ background: "#febf10", padding: "10px", borderRadius: "10px", display: calloading ? "none" : "block" }} className='d-flex justify-content-between mt-2'>
                        <p style={{ fontSize: "20px" }}><b>{localStorage.getItem("Couponcode")}</b></p>


                        <CancelIcon onClick={() => couponcancel()} />
                    </div>}

                    <hr />
                    {calloading ? <Calculation /> : null}

                    <div className='d-flex justify-content-between' style={{ display: calloading ? "none" : "block" }}>
                        <div>
                            <p>Total bill</p>
                            {hide || localStorage.getItem('Coupon') ? <p style={{ color: "red" }}>Coupon Discount</p> : <></>}
                            <p>Amount before gst</p>
                            {gst.map((item) => {
                                return (
                                    <>
                                        <p>Cgst({item.CGST} %)</p>
                                        <p>Sgst({item.SGST} %)</p>
                                    </>

                                )
                            })}

                        </div>
                        <div style={{ color: "lightslategrey", textAlign: "right" }}>
                            <p>₹{totalPrice.toFixed(2)}</p>
                            {hide || localStorage.getItem('Coupon') ? <p style={{ color: "red" }}>- ₹{discount}</p> : <></>}

                            <p>₹{amtbeforegst.toFixed(2)}</p>
                            {gst.map((item) => {
                                return (
                                    <>
                                        <p>₹{item.cgstamt.toFixed(2)}</p>
                                        <p>₹{item.sgstamt.toFixed(2)}</p>
                                    </>
                                )
                            })}

                        </div>
                    </div>
                    <hr />
                    <div className='d-flex justify-content-between' style={{ display: calloading ? "none" : "block" }}>
                        <div>
                            {hide && <p>Total</p>}
                            {hide ? <></> : <p>Total</p>}

                        </div>
                        <div style={{ color: "lightslategrey" }}>
                            {(localStorage.getItem('Coupon') || hide) && <p> ₹{(totalPrice - discount).toFixed(2)}</p>}
                            {(localStorage.getItem('Coupon') || hide) ? <></> : <p>₹{totalPrice.toFixed(2)}</p>}
                        </div>
                    </div>

                </div>}


            </div>


            <div className='row cart-footer p-2 justify-content-center align-items-center'>

                <Link to="/dash" className='text-center col-md-3 col-3' >
                    <img style={{ width: "30px" }} src={home} alt='' />
                </Link>


                <div className='col-md-9 col-9 text-center'>
                    <button onClick={paymentHandler}>Pay ₹{discount ? totalPrice - discount : totalPrice}/-</button>
                </div>
            </div>
        </>

    )
}

export default Cart