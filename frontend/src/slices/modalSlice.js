/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

const initialState = { active: false, type: undefined, selectedChannelId: null };

const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    showModal: (state, action) => {
      console.log('modal action', action);
      console.log('action content', action);
      state.active = true;
      state.type = action.payload;
    },
    closeModal: (state) => {
      state.active = false;
      state.type = undefined;
      state.selectedChannelId = null;
    },
    selectChannelId: (state, action) => {
      state.selectedChannelId = action.payload;
    },
  },
});

export const { showModal, closeModal, selectChannelId } = modalSlice.actions;

export default modalSlice.reducer;
