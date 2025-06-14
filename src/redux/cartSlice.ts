import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type Product = {
  _id: string;
  name: string;
  price: number;
  image: string;
  [key: string]: any;
};

type CartItem = Product & { qty: number };

type CartState = {
  items: CartItem[];
};

const initialState: CartState = {
  items: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<Product>) => {
      const exists = state.items.find((item) => item._id === action.payload._id);
      if (!exists) {
        state.items.push({ ...action.payload, qty: 1 });
      }
    },
    incrementQty: (state, action: PayloadAction<string>) => {
      const item = state.items.find((item) => item._id === action.payload);
      if (item) item.qty += 1;
    },
    decrementQty: (state, action: PayloadAction<string>) => {
      const item = state.items.find((item) => item._id === action.payload);
      if (item) {
        if (item.qty > 1) {
          item.qty -= 1;
        } else {
          state.items = state.items.filter((i) => i._id !== action.payload);
        }
      }
    },
    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const { addToCart, incrementQty, decrementQty, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
