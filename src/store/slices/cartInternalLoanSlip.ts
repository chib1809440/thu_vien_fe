import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CreatePublication } from '../../types/models/loanSlip.type';

interface CartState {
    items: CreatePublication[];
}

const initialState: CartState = {
    items: [],
};

const cartInternalSlice = createSlice({
    name: 'cartInternalLoanSlip',
    initialState,
    reducers: {
        addInternalItem: (state, action: PayloadAction<CreatePublication>) => {
            const existingItemIndex = state.items.findIndex(item => item.publicationId === action.payload.publicationId);
            // Nếu item đã tồn tại, không làm gì (return)
            if (existingItemIndex !== -1) {
                return; // Hoặc có thể console.log thông báo nếu cần
            }
            state.items.push(action.payload);
        },
        removeInternalItem: (state, action: PayloadAction<string>) => {
            state.items = state.items.filter(item => item.publicationId !== action.payload);
        },
        updateInternalItem: (state, action: PayloadAction<CreatePublication>) => {
            const index = state.items.findIndex(item => item.publicationId === action.payload.publicationId);
            if (index !== -1) {
                state.items[index] = action.payload;
            }
        },
        clearInternalCart: (state) => {
            state.items = [];
        },
    },
});

// Export các action
export const { addInternalItem, removeInternalItem, updateInternalItem, clearInternalCart } = cartInternalSlice.actions;

// Export reducer để sử dụng trong store
export default cartInternalSlice.reducer;
