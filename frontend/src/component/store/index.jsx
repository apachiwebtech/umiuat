import {configureStore} from '@reduxjs/toolkit'
import CartReducer from './CartSlice';
const store = configureStore({
    reducer : {
        cartCount : CartReducer,
    }
})

export default store;