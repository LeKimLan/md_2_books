import { createSlice } from "@reduxjs/toolkit";

const accountSlice = createSlice({
    name: "account",
    initialState: {
        data: null,
    },
    reducers: {
        setData: (state, action) => {
            state.data = action.payload
        }
    }
})

export const accountReducer = accountSlice.reducer;
export const accountAction = accountSlice.actions;