import axios from 'axios';
import { CartActions } from './CartSlice';
import { BASE_URL } from '../Utils/BaseUrl';

export const getCartCount = (data) => {


    return async (dispatch) => {
        axios.post(`${BASE_URL}/getcartcount`,
            {
                order_id: localStorage.getItem('orderid'),
            })
            
            .then((response) => {
              
                dispatch(CartActions.cartcount(response.data[0].count))

            }).catch((error) => {
                console.log(error);
            })
    }
}