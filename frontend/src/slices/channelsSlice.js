import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    channels: []
};

const channelsSlice = createSlice({
    name: 'channels',
    initialState,
    reducers: {
        setChannels: ( state, action ) => {
            console.log('E, Пэйлоуд каналов', action.payload);
            state.channels = action.payload;
        }
    }
    
});

export const { setChannels } = channelsSlice.actions;

export default channelsSlice.reducer;