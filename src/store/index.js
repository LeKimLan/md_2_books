import { configureStore } from "@reduxjs/toolkit";
import { userReducer } from "./slices/user.slice";
import { productReducer } from "./slices/product.slice";
import {categoryReducer} from './slices/category.slice'
import { commentReducer } from "./slices/comment.slice";
import {accountReducer} from "./slices/account.slice";
export const store = configureStore({
    reducer: {
        userStore: userReducer,
        productStore: productReducer,
        categoryStore: categoryReducer,
        commentStore: commentReducer,
        accountStore: accountReducer,
    }
})