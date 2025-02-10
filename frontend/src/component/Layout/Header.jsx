import React from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import Avatar from '@mui/material/Avatar';
import logo from '../../Images/umi_red.png'
// import logo from '../../Images/umi_white.png'
const Header = () => {

  const name = localStorage.getItem(`Name`)


  return (
    <div className='head text-center position-relative'>

      <Link to='/dash'>
        <img style={{width :"60px"}} src={logo} alt="" />
      </Link>
      <Link to='/profilepage'>
      <div className='avatar'>
        <Avatar>{name.charAt(0)}</Avatar>
      </div>
      </Link>
    </div>
  )
}

export default Header