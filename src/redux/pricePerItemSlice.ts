// pricePerItemSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';

// Define a type for the price per item store
type PricePerItemStore = {
    [index: number]: { pricePerItem: number; itemName: string };
};

// Define a type for the slice state
interface PricePerItemState {
    pricePerItemStore: PricePerItemStore;
}

// Define the initial state using that type
const initialState: PricePerItemState = {
    pricePerItemStore: {},
};

export const pricePerItemSlice = createSlice({
    name: 'pricePerItem',
    initialState,
    reducers: {
        updatePricePerItemStore: (state, action: PayloadAction<{ lines: string[] }>) => {
            const { lines } = action.payload;
            lines.forEach((originalLine, index) => {
                const originalNumberMatch = originalLine.match(/\d+/);
                const originalPriceMatch = originalLine.match(/\$\d+(\.\d{2})?/);

                if (originalNumberMatch && originalPriceMatch) {
                    const originalNumber = parseInt(originalNumberMatch[0], 10);
                    const originalPrice = parseFloat(originalPriceMatch[0].substring(1));
                    const itemName = originalLine.replace(/\d+/g, '').trim();

                    state.pricePerItemStore[index] = {
                        pricePerItem: originalPrice / originalNumber,
                        itemName: itemName
                    };
                }
            });
        },
        resetPricePerItemStore: (state) => {
            state.pricePerItemStore = {};
        },
        // dd more reducers here as needed
    },
});

export const { updatePricePerItemStore, resetPricePerItemStore } = pricePerItemSlice.actions;

// Selector
export const selectPricePerItemStore = (state: RootState) => state.pricePerItem.pricePerItemStore;

export default pricePerItemSlice.reducer;