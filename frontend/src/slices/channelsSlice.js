import { createSlice } from '@reduxjs/toolkit';

const initialState = { list: [], currentChannel: null };

const channelsSlice = createSlice({
    name: 'channels',
    initialState,
    reducers: {
        setChannels: (state, action) => {
            console.log('E, Пэйлоуд каналов', action.payload);
            state.list = action.payload;
            const [firstChannel] = state.list;
            state.currentChannel = firstChannel || null;
        },
        setCurrentChannel: (state, action) => {
            state.currentChannel = action.payload;
        },
    }
});

export const { setChannels } = channelsSlice.actions;

export default channelsSlice.reducer;