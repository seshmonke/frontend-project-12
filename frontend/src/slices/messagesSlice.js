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
      console.log('ПЭЙЛОУД УДАЛЕНИЯ СООБЩЕНИЙ: ', JSON.stringify(action.payload), 'СОСТОЯНИЕ СЛАЙСА СООБЩЕНИЙ', JSON.stringify(state));
    },
  },

});

export const { setMessages, addNewMessage, removeChannelMessages } = messagesSlice.actions;

export default messagesSlice.reducer;
