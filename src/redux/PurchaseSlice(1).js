import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    value: [],
    fStartDate:"",
    fEndDate:""
}

const purchaseSlice = createSlice({
    name: "purchase",
    initialState,
    reducers: {
        addPurchase: (state, action) => {
            action.payload?.forEach((e) => {
                state.value.push(e)
            })
        },
        setPurchaseFStartDate:(state,action) => {
            state.fStartDate = action.payload;
        },
        setPurchaseFEndDate:(state,action) => {
            state.fEndDate = action.payload;
        }
    }
})
export default purchaseSlice.reducer;
export const { addPurchase,setPurchaseFEndDate,setPurchaseFStartDate } = purchaseSlice.actions;