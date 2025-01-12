import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
  lastUpdated: null,
};

export const basketSlice = createSlice({
  name: "basket",
  initialState,
  reducers: {
    addToBasket: {
      reducer: (state, action) => {
        console.log('Adding item to basket:', action.payload);
        state.items.push(action.payload);
        state.lastUpdated = new Date().toISOString();
      },
      prepare: (item) => {
        console.log('Preparing item for basket:', item);
        return {
          payload: {
            ...item,
            addedAt: new Date().toISOString(),
          },
        };
      },
    },
    removeFromBasket: {
      reducer: (state, action) => {
        console.log('Removing item from basket:', action.payload);
        const index = state.items.findIndex(
          (basketItem) => basketItem.id === action.payload.id
        );

        if (index >= 0) {
          state.items.splice(index, 1);
          state.lastUpdated = new Date().toISOString();
          console.log('Item removed successfully');
        } else {
          console.warn(
            `Can't remove product (id: ${action.payload.id}) as its not in basket!`
          );
        }
      },
    },
    clearBasket: (state) => {
      console.log('Clearing basket');
      state.items = [];
      state.lastUpdated = new Date().toISOString();
    },
  },
});

export const { addToBasket, removeFromBasket, clearBasket } = basketSlice.actions;

// Selectors with debugging
export const selectItems = (state) => {
  console.log('Selecting items from state:', state.basket.items);
  return state.basket.items;
};

export const selectTotal = (state) => {
  const total = state.basket.items.reduce((total, item) => total + item.price, 0);
  console.log('Calculating total:', total);
  return total;
};

export default basketSlice.reducer;
