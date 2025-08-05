import { createSlice } from "@reduxjs/toolkit";
import getFinancialYearRange from "../utils/common";

const initialState = {
    fYear: getFinancialYearRange(),
    
}

const financialYear = createSlice({
    name: "fYear",
    initialState,
    reducers: {
        setFYear:(state,action) => {
            state.fYear = action.payload;
        }
    }
})

export default financialYear.reducer;
export const { setFYear } = financialYear.actions;