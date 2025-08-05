import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    value: [],
    // here f stand for the filter start date
    fStartDate:"",
    fEndDate:""
}

const SellSlice = createSlice({
    name: "sell",
    initialState,
    reducers: {
        addSell: (state, action) => {
            action.payload.forEach(element => {
                state.value.push(element);
            });
        },
        setSellFStartDate:(state,action) => {
            state.fStartDate = action.payload;
        },
        setSellFEndDate:(state,action) => {
            state.fEndDate = action.payload;
        }
    }
})

export default SellSlice.reducer;
export const { addSell,setSellFEndDate,setSellFStartDate } = SellSlice.actions;