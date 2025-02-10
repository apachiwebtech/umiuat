import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    cartcount : '',
  
}

const Cartslice = createSlice({
    name : "Cartslice",
    initialState : initialState,

    reducers : {
        cartcount : (state, action)=>{
            const newcount = action.payload;
            state.cartcount = newcount;
        },
      
    }
})
export const CartActions = Cartslice.actions;
export default Cartslice.reducer;