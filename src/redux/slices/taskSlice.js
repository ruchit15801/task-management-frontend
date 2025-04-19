import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    tasks: [],
    loading: false,
    error: null,
};

const taskSlice = createSlice({
    name: "books",
    initialState,
    reducers: {
        setTasks: (state, action) => {
            state.tasks = action.payload;
            state.loading = false;
            state.error = null;
        },
        setLoading: (state) => {
            state.loading = true;
        },
        setError: (state, action) => {
            state.tasks = [];
            state.error = action.payload;
            state.loading = false;
        },
    },
});

export const { setTasks, setLoading, setError } = taskSlice.actions;
export default taskSlice.reducer;