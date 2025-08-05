import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    value: []
}

const StockSlice = createSlice({
    name: "stock",
    initialState,
    reducers: {
        addStock: (state, action) => {
            action.payload.forEach(element => {
                state.value.push(element)
            });
        }
    }
})

export default StockSlice.reducer;
export const { addStock } = StockSlice.actions;