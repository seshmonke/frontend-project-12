/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

const initialState = { active: false, type: undefined };

const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    showModal: (state, action) => {
      console.log('modal action', action);
      state.active = true;
      state.type = action.payload;
    },
    closeModal: (state) => {
      state.active = false;
      state.type = undefined;
    },
  },
});

export const { showModal, closeModal } = modalSlice.actions;

export default modalSlice.reducer;
