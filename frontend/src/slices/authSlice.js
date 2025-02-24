import { createSlice } from '@reduxjs/toolkit';

const credentials = JSON.parse(window.localStorage.getItem('userId')) || {};

const initialState = {
    username: credentials.username || null,
    token: credentials.token || null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: ( state, { payload: { username, token } }) => {
            state.username = username;
            state.token = token;
        } 
    }
});

export const { setCredentials } = authSlice.actions;

export default authSlice.reducer;

export const selectCurrentUser = (state) => state.auth.username;