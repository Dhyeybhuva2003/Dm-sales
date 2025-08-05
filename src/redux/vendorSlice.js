import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    value: []
}

const vendorSlice = createSlice({
    name: "vendor",
    initialState,
    reducers: {
        addVendor: (state, action) => {
            action.payload.forEach(element => {
                state.value.push(element);
            });
        },
        deleteVendor: (state, action) => {
            // console.log("---> ", action.payload);
            state.value = state.value.filter(vendor => vendor._id !== action.payload)
        }
    }
})

export default vendorSlice.reducer;
export const { addVendor, deleteVendor } = vendorSlice.actions;