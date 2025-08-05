import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    value: []
}

const clientSlice = createSlice({
    name: "client",
    initialState,
    reducers: {
        addClient: (state, action) => {
            action.payload.forEach(element => {
                state.value.push(element);
            });
        },
        deleteClients: (state, action) => {
            state.value = state.value.filter(client => action.payload !== client._id)
        }
    }
})

export default clientSlice.reducer;
export const { addClient, deleteClients } = clientSlice.actions;