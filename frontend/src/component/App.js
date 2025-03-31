import '../App.css';
// import Dash from './Pages/Dash';
import {
  createBrowserRouter,
  Outlet,
  useNavigate,
} from "react-router-dom";
import Footer from './Layout/Footer';
import Header from './Layout/Header';
import { App } from '@capacitor/app';
import 'bootstrap/dist/css/bootstrap.css';
import "bootstrap-icons/font/bootstrap-icons.css";
import 'bootstrap/dist/js/bootstrap.min.js'
import { lazy, Suspense, useEffect, useState } from 'react';
import { ScreenOrientation, OrientationType } from '@capawesome/capacitor-screen-orientation';
import Login from './Authentication/Login';
import MenuPage from './Pages/MenuPage';
import Cart from './Pages/Cart';
import InnerHeader from './Layout/InnerHeader';
import OrderConfirm from './Pages/OrderConfirm';
import Splash from './Pages/Splash';
import SearchPage from './Pages/SearchPage';
import VendorPage from './Pages/VendorPage';
import Profile from './Pages/Profile'
import OrderHistory from './Pages/OrderHistory';
import ProfilePage from './Pages/ProfilePage';
import OfferPage from './Pages/OfferPage';
import PaymentFailed from './Pages/PaymentFailed';
import PaymentLoader from './Pages/PayemtLoader';

const Dash = lazy(() => import('./Pages/Dash'));

const routing = createBrowserRouter([

  {
    path: '/',
    element: <MobApp />,
    children: [
      {
        path: '/',
        element: <Login />
      },
      {
        path: '/dash',
        element: <Dash />
      },
      {
        path: '/menupage/:catid',
        element: <MenuPage />
      },
      {
        path: '/vendorpage/:vendid',
        element: <VendorPage/>
      },

      {
        path: '/cart',
        element: <Cart />
      },
      {
        path: '/orderconfirm',
        element: <OrderConfirm />
      },
      {
        path: '/failed',
        element: <PaymentFailed />
      },
      {
        path: '/splash',
        element: <Splash />
      },
      {
        path: '/searchpage/:currentloc/:locid',
        element: <SearchPage />
      },
      {
        path: '/profile',
        element: <Profile />
      },
      {
        path: '/orderhistory',
        element: <OrderHistory />
      },
      {
        path: '/profilepage',
        element: <ProfilePage />
      },
      {
        path: '/offerpage',
        element: <OfferPage />
      },
      {
        path: '/ploader',
        element: <PaymentLoader />
      },
   

    ]

  }
])



function checkLocalStorageAndRedirect(navigate) {
  const pet_email = localStorage.getItem('food_id');
  if (pet_email !== null) {
    navigate('/dash'); // Redirect to dashboard if id exists in localStorage
  }
}

const portrait = async () => {
  await ScreenOrientation.lock({ type: OrientationType.PORTRAIT });
};


function MobApp() {
  const [loader, setLoader] = useState(true)
  const navigate = useNavigate()
  
  useEffect(() => {
    checkLocalStorageAndRedirect(navigate);
 
    // const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    // if (!isMobileDevice) {
    //   window.location.href = 'https://viggorventures.com/weblogin/pages_not_found.php';
      
    // }
    
    // portrait()

    App.addListener('backButton', data => {
      console.log('Restored state:', data);

      if (window.location.pathname === '/dash') {
        console.log('dont go back')
      }
      else if (window.location.pathname === '/') {
        console.log('dont go back')
      }
      else {
        navigate(-1)
      }


    });

  }, [navigate]);



  setTimeout(() => {
    setLoader(false)
  }, 3000);



  // console.log(packageJson.version, "this is the app version");
  return (
    <>
      {loader && <Splash />}
      {window.location.pathname == '/dash' && <Header />}
      {window.location.pathname == '/menupage' && <Header />}
      {window.location.pathname === '/cart' && <InnerHeader />}
      {window.location.pathname === '/orderconfirm' && <InnerHeader />}
      <Outlet />
      {window.location.pathname === '/dash'  && <Footer />}
      {window.location.pathname === '/failed'  && <Footer />}
   
    </>

  );
}

export default routing;
