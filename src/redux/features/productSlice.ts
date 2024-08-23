import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
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

export const fetchProductsRedux = createAsyncThunk(
    'products/fetchProducts',
    async () => {
        const productRes = await getListProducts();
        return productRes;
    }
);

export const addProductRedux = createAsyncThunk(
  'products/addProduct',
  async (product: Product) => {
      const result = await AddProduct(product);
      if (result.error) throw new Error(result.error);
      return { newProduct: result.newProduct, shouldClose: result.shouldClose };
  }
);


export const updateProductRedux = createAsyncThunk(
    'products/updateProduct',
    async (formData: FormData) => {
        const result = await UpdateProduct(formData);
        if (result.error) throw new Error(result.error);
        return result.newProduct;
    }
);

export const deleteProductRedux = createAsyncThunk(
    'products/deleteProduct',
    async (productId: string) => {
        await DeleteProduct(productId);
        return productId;
    }
);

export const productSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {
        // Reducers normales para actualizar el estado
        setProducts: (state, action) => {
            state.list = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
        clearError: (state) => {
            state.error = '';
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProductsRedux.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchProductsRedux.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.list = action.payload;
            })
            .addCase(fetchProductsRedux.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message ?? 'Failed to fetch products';
            })
            .addCase(addProductRedux.fulfilled, (state, action) => {
                console.log('Product added:', action.payload);
                state.list.push(action.payload.newProduct);
            })
            .addCase(addProductRedux.rejected, (state, action) => {
                state.error = action.error.message ?? 'Failed to add product';
            })
            .addCase(updateProductRedux.fulfilled, (state, action) => {
                state.list = state.list.map(product =>
                    product._id === action.payload._id ? action.payload : product
                );
            })
            .addCase(updateProductRedux.rejected, (state, action) => {
                state.error = action.error.message ?? 'Failed to update product';
            })
            .addCase(deleteProductRedux.fulfilled, (state, action) => {
                state.list = state.list.filter(product => product._id !== action.payload);
            })
            .addCase(deleteProductRedux.rejected, (state, action) => {
                state.error = action.error.message ?? 'Failed to delete product';
            });
    },
});

export const { setProducts, setError, clearError } = productSlice.actions;
export default productSlice.reducer;
