import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    status: false,
    userData: null,
    accessToken: '',
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login: (state, action) => {
            state.status = true;
            state.userData = action.payload;
        },
        logout: (state) => {
            state.status = false;
            state.userData = null;
            state.accessToken = '';
        },
        setToken: (state, action) => {
            state.accessToken = action.payload;
        },
    },
});

export const { login, logout, setToken } = authSlice.actions;
export default authSlice.reducer;
