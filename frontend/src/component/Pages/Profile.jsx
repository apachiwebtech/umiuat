import { Avatar, TextField } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import axios from 'axios';
import React, { useState } from 'react';
import InnerHeader from '../Layout/InnerHeader';
import { BASE_URL } from '../Utils/BaseUrl';
function Profile() {

    const name = localStorage.getItem(`Name`)

    const [value, setValue] = useState({
        fullname: "" || localStorage.getItem("Name"),
        number: "" || localStorage.getItem("food_mobile"),
        email: "" || localStorage.getItem("food_email"),
    });

    const [update, setUpdate] = useState(false)
    const [age, setAge] = React.useState(0);

    const handleChange = (event) => {
      setAge(event.target.value);
    };
    const [msg, setMSG] = useState("")
    // const validateForm =(e) => {
    //     let isValid = true
    //     const newErrors = {}
    //     console.log(e.target)
    // }

    const onhandlechange = (e) => {
        // e.preventdefault();
        setUpdate(true)
        setValue((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleUpdate = (e) => {

        localStorage.setItem("food_email", value.email)
        // localStorage.setItem("food_value", value)
        localStorage.setItem("food_mobile", value.number)
        localStorage.setItem("Name", value.fullname)
        setUpdate(false)


        const data = {
            email: value.email,
            mobile: value.number,
            fullname: value.fullname,
            user_id: localStorage.getItem("food_id"),
            gender : age
        }

        axios.post(`${BASE_URL}/update_profile`, data)
            .then((res) => {
                console.log(res)

                if (res.data) {
                    setMSG("Profile Updated Successfully")
                }

                setTimeout(() => {
                    setMSG("")
                }, 3000);
            })


    }



    return (
        <>

            <InnerHeader />

            <div className='profilepic'>
                <Avatar sx={{ width: 150, height: 150, fontSize: 50, }}>{name.charAt(0)}</Avatar>

                {/* <h4>{localStorage.getItem("Name")}</h4> */}


                <TextField id="outlined-basic" style={{ width: "100%" }} type='text' value={value.fullname} name='fullname' label="Fullname" onChange={onhandlechange} variant="outlined" />
                <TextField id="outlined-basic" style={{ width: "100%" }} type='number' value={value.number} name='mobile' label="Mobile" onChange={onhandlechange} variant="outlined" />
                <TextField id="outlined-basic" style={{ width: "100%" }} type='email' value={value.email} name='email' label="E-mail" onChange={onhandlechange} variant="outlined" />
                <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">Gender</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={age}
                        label="Age"
                        onChange={handleChange}
                    >
                        <MenuItem value={0}>Male</MenuItem>
                        <MenuItem value={1}>Female</MenuItem>
             
                    </Select>
                </FormControl>
                {!update ? <button className='update-btn-dis' type='button' disabled>UPDATE CHANGES</button> : <button className='update-btn' onClick={handleUpdate} >UPDATE CHANGES</button>}
                <span className='text-success'>{msg}</span>



            </div>



        </>
    )
}

export default Profile