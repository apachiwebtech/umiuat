import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import PetsOutlinedIcon from '@mui/icons-material/PetsOutlined';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import PercentOutlinedIcon from '@mui/icons-material/PercentOutlined';
import cart from '../../Images/icon/Group (3).png'
import home from '../../Images/icon/Vector.png'
import offer from '../../Images/icon/Group 2 (1).png'
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../Utils/BaseUrl';
import { useDispatch, useSelector } from 'react-redux'
import { getCartCount } from '../store/CartProvider';
const Footer = () => {
  const [value, setValue] = React.useState('home');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };



	const count = useSelector((state) => state.cartCount.cartcount);

  const dispatch = useDispatch()
  
  useEffect(() => {
    dispatch(getCartCount())
  }, [])





  return (
    <div className='d-flex justify-content-around footer py-1'>
      <Link style={{ textDecoration: "none" }} to="/dash" className='text-center'>
        <img src={home} alt='' />
        <p>HOME</p>
      </Link>

      <Link to="/cart" className='text-center foot-middle'>  <div >
        <img className='img1' src={cart} alt='' />
        <p className='cartcount'>{count}</p>
      </div>
      </Link>
      <p className='cartname'>CART</p>
      <Link to="/offerpage" style={{ textDecoration: "none" }} className='text-center '>
        <img src={offer} alt='' />
        <p>OFFER</p>
      </Link>
    </div>
    // <div className='footer py-1'>
    //   <BottomNavigation sx={{ width: "100%", background: "#FBA834" }} value={value} onChange={handleChange}>
    //     <BottomNavigationAction

    //       label="Home"
    //       value="home"
    //       icon={<HomeOutlinedIcon />}
    //       style={{ color: '#fff' }}
    //       selected
    //     />
    //     {localStorage.getItem("pet_role") == 1 ? <BottomNavigationAction

    //       label="Profile"
    //       value="profile"
    //       style={{ color: '#fff' }}
    //       icon={<PetsOutlinedIcon />}
    //     /> : null}
    //     {localStorage.getItem("pet_role") == 2 ? <BottomNavigationAction

    //       label="Service"
    //       value="Service Request"
    //       style={{ color: '#fff' }}
    //       icon={<MoveToInboxIcon />}
    //     /> : null}
    //     {localStorage.getItem("pet_role") == 1 ?
    //       <BottomNavigationAction

    //         label="Community"
    //         value="Community"
    //         style={{ color: '#fff' }}
    //         icon={<HandshakeIcon />}
    //       /> : null}

    //     <BottomNavigationAction

    //       label="Setting"
    //       value="setting"

    //       style={{ color: '#fff' }}
    //       icon={<SettingsOutlinedIcon />}
    //     />
    //     <BottomNavigationAction
    //       onClick={handleLogout}
    //       style={{ color: '#fff' }}
    //       value="logout"
    //       icon={<LogoutOutlinedIcon />}
    //     />
    //   </BottomNavigation>
    // </div>

  )
}

export default Footer