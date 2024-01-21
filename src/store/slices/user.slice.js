import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: "user",
    initialState: {
        data: null,
        cart: null,
        receipts: null,
        receiptDetailState: false,
    },
    reducers: {
        setData: (state, action) => {
            state.data = action.payload
        },
        setCart: (state, action) => {
            state.cart = action.payload
        },
        setReceipts: (state, action) => {
            state.receipts = action.payload
        },
        addReceipt: (state, action) => {
            state.receipts.push(action.payload)
        },
        changeStateReceiptModal: (state, action) => {
            state.receiptDetailState = !state.receiptDetailState;
          },
    }
})

export const userReducer = userSlice.reducer;
export const userAction = userSlice.actions;