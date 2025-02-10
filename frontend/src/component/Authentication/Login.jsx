import { Checkbox, TextField } from '@mui/material'
import Alert from '@mui/material/Alert'
import axios from 'axios'
import React, { useRef, useState } from 'react'
import { BASE_URL } from '../Utils/BaseUrl'
import Loader from '../Pages/Loader'
import logo from '../../Images/LOG.jpg'
import {useNavigate} from 'react-router-dom' 



const generateOTP = (length) => {

    const characters = '123456789';
    let otp = '';

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        otp += characters[randomIndex];
    }

    return otp;
};



const Login = () => {


    const [value, setValue] = useState({
        fullname: '',
        remail: "",
        email: '',
        mobile: ''
    })

    const [values, setValues] = useState({
        otp1: "",
        otp2: "",
        otp3: "",
        otp4: "",
    })

    const validateForm = () => {
        let isValid = true
        const newErrors = {}

        if (!value.fullname) {
            isValid = false;
            newErrors.fullname = "Name is required"
        }
        if (!isChecked) {
            isValid = false;
            newErrors.checked = "Please select the checkbox"
        }

        if (!value.remail) {
            isValid = false;
            newErrors.remail = "Email is required";
        }

        const emailRegex = /^[a-zA-Z0-9]+@(?:[a-zA-Z0-9]+\.)+[A-Za-z]+$/;
        if (value.remail && !emailRegex.test(value.remail)) {
            isValid = false;
            newErrors.remail = "Invalid email id"
        }


        if (!value.mobile) {
            isValid = false;
            newErrors.mobile = "Mobile is required";
        }


        const mobileNumberRegex = /^\d{10}$/;
        if (value.mobile && !mobileNumberRegex.test(value.mobile)) {
            isValid = false;
            newErrors.mobile = "Invalid mobile no.";
        }

        setvalidError(newErrors)
        return isValid
    }

    const [otp, setOTP] = useState('');
    const [error, setError] = useState(false);
    const [otperror, setotpError] = useState(false);
    const [isChecked, setIsChecked] = useState(false);
    const [showOtp, setShowOtp] = useState(false);
    const label = { inputProps: { 'aria-label': 'Checkbox demo' } };
    const [hide, setHide] = useState(false)
    const [validerr, setvalidError] = useState(false)
    const [error2, setError2] = useState(false)
    const [loader, setLoader] = useState(false)
    const [emailexist, setExist] = useState(false)
    const [locerr , setLocerr] = useState()
    const otp1Ref = useRef(null);
    const otp2Ref = useRef(null);
    const otp3Ref = useRef(null);
    const otp4Ref = useRef(null);


   
    const handleGenerateOTP = () => {
        const generatedOTP = generateOTP(4); // Change 6 to the desired length of OTP
        setOTP(generatedOTP);

    };

    const onhandlesubmit = (e) => {
        e.preventDefault();

        const data = {
            email: value.email,
            otp: otp
        }

        if (value.email !== "") {
            setLoader(true)

           

            axios.post(`${BASE_URL}/user_login`, data)
                .then((res) => {
                    setLoader(false)

                    if(res.data.data == 1){
          
                        setError(true)

                        setTimeout(() => {
                            setError(false)

                        }, 5000);
                    }



                    if(res.data.locid && res.data.locid.length == 0){
          
                        setLocerr(true)
                        
                        setTimeout(() => {
                            
                            setLocerr(false)
                        }, 5000);
                    }


              

                

                    if (res.data.data && res.data.data[0].id) {

                        axios.post(`https://viggorventures.com/weblogin/umi_app_sendmail.php` , data)

                        setShowOtp(true)


                        setHide(true)
                        const email = res.data.data[0].email; // Define id here
                        const value = res.data.data[0].value; // Define id here
                        const name = res.data.data[0].firstname;
                        const otp = res.data.data[0].otp;
                        const mobile = res.data.data[0].mobile;
                        // const locid = res.data[0].locationid;
                        const locname = res.data.data[0].locationname;
                        const companyid = res.data.data[0].companyid;
                        const locid = res.data.locid[0].id
                        const locationid = res.data.data[0].locationid


                        localStorage.setItem("food_email", email)
                        localStorage.setItem("food_value", value)
                        localStorage.setItem("food_role", 1)
                        localStorage.setItem("Name", name)
                        localStorage.setItem('otp', otp)
                        localStorage.setItem('food_mobile', mobile);
                        localStorage.setItem('locid', locationid);
                        localStorage.setItem('locname', locname);
                        localStorage.setItem('lastloc', locid);
                        localStorage.setItem('companyid', companyid);
                    }
                    else {
                        setError(true)

                        setTimeout(() => {
                            setError(false)

                        }, 5000);
                    }


                })
                .catch((err) => {
                    console.log(err);
                })

        }
        else {
            setError2(true)
            setTimeout(() => {

                setError2(false)
            }, 5000);
        }


    }




    const onhandleregistersubmit = (e) => {
        e.preventDefault();

        const data = {
            email: value.remail,
            mobile: value.mobile,
            fullname: value.fullname,
            otp: otp
        }

        if (validateForm()) {
            setLoader(true)

            

            axios.post(`${BASE_URL}/login`, data)
                .then((res) => {

                    setLoader(false)

                    console.log(res.data)

                    if(res.data.data == 1){
          
                        setExist(true)

                        setTimeout(() => {
                            setExist(false)
                        }, 4000);
                    }

                    if (res.data.data[0].email) {
                        setShowOtp(true)

                        setHide(true)
                        
                        axios.post(`https://viggorventures.com/weblogin/umi_app_sendmail.php` , data)


                        const id = res.data.data[0].email; // Define id here
                        const value = res.data.data[0].value; // Define id here
                        const name = res.data.data[0].firstname;
                        const Mobile = res.data.data[0].mobile
                        const otp = res.data.data[0].otp;
                        // const locid = res.data.data[0].locationid;
                        const locname = res.data.data[0].locationname;
                        const companyid = res.data.data[0].companyid;
                        const locid = res.data.locid[0].id
                        const locationid = res.data.data[0].locationid

                        localStorage.setItem("food_email", id)
                        localStorage.setItem("food_value", value)
                        localStorage.setItem("food_mobile", Mobile)
                        localStorage.setItem("food_role", 1)
                        localStorage.setItem("Name", name)
                        localStorage.setItem('locid', locationid);
                        localStorage.setItem('lastloc', locid);
                        localStorage.setItem('locname', locname);
                        localStorage.setItem('otp', otp)
                        localStorage.setItem('companyid', companyid);
                        
                              
                    } else {
                        setExist(true)

                        setTimeout(() => {
                            setExist(false)
                        }, 4000);
                    }


                })
                .catch((err) => {
                    console.log(err);
                })

        }


    }





const navigate = useNavigate()

    const onhandleOTPsubmit = (e) => {
        const mergedOtp = Object.values(values).join('');
        e.preventDefault();

        setLoader(true)

        const data = {
            otp: mergedOtp,
            email: localStorage.getItem("food_email"),
            mobile: localStorage.getItem("food_mobile"),
            fullname: localStorage.getItem("Name"),
            value: localStorage.getItem("food_value"),
        }

        axios.post(`${BASE_URL}/otp`, data)
            .then((res) => {

                console.log(res.data)
          
                if(res.data[0].id){
                    navigate('/dash')
                    const role = res.data[0].role;
                    const value = res.data[0].value;
                    const id = res.data[0].id;
      
                    localStorage.setItem("food_role", role)
                    localStorage.setItem("food_value", value)
                    localStorage.setItem('food_id', id);
                    localStorage.setItem('foodcat' , '')
                }            
             
            })
            .catch((err) => {
                console.log(err);
                setotpError(true)
                setLoader(false)
         
                setTimeout(() => {
                    setotpError(false)

                }, 2000)
            });
    }












    const onhandlechange = (e) => {
        setValue((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const onHandleotpChange = (e) => {
        const { name, value } = e.target;

        setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }))

        // Move focus to the next input if a digit is entered
        let inputValue = e.target.value;
        if (value.length > 1) {
            inputValue = value.slice(0, 1);
            otp1Ref.current.value = inputValue;
            otp2Ref.current.value = inputValue;
            otp2Ref.current.value = inputValue;
            otp4Ref.current.value = inputValue;
        }

        if (value.length === 1) {
            switch (name) {
                case 'otp1':
                    otp2Ref.current.focus();
                    break;
                case 'otp2':
                    otp3Ref.current.focus();
                    break;
                case 'otp3':
                    otp4Ref.current.focus();
                    break;
                case 'otp4':
                    // The last input, you can perform additional actions if needed
                    break;
                default:
                    break;
            }
        } else if (value.length === 0) {
            // Backspace pressed, move focus to the previous input
            switch (name) {
                case 'otp2':
                    otp1Ref.current.focus();
                    break;
                case 'otp3':
                    otp2Ref.current.focus();
                    break;
                case 'otp4':
                    otp3Ref.current.focus();
                    break;
                default:
                    break;
            }
        }
    };


    const handleChange2 = (event) => {
        setIsChecked(event.target.checked);
    };

    const flushdata = () => {
        setShowOtp(false);
        setValues({
            otp1: "",
            otp2: "",
            otp3: "",
            otp4: "",
        });
        setHide(false)
    }


    return (
        <div className='' style={{background:"#E3010F"}}>
            {loader && <Loader />}
            <div className='reg-logo text-center' style={{height :"90px"}}>
                <img src={logo} alt="" />
            </div>
            <div className='reg-main reg-back px-4' >

                <div className='text-center py-2 reg'>

                    <ul class="nav nav-tabs" id="myTab" role="tablist">
                        <li class="nav-item" role="presentation">
                            <button class="nav-link active" onClick={flushdata} id="home-tab" data-bs-toggle="tab" data-bs-target="#home" type="button" role="tab" aria-controls="home" aria-selected="true">LOGIN</button>
                        </li>
                        <li class="nav-item" role="presentation">
                            <button class="nav-link" id="profile-tab" onClick={flushdata} data-bs-toggle="tab" data-bs-target="#profile" type="button" role="tab" aria-controls="profile" aria-selected="false">SIGN UP</button>
                        </li>

                    </ul>
                    <div class="tab-content" id="myTabContent">
                        <div class="tab-pane fade show active" id="home" role="tabpanel" aria-labelledby="home-tab">
                            <div className=''  >
                                <div className='mobile-detail p-2'>
                                    <div className='py-4'>
                                        <h4 className='mb-0 sign-intru' style={{ textTransform: "capitalize" }}>IF YOU ARE NEW USER PLEASE SIGN UP</h4>
                                    </div>

                                    <div className='text-start'>
                                        <TextField id="standard-basic" style={{ width: "100%" }} type='Enter your official email address' value={value.email} name='email' label="Email" onChange={onhandlechange} variant="standard" />
                                        {error2 && <span className='text-danger' >Please enter the email</span>}
                                        {error && <span className='text-danger'>Email id doesn't exist</span>}
                                        {locerr && <span className='text-danger'>Location is not available</span>}
                                    </div>
                                </div>




                            </div>
                            <form onSubmit={onhandlesubmit} className='py-3'>
                                <div style={{ position: "relative" }}>

                                    <button type='submit' className='reg-btn ' onClick={handleGenerateOTP}>
                                        <span >REQUEST OTP</span>
                                    </button>

                                </div>
                            </form>


                        </div>

                        <div class="tab-pane fade" id="profile" role="tabpanel" aria-labelledby="profile-tab">

                            <div className='' >
                                <div className='mobile-detail p-2'>
                                    <div className='py-4'>
                                        <h4 className='mb-0 sign-intru' style={{ textTransform: "capitalize" }}>IF YOU ARE NEW USER PLEASE SIGN UP</h4>
                                    </div>

                                    <div className='text-start'>
                                        <TextField id="standard-basic" className='py-2' style={{ width: "100%" }} type='text' value={value.fullname} name='fullname' label="Fullname" onChange={onhandlechange} variant="standard" />
                                        {validerr.fullname && <span className='text-danger' >{validerr.fullname}</span>}
                                        <TextField id="standard-basic" className='py-2' style={{ width: "100%" }} type='email' value={value.remail} name='remail' label="Email" onChange={onhandlechange} variant="standard" />
                                        {validerr.remail && <span className='text-danger' >{validerr.remail}</span>}
                                        {emailexist && <span className='text-danger'>Sorry you are not eligible for register</span> }
                                        <TextField id="standard-basic" className='py-2' style={{ width: "100%" }} type='number' value={value.mobile} name='mobile' label="Mobile No" onChange={onhandlechange} variant="standard" />
                                        {validerr.mobile && <span className='text-danger' >{validerr.mobile}</span>}
                                    </div>
                                </div>


                            </div>
                            <form className='py-3' onSubmit={onhandleregistersubmit}>
                                <div style={{ textAlign: "left" }}>
                                    <Checkbox sx={{
                                        padding: "10px 0px", color: "#000", '&.Mui-checked': {
                                            color: "#000",
                                        }
                                    }} {...label} checked={isChecked}
                                        onChange={handleChange2} /> <span style={{ fontSize: "12px" }}>Accept Terms and Condition</span>


                                    {validerr.checked && <span style={{ fontSize: "10px", padding: "2px" }} className='text-danger' >({validerr.checked})</span>}

                                </div>



                                <div style={{ position: "relative" }}>

                                    <button type='submit' className='reg-btn ' onClick={handleGenerateOTP}>
                                        <span >REQUEST OTP</span>
                                    </button>
                                    <i className="bi bi-caret-right-fill arrow-btn2"></i>
                                </div>
                            </form>


                        </div>



                    </div>
                    {hide ? <div>
                        <div className='py-4'>
                            <h4 className=' sign-intru' style={{ textTransform: "capitalize" }}>OTP SEND ON YOUR OFFICIAL REGISTER EMAIL</h4>
                            <h4 className='mb-0 otp-intru' style={{ textTransform: "capitalize" }}>ENTER 4 DIGIT OTP</h4>
                        </div>


                        <div className='reg-main px-3'>
                            <form onSubmit={onhandleOTPsubmit} method='POST'>



                                <div className=' mobile-detail mob-box'>

                                    <div className='otp-box d-flex justify-content-between'>
                                        <input type='number' maxLength='1' name='otp1' ref={otp1Ref} onChange={onHandleotpChange} />
                                        <input type='number' maxLength='1' name='otp2' ref={otp2Ref} onChange={onHandleotpChange} />
                                        <input type='number' maxLength='1' name='otp3' ref={otp3Ref} onChange={onHandleotpChange} />
                                        <input type='number' maxLength='1' name='otp4' ref={otp4Ref} onChange={onHandleotpChange} />
                                    </div>
                                    <div className='text-start'>
                                        {/* <p className='col-6'>1.45 secs Time remaining</p> */}
                                        {/* <p className=' text-end' onClick={handleGenerateOTP}>Re-send OTP</p> */}
                                        {otperror && <span className='text-danger' >Invalid OTP</span>}

                                    </div>
                                </div>
                                <div className='text-center btn-sec' >
                                    <div className='text-center' style={{ position: "relative" }}>
                                        <button type='submit' className='Verify-btn'>
                                            Verify
                                        </button>

                                        <i className="bi bi-caret-right-fill arrow-btn"></i>
                                    </div>

                                    <p className='text-danger' id="err"></p>
              




                                </div>
                            </form>
                        </div>
                    </div> : null}


                </div>




            </div>
        </div>
    )
}

export default Login