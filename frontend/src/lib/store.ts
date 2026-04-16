import { configureStore } from "@reduxjs/toolkit"
import authReducer from "./slices/authSlice"
import orderReducer from "./slices/orderSlice"
import recipeReducer from "./slices/recipeSlice"
import consultationReducer from "./slices/consultationSlice"

export const makeStore = () =>
  configureStore({
    reducer: {
      auth: authReducer,
      orders: orderReducer,
      recipes: recipeReducer,
      consultations: consultationReducer,
    },
  })

export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore["getState"]>
export type AppDispatch = AppStore["dispatch"]
