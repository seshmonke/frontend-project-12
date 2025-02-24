import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    socket: null,
    isConnected: false,
    error: null,    
}

const websocketSlice = createSlice({
    name: 'websocket',
    initialState,
    reducers: {
        connectSocket: (state, action) => {
            state.socket = action.payload;
            state.isConnected = true;
        },
        disconnectSocket: (state) => {
            state.socket = null;
            state.isConnected = false;
        },
        socketError: (state, action) => {
            state.error = action.payload;
        },
    }
});

export const { connectSocket, disconnectSocket, socketError } = websocketSlice.actions;

export default websocketSlice.reducer;