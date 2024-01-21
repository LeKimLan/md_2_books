import { createSlice } from "@reduxjs/toolkit";

const categorySlice = createSlice({
    name: "category",
    initialState: {
        data: null,
        changeStateCreateModal: false
    },
    reducers: {
        setData: (state, action) => {
            state.data = action.payload
        },
        deleteCategory: (state, action)=> {
            
            // state.data= state.data.filter(category => category.id !== action.payload);
            return {
                ...state,
                data: state.data.filter(category => category.id !== action.payload)
            }
           
            
             
        },
        changeStateCreateModal: (state,action) => {
            state.createModalState = !state.createModalState
        },
        addNewCategory: (state, action) => {
            state.data.push(action.payload)
        }        
    }
})

export const categoryReducer = categorySlice.reducer;
export const categoryAction = categorySlice.actions;