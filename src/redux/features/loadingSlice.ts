import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    state: false,
}

export const loadingSlice = createSlice({
    name: "loading",
    initialState,
    reducers: {
        setLoading: (state, action) => {  
            state.state = action.payload;
        },
    },
});

export const { setLoading } = loadingSlice.actions;
export default loadingSlice.reducer;