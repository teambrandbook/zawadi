import { createSlice, PayloadAction } from "@reduxjs/toolkit"

export interface Order {
  order_id: string
  product_name: string
  pack_name: string
  pack_price: number
  quantity: number
  total_amount: number
  status: string
  payment_method: string
  payment_status: string
  created_at: string
  full_name: string
  city: string
  address: string
}

interface OrderState {
  orders: Order[]
  loading: boolean
  error: string | null
}

const initialState: OrderState = {
  orders: [],
  loading: false,
  error: null,
}

const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    setOrdersLoading(state) {
      state.loading = true
      state.error = null
    },
    setOrders(state, action: PayloadAction<Order[]>) {
      state.orders = action.payload
      state.loading = false
    },
    addOrder(state, action: PayloadAction<Order>) {
      state.orders.unshift(action.payload)
    },
    setOrdersError(state, action: PayloadAction<string>) {
      state.error = action.payload
      state.loading = false
    },
  },
})

export const { setOrdersLoading, setOrders, addOrder, setOrdersError } = orderSlice.actions
export default orderSlice.reducer
