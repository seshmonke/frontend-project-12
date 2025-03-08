import { createSlice } from '@reduxjs/toolkit';

const initialState = { list: [], currentChannel: null };

const channelsSlice = createSlice({
    name: 'channels',
    initialState,
    reducers: {
        setChannels: (state, action) => {
            console.log('Установка каналов в слайсе');
            state.list = action.payload;
        },
        setCurrentChannel: (state, action) => {
            console.log('Установка текущего канала в слайсе');
            state.currentChannel = action.payload;
        },
        addNewChannel: (state, action) => {
            console.log('Добавление нового канала в слайсе');
            state.list.push(action.payload);
            console.log('Состояние слайса текущего канала после добавления канала', state.currentChannel);
            
        },
        removeChannel: (state, action) => {
            console.log('removeChannel action.payload', JSON.stringify(action.payload));
            state.list = state.list.filter((channel) => channel.id !== action.payload.id);
        }
    }
});

export const { setChannels, setCurrentChannel, addNewChannel, removeChannel } = channelsSlice.actions;

export default channelsSlice.reducer;