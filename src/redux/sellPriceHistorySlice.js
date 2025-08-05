import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    value: []
}

const sellPriceHistorySlice = createSlice({
    name: "sellPriceHistory",
    initialState,
    reducers: {
        addSellHistory: (state, action) => {
            action.payload.forEach(element => {
                state.value.push(element)
            });
        }
    }
})

export default sellPriceHistorySlice.reducer;
export const { addSellHistory } = sellPriceHistorySlice.actions;