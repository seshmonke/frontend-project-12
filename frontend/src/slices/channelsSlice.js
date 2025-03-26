import { createSlice } from '@reduxjs/toolkit';

const initialState = { list: [], currentChannel: null };

const channelsSlice = createSlice({
  name: 'channels',
  initialState,
  reducers: {
    setChannels: (state, action) => {
      state.list = action.payload;
    },
    setCurrentChannel: (state, action) => {
      state.currentChannel = action.payload;
    },
    addNewChannel: (state, action) => {
      state.list.push(action.payload);
    },
    removeChannel: (state, action) => {
      state.list = state.list.filter((channel) => channel.id !== action.payload.id);
    },
    renameChannel: (state, action) => {
      state.list.find((channel) => channel.id === action.payload.id).name = action.payload.name;
    },
  },
});

export const {
  setChannels, setCurrentChannel, addNewChannel, removeChannel, renameChannel,
} = channelsSlice.actions;

export default channelsSlice.reducer;
