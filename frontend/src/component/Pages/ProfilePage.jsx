import React, { useEffect, useState } from 'react'
import InnerHeader from '../Layout/InnerHeader'
import { Avatar, TextField } from '@mui/material'
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL, IMAGE_URL } from '../Utils/BaseUrl';

function ProfilePage() {

    const name = localStorage.getItem(`Name`)
    const mobile = localStorage.getItem(`food_mobile`)

    const navigate = useNavigate()

    const handlelogout = () => {

        const useconfirmed = window.confirm(`Are you sure you want to logout?`)

        // localStorage.removeItem(`food_id`)
        // localStorage.removeItem(`food_mobile`)
        // localStorage.removeItem(`companyid`)
        // localStorage.removeItem(`food_value`)
        // localStorage.removeItem(`Name`)
        // localStorage.removeItem(`locid`)
        // localStorage.removeItem(`food_email`)
        // localStorage.removeItem(`locname`)
        // localStorage.removeItem(`food_role`)
        // localStorage.removeItem(`otp`)
        // localStorage.removeItem(`currentloc`)

        if (useconfirmed) {
            localStorage.clear();
            navigate(`/`)
        }


    }

    return (
        <div className='profilepage'>

            <InnerHeader />

            <div className='p-3'>
                <div className='profilepage-back text-center '>
                    <div className='profilepage-card '>
                        <div className='text-center'>
                            <Avatar sx={{ width: 100, height: 100, fontSize: 50, }}>{name.charAt(0)}</Avatar>
                        </div>

                    </div>
                    <h4>{name}</h4>
                    <p>{mobile}</p>
                </div>

                <div className='profilepage-button my-3'>
                    <Link to="/profile" className='row'>
                        <i class="bi bi-person-circle col-1"></i>
                        <p className='col-6'>My Profile</p>
                    </Link>
                </div>

                <div className='profilepage-button my-3'>
                    <Link to="/orderhistory" className='row'>
                        <i class="bi bi-bag-check col-1"></i>
                        <p className='col-6'>Order History</p>
                    </Link>
                </div>
                <button className='logout-btn ' onClick={handlelogout}>Logout</button>
            </div>






        </div>
    )
}

export default ProfilePage