// src/redux/features/productSlice.ts
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getListProducts, DeleteProduct, AddProduct, UpdateProduct } from 'src/actions';


interface ProductState {
    list: Product[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string;
}

const initialState: ProductState = {
    list: [],
    status: 'idle',
    error: '',
};

export const fetchProductsRedux = createAsyncThunk<Product[]>(
    'products/fetchProducts',
    async () => {
        const productRes = await getListProducts();
        return productRes;
    }
);

export const addProductRedux = createAsyncThunk<Product, FormData>(
    'products/addProduct',
    async (formData) => {
        const result = await AddProduct({}, formData);
        if (result.error) throw new Error(result.error);
        return result.newProduct;
    }
);

export const updateProductRedux = createAsyncThunk<Product, FormData>(
    'products/updateProduct',
    async (formData) => {
        const result = await UpdateProduct({}, formData);
        if (result.error) throw new Error(result.error);
        return result.newProduct;
    }
);

export const deleteProductRedux = createAsyncThunk<string, string>(
    'products/deleteProduct',
    async (productId) => {
        await DeleteProduct(productId);
        return productId;
    }
);

const productSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {
        setProducts: (state, action: PayloadAction<Product[]>) => {
            state.list = action.payload;
        },
        setError: (state, action: PayloadAction<string>) => {
            state.error = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProductsRedux.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchProductsRedux.fulfilled, (state, action: PayloadAction<Product[]>) => {
                state.status = 'succeeded';
                state.list = action.payload;
            })
            .addCase(fetchProductsRedux.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message ?? 'Failed to fetch products';
            })
            .addCase(addProductRedux.fulfilled, (state, action: PayloadAction<Product>) => {
                state.list.push(action.payload);
            })
            .addCase(addProductRedux.rejected, (state, action) => {
                state.error = action.error.message ?? 'Failed to add product';
            })
            .addCase(updateProductRedux.fulfilled, (state, action: PayloadAction<Product>) => {
                state.list = state.list.map(product =>
                    product._id === action.payload._id ? action.payload : product
                );
            })
            .addCase(updateProductRedux.rejected, (state, action) => {
                state.error = action.error.message ?? 'Failed to update product';
            })
            .addCase(deleteProductRedux.fulfilled, (state, action: PayloadAction<string>) => {
                state.list = state.list.filter(product => product._id !== action.payload);
            })
            .addCase(deleteProductRedux.rejected, (state, action) => {
                state.error = action.error.message ?? 'Failed to delete product';
            });
    },
});

export const { setProducts, setError } = productSlice.actions;
export default productSlice.reducer;
