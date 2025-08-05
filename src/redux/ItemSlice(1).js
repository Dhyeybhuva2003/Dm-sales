import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    value: []
}

const itemSlice = createSlice({
    name: "items",
    initialState,
    reducers: {
        addItems: (state, action) => {
            action.payload.forEach(element => {
                state.value.push(element)
            });
        }
    }
})

export default itemSlice.reducer;
export const { addItems } = itemSlice.actions;