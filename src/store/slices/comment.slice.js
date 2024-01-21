import { createSlice } from "@reduxjs/toolkit";

const commentSlice = createSlice({
    name: "comments",
    initialState: {
        data: null,
    },
    reducers: {
        setData: (state, action) => {
            state.data = action.payload
        },
        addComment: (state, action) => {
            state.data.push(action.payload)
        }
    }
})

export const commentReducer = commentSlice.reducer;
export const commentAction = commentSlice.actions;