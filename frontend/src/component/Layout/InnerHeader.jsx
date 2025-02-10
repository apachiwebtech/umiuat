import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
const InnerHeader = () => {

  const location = useLocation();
  const navigate = useNavigate()

  const getPageName = () => {
    switch (location.pathname) {
      case '/cart':
        return 'My Cart';
      case '/orderconfirm':
        return '';
      case '/profile':
        return 'Edit Profile';
      case '/orderhistory':
        return 'Orders';
      case '/profilepage':
        return 'Profile';
      case '/offerpage':
        return 'Offer Page';
      default:
        return 'UMI';
    }
  };

  return (
    <div className='text-center position-relative inner-head'>
    <h5 style={{ color: "#000" }}>{getPageName()}</h5>
    {window.location.pathname !== "/orderconfirm" &&  <ArrowBackIosIcon sx={{position:"absolute",left:"10px",top:"0px"}} onClick={() => navigate(-1)} /> }
    </div>
  )
}

export default InnerHeader