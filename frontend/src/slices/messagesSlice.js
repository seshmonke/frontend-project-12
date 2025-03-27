/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

const initialState = { list: [] };

const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    setMessages: (state, action) => {
      state.list = action.payload;
    },
    addNewMessage: (state, action) => {
      state.list.push(action.payload);
    },
    removeChannelMessages: (state, action) => {
      state.list = state.list.filter((message) => message.channelId !== action.payload.id);
    },
  },

});

export const { setMessages, addNewMessage, removeChannelMessages } = messagesSlice.actions;

export default messagesSlice.reducer;
