import React, { useEffect, useState } from 'react'
import Banner from './DashComponent/Banner'
import Category from './DashComponent/Category'
import PopularDish from './DashComponent/PopularDish'
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SearchIcon from '@mui/icons-material/Search';
import veg from '../../Images/veg.png'
import nonveg from '../../Images/Non.png'
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL, VERSION } from '../Utils/BaseUrl'
import cook from '../../Images/cook.gif'
import { LinearProgress } from '@mui/material'
import Bannerskelton from './skelton/Bannerskelton'
import Searchskelton from './skelton/Searchskelton'
import Loader from './Loader'
import { Haptics, ImpactStyle, Media } from '@capacitor/haptics';
import Cookies from 'js-cookie';


const Dash = () => {
  const [click, setclick] = useState('')
  const [toggle, settoggle] = useState(false)
  const [toggle2, settoggle2] = useState(false);
  const [Vendor, setVendor] = useState([]);
  const [VendorProducts, setVendorProducts] = useState([]);
  const [locid, setLocId] = useState('')
  const [currentloc, setCurrentid] = useState('')
  const [status, setStatus] = useState([])
  const [ostatus, setOstatus] = useState([])
  const [loading, setLoading] = useState(true);
  const [vload, setVLoad] = useState(false)
  const [version, setversion] = useState()




  const handleclick = (e) => {
    settoggle(!toggle)
    settoggle2(false);

    if (!toggle) {
      setclick(e.target.value)
      localStorage.setItem('foodcat', e.target.value)
    } else {
      setclick('')
      localStorage.setItem('foodcat', '')
    }


  }

  const handleclick2 = (e) => {
    settoggle(false)
    settoggle2(!toggle2);

    setclick(e.target.value)



    if (!toggle2) {
      setclick(e.target.value)
      localStorage.setItem('foodcat', e.target.value)
    } else {
      setclick('')
      localStorage.setItem('foodcat', '')
    }

  }



  const [location, setLocation] = useState([]);

  // async function getloc() {
  //   const data = {
  //     user_id: localStorage.getItem('food_id')
  //   }
  //   axios.post(`${BASE_URL}/getuserloc`, data)
  //     .then((res) => {
  //       if(res.data[0].locationid){

  //         localStorage.setItem('locid', res.data[0].locationid)
  //       }
  //     })
  // }


  async function getLocation() {
    const data = {
      loc_id: localStorage.getItem('locid'),
      version: VERSION
    }

    axios.post(`${BASE_URL}/get_loc`, data)
      .then((res) => {
        setLocation(res.data)
        if (res.data[0] && res.data[0].id) {
          setLocId(res.data[0].id)


          // localStorage.setItem('lastloc', res.data[0].id);
        }
      })
  }



  const Navigate = useNavigate()

  const getVendorSpecificProducts = async (id) => {
    setVLoad(true)

    const response = await axios.post(`${BASE_URL}/vendorProducts`, {
      vendorId: id
    })

    // console.log(response.data);
    setVendorProducts(response.data);

    if (response.data) {
      Navigate(`/vendorpage/${id}`)
      setVLoad(false)
    }
  }
  useEffect(() => {
    if (localStorage.getItem(`locid`) !== null) {
    }
    getLocation();

    setclick(localStorage.getItem('foodcat'))

    if (localStorage.getItem('foodcat') == '1') {
      settoggle(!toggle)
      settoggle2(false);
    } else if (localStorage.getItem('foodcat') == '2') {
      settoggle(false)
      settoggle2(!toggle2);
    }

    if (localStorage.getItem('foodcat') == '') {
      settoggle(false)
    }
  }, [])


  const handlegetvendor = async (id) => {
    const data = {
      loc_id: id || localStorage.getItem('lastloc'),
      version: VERSION
    };

    try {
      const response = await axios.post(`${BASE_URL}/vendorList`, data);
  
      if (response.data && response.data.length > 0) {
        const vendorId = response.data[0].id;
  
        localStorage.setItem("VendorId", vendorId); 
      }
  
      setCurrentid(id ||  localStorage.getItem('lastloc')); 
      setVendor(response.data);
  
      setTimeout(() => {
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error("Error fetching vendor list:", error);
    }
  };


  const handleversioncheck = async () => {

    const data = {
      myversion: VERSION
    }


    axios.post(`${BASE_URL}/checkversion`, data)
      .then((res) => {



        if (Cookies.get('version')) {

          setversion(false)
        }
        else if (res.data && res.data.status == 1) {

          setversion(false)

        }
        else if (res.data && res.data.status == 0) {
          setversion(true)

        }

      })
  }

  useEffect(() => {
    handleversioncheck()

  }, [])

  useEffect(() => {


    setTimeout(() => {
      handlegetvendor()
    }, 500)


  }, [locid])


  async function getStatus() {
    const data = {
      user_id: localStorage.getItem('food_id')
    };

    try {
      const res = await axios.post(`${BASE_URL}/getorderstatus`, data);

      if (res.data) {
        setOstatus(res.data.cartstatus);
        setStatus(res.data.mainorder);

        // Vibrate the device using Capacitor Haptics plugin
        console.log(res.data.cartstatus.length)

        if (res.data.cartstatus[0].orderstatus == 1) {
          await Haptics.vibrate();
        }
      }
    } catch (error) {
      console.error('Error fetching order status:', error);
    }
  }






  useEffect(() => {
    // getloc()
    getStatus();

    const intervalId = setInterval(() => {
      getStatus();
    }, 10000);

    // Cleanup function to clear the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []);


  return (
    <div>
      {vload && <Loader />}



      <div className='order-status  animate__animated animate__fadeInLeft' >
        {ostatus.some((item) => item.orderstatus == 4) ? <></> : ostatus.length > 1 ? <Link to="/orderhistory" className='text-light'>
          <div className='d-flex align-items-center bg-danger'>
            <p className='text-light ' style={{ fontSize: "18px", fontWeight: "900" }}><b className='blink'></b>Sum of your item is ready</p>
            <i class="bi bi-arrow-right"></i>
          </div>
        </Link> : ostatus.length > 0 ? <Link to="/orderhistory" className='text-light'>
          <div className='d-flex align-items-center bg-danger'>
            <p className='text-light' style={{ fontSize: "18px", fontWeight: "900" }}><b className='blink'> {ostatus[0].pname} is Ready </b></p>
            <i class="bi bi-arrow-right"></i>
          </div>
        </Link> : status == 'placed' ? <Link to="/orderhistory" className='text-light'>
          <div className='d-flex align-items-center bg-success'>
            <p className='text-light ' style={{ fontSize: "18px", fontWeight: "900" }}><b className='blink'></b>Order is Placed</p>
            <i class="bi bi-arrow-right"></i>
          </div>
        </Link> : status == 'processing' ? <Link to="/orderhistory" className='text-light'>
          <div className='d-flex align-items-center bg-warning'>
            <p className='text-light ' style={{ fontSize: "18px", fontWeight: "900" }}><b className='blink'></b>Processing..</p>
            <i class="bi bi-arrow-right"></i>
          </div>
        </Link> : <></>}


      </div>

      <Banner />

      <div className='px-3 pt-1 dash-search'>
        <div style={{ display: loading ? "none" : "block" }}>


          <div className='row'>

            <div className='col-md-7 col-7 position-relative'>
              {/* <input className="border-yellow p-1" type='text' placeholder="ANDHERI-POWAI-CAFE-1" alt='' disabled /> */}
              <select onChange={(e) => {
                handlegetvendor(e.target.value)
                localStorage.setItem('lastloc', e.target.value)
              }} value={localStorage.getItem('lastloc')} className="border-yellow p-1 w-100" >
                {
                  location?.map((item) => {
                    return (
                      <option key={item.id} value={item.id}>{item.location}</option>
                    )
                  })
                }
              </select>

            </div>

            <div className='col-md-5 col-5 '>
              <select className="border-yellow w-100 px-1 py-1 mx-1" onChange={(e) => {
                getVendorSpecificProducts(e.target.value);
                const vendorId = getVendorSpecificProducts(e.target.value);
                localStorage.getItem("VendorId", vendorId); 
              }}>



                <option>SELECT VENDOR</option>
                {

                  Vendor?.map((item) => {
                    return (
                      <option key={item.id} value={item.id}> <Link to={`/menupage/${item.id}`}> {item.company_name}</Link></option>
                    )
                  })
                }
              </select>
            </div>

          </div>
          <div className='row py-2'>

            <div className='col-md-7 col-7 position-relative'>
              <Link to={`/searchpage/${locid}/${currentloc}`}>  <input className="border-yellow p-1" type='search' placeholder='Search (eg. Pav Bhaji)' /></Link>
              <SearchIcon sx={{ color: "lightgray" }} className='search-icon' />
            </div>
            <div className='col-md-5 col-5 row align-items-center'>
              <div className='col-md-6 col-6 text-center px-1'>
                <button style={{ color: "green" }} value="1" onClick={(e) => handleclick(e)} className={toggle === false ? "border-yellow p-1 w-100 " : "border-yellow p-1 back-yellow w-100"}><img style={{ width: "10px", paddingRight: "1px" }} src={veg} alt='' />VEG</button>

              </div>
              <div className='col-md-6 col-6 text-center'>
                <button style={{ color: "red" }} value="2" onClick={(e) => handleclick2(e)} className={toggle2 === false ? "border-yellow p-1 w-100 " : "border-yellow p-1 back-yellow w-100"}><img style={{ width: "10px", paddingRight: "1px" }} src={nonveg} alt='' />NON VEG</button>
              </div>
            </div>

          </div>
        </div>

        {loading ? <Searchskelton /> : null}

      </div>



      {version && <div className='version-update'>


        <div className='update-pop' style={{ padding: "20px", position: "absolute" }}>
          <p>Please download our latest version..</p>
          <div className='d-flex justify-content-between'>
            <button onClick={() => {
              setversion(false)
              Cookies.set('version', 1, { expires: 1 / 24 });
              ;
            }}>Cancel</button>
            <Link to={`https://play.google.com/store/apps/details?id=com.umifood.app`}><button style={{ background: "#febf10", color: "#fff" }}>Update</button></Link>
          </div>
        </div>

      </div>}


      {version && <div className='update-overlay'></div>}

      <Category currentloc={currentloc} />
      <PopularDish currentloc={currentloc} locid={locid} click={click} vendorProducts={VendorProducts} />
    </div>
  )
}

export default Dash