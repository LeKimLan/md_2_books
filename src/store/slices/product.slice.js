import { createSlice } from "@reduxjs/toolkit";

const productSlice = createSlice({
  name: "product",
  initialState: {
    data: null,
    createModalState: false,
    updateModalState: false,
  },
  reducers: {
    setData: (state, action) => {
      state.data = action.payload;
    },
    changeStateCreateModal: (state, action) => {
      state.createModalState = !state.createModalState;
    },
    changeStateUpdateModal: (state, action) => {
      state.updateModalState = !state.updateModalState;
    },
    addNewProduct: (state, action) => {
      state.data.push(action.payload);
    },
    updateProduct: (state, action) => {
      state.data = state.data.map((item) => {
        if(item.id == action.payload.id) {
            item = action.payload
        } return item
      });
    },
  },
});

export const productReducer = productSlice.reducer;
export const productAction = productSlice.actions;
