import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getListProducts } from 'src/actions';

const initialState = {
    list: [],
    status: 'loading', 
    error: null,
};

export const fetchProductsRedux = createAsyncThunk(
    'products/fetchProducts',
    async () => {
        const productRes = await getListProducts();
        return productRes; // Devuelve los datos obtenidos
    }
);

export const productSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {
        setProduct: (state, action) => {
            state.list = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProductsRedux.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchProductsRedux.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.list = action.payload; // Actualiza el estado con los datos obtenidos
            })
            .addCase(fetchProductsRedux.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    },
});

export const { setProduct } = productSlice.actions;
export default productSlice.reducer;
