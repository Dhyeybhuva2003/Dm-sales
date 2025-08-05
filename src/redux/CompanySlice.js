import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    value: []
}

export const companySlice = createSlice({
    name: "companies",
    initialState,
    reducers: {
        addCompany: (state, action) => {
            action.payload.forEach(element => {
                state.value.push(element)
            });
        }
    }
})

export const { addCompany } = companySlice.actions;
export default companySlice.reducer;