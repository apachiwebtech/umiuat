import axios from 'axios';
import React, { useEffect, useState, version } from 'react';
import { Link } from 'react-router-dom';
import 'remixicon/fonts/remixicon.css';
import nonveg from '../../../Images/Non.png';
import veg from '../../../Images/veg.png';
import { BASE_URL, IMAGE_URL, VERSION } from '../../Utils/BaseUrl';
import { useDispatch } from 'react-redux';
import { getCartCount } from '../../store/CartProvider';
import PopulerSkelton from '../skelton/PopulerSkelton';
import Notimg from '../../../Images/Not.png'
import DiscountIcon from '@mui/icons-material/Discount';

const PopularDish = ({ click, currentloc, locid }) => {
  const [count, setCount] = useState(0)
  const [popular, setPopular] = useState([])
  const [loading, setLoading] = useState(true);

  const [detail, setdetail] = useState([])
  const [open, setOpen] = useState(false)
  const dispatch = useDispatch()
  const handleclick = (id) => {
    setOpen(true)

    axios.post(`${BASE_URL}/detail_product`, { proid: id })
      .then((res) => {

        setdetail(res.data[0])
      })

  }

  const handleclose = () => {
    setOpen(false)
    setdetail([])
  }

  // useEffect(() => {
  //     let dataString = localStorage.getItem("locid")

  //     const firstNumber = parseInt(dataString.match(/\d+/)[0], 10);

  //     localStorage.setItem("currentloc", firstNumber)

  // }, [])


  async function getPopular() {
    const data = {
      locid: currentloc,
      version: VERSION
    }

    axios.post(`${BASE_URL}/products`, data)
      .then((res) => {
        setPopular(res.data)
        setTimeout(() => {
          setLoading(false)
        }, 500);
      })
  }



  useEffect(() => {

    getPopular();

  }, [currentloc, locid])


  const [itemCounts, setItemCounts] = useState({});

  // Function to handle item count changes
  const handleItemCountChange = (itemId, newCount) => {
    setItemCounts(prevCounts => ({
      ...prevCounts,
      [itemId]: newCount
    }));
  };



  return (
    <div style={{ paddingBottom: "90px" }}>
      <div className='Cat-head'>
        <hr />
        {popular.length > 0 && <p>MOST POPULAR</p>}
      </div>
      <div className='row' >
        {
          popular?.filter((item) => (item.type).includes(click)).map((item) => {
            return (
              <div className='col-12' style={{ height: loading ? "90px" : "auto" }}>
                <div className='pro-card p-1' style={{ display: loading ? "none" : "block" }} >
                  <div className='row p-1 border rounded-3' style={{ minHeight: "100px" }}>
                    <div className='col-4 col-md-5 '>
                      <div className='position-relative rounded pro-img d-flex overflow-hidden' style={{ border: item.type == 1 ? '1px solid green' : '1px solid red' }}>
                        <img style={{ height: "107px" }} onClick={() => handleclick(item.id)} src={item.upload_image !== '' ? `${IMAGE_URL}/product/` + item.upload_image : Notimg} alt='' />
                        {/* <h3>Upto {item.rate} Off</h3> */}

                      </div>
                    </div>

                    <div className=' col-8 col-md-7 pro-description position-relative'>
                      <div onClick={() => handleclick(item.id)}>
                        <span><b className='
                        '>{item.title}</b></span>
                        <p>{item.vendor_name}</p>
                        {item.type == "1" ? <img className='veg-icon' src={veg} alt='' /> : <img className='veg-icon' src={nonveg} alt='' />}
                        {/* <p className='disc'>
                                                    {item.description}
                                                </p> */}
                        {item.type == "2" ? <p className='disc py-1'>
                          Contain Eggs<span className='text-danger'>*</span>
                        </p> : <p></p>}
                      </div>

                      <div className='mt-2' >
                        <h2>{item.description}</h2>
                      </div>

                      <span ><b>Rs. {Number(item.price) + Number(item.discount_price)}/-</b></span>

                      <div className=' w-100 bottom-0 mb-2 d-flex justify-content-between align-items-center '>
                        {item.discount_price > 0 ?
                          <span className='discount-price'><DiscountIcon fontSize='16px' />Get for <span className='disc-child'>Rs. {item.price}/-</span></span> : <p></p>
                        }
                        <div className=' add-remmove d-flex align-items-center  '>
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





                    </div>
                  </div>

                </div>

                {/* <PopulerSkelton/> */}

              </div>

            )
          })
        }
        <div className='col-12'>
          {loading ? <div className='row'>
            <PopulerSkelton />
            <PopulerSkelton />
            <PopulerSkelton />
            <PopulerSkelton />
            <PopulerSkelton />
            <PopulerSkelton />
            <PopulerSkelton />

          </div> : null}

        </div>








        {open ? <div className='overlay'></div> : null}


        <div className={open ? 'dish-details show-details positon-relative' : 'dish-details'}>
          {open ? <div className='close-btn'>
            <button onClick={handleclose}>Close &nbsp;X</button>
          </div> : null}

          <div className='pro-detail-card m-2 p-2'>
            <div className='detail-img d-flex justify-content-center align-items-center'>
              <img src={detail.upload_image !== '' ? `${IMAGE_URL}/product/` + detail.upload_image : Notimg} alt='' />

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
              {detail.discount_price > 0 && <div className='py-2'>
                <span className='discount-price'><DiscountIcon fontSize='16px' />Get for <span className='disc-child'>Rs. {detail.price}/-</span></span>
              </div>}
              {/* <p className=''><span className='p-1 mb-3'>4.5 ⭐</span></p> */}

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




      </div>


    </div>
  )
}

export default PopularDish
