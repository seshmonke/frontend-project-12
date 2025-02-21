import { createSlice } from '@reduxjs/toolkit';

const initialState = [];

const messagesSlice = createSlice({
    name: 'messages',
    initialState,
    reducers: {
        setMessages: (state, action) => {
            state.splice(0, state.length, ...action.payload);
        },
        addNewMessage: (state, action) => {
            state.push(action.payload);
        },
    }
    
});

export const { setMessages, addNewMessage } = messagesSlice.actions;

export default messagesSlice.reducer;