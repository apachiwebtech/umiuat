import React, { useEffect, useState, version } from 'react'
import InnerHeader from '../Layout/InnerHeader'
import SearchIcon from '@mui/icons-material/Search';
import { BASE_URL, IMAGE_URL, VERSION } from '../Utils/BaseUrl';
import axios from 'axios';
import nonveg from '../../Images/Non.png';
import veg from '../../Images/veg.png'
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { getCartCount } from '../store/CartProvider';
import Footer from '../Layout/Footer';
import Notimg from '../../Images/Not.png'
import DiscountIcon from '@mui/icons-material/Discount';


const SearchPage = () => {

  const [search, setSearch] = useState('')
  const [popular, setPopular] = useState([])
  const dispatch = useDispatch()
  const { currentloc, locid } = useParams()


  const getPopular = async () => {

    const data = {
      locid: localStorage.getItem('lastloc'),
      version: VERSION
    }
    const response = await axios.post(`${BASE_URL}/products`, data);

    // console.log(response);
    setPopular(response.data);
  }

  useEffect(() => {
    getPopular();
  }, [])



  const [itemCounts, setItemCounts] = useState({});

  // Function to handle item count changes
  const handleItemCountChange = (itemId, newCount) => {
    setItemCounts(prevCounts => ({
      ...prevCounts,
      [itemId]: newCount
    }));
  };


  return (
    <div>
      <InnerHeader />
      <div className=' position-relative m-2'>
        <input onChange={(e) => setSearch(e.target.value)} className="border-yellow p-1 w-100" style={{ outline: "none" }} type='search' placeholder='Search (eg. Pav Bhaji)' />
      </div>

      <div className='menu-pro-card  '>
        {popular.filter((item) => (item.title.toLowerCase()).includes(search.toLocaleLowerCase())).map((item) => {
          return (
            <div className='row p-1 border rounded-3 my-1'>
              <div className='col-4 col-md-4 ' style={{minHeight:"100px" }} >
                <div className='position-relative rounded pro-img d-flex'>
                  <img style={{minHeight:"100px" }} className='rounded' src={item.upload_image !== '' ? `${IMAGE_URL}/product/` + item.upload_image : Notimg} alt='' />
                  {/* <h3>Upto 30% Off</h3> */}
                  {item.discount_price > 0 &&
                    <span className='discount-price' style={{ fontSize: "13px" }}><DiscountIcon fontSize='16px' />Get for <span className='disc-child'>Rs. {item.price}/-</span></span>
                  }
                </div>
              </div>

              <div className='col-8 col-md-8 pro-description position-relative'>
                <h2>{item.title}</h2>
                <p>{item.vendor_name}</p>

                {item.type == "1" ? <img className='veg-icon' src={veg} alt='' /> : <img className='veg-icon' src={nonveg} alt='' />}

                {/* <p className='disc'>
                                    {item.description}
                                </p> */}
                {item.type == "2" ? <p className='disc py-1'>
                  Contain Eggs<span className='text-danger'>*</span>
                </p> : <p></p>}

                <div className='position-absolute w-100 bottom-0 mb-2 d-flex justify-content-between align-items-center'>
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

              </div>
            </div>
          )
        })}




      </div>
      <Footer />
    </div>

  )
}

export default SearchPage
