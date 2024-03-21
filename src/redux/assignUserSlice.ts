// userItemsSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';

// Define a type for the user state
export interface UserState {
    id: number;
    name: string;
    selectedItems: { name: string; quantity: number }[];
}

// Define the initial state using that type
const initialState: UserState[] = [];

export const userItemsSlice = createSlice({
    name: 'userItems',
    initialState,
    reducers: {
        updateUserSelectedItems: (state, action: PayloadAction<{ userId: number; selectedItems: { name: string; quantity: number }[]; userName: string }>) => {
            const { userId, selectedItems, userName } = action.payload;
            const existingUserIndex = state.findIndex(user => user.id === userId);
            if (existingUserIndex !== -1) {
                // User exists, update their selected items
                state[existingUserIndex].selectedItems = selectedItems;
            } else {
                // User doesn't exist, add them to the array
                state.push({
                    id: userId,
                    selectedItems,
                    name: userName
                });
            }
        },
        resetAllUsers: (state) => {
            return initialState;
        },
        // Add other reducers here as needed
    },
});

export const { updateUserSelectedItems, resetAllUsers } = userItemsSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectUserItems = (state: RootState) => state.userItems;

export default userItemsSlice.reducer;