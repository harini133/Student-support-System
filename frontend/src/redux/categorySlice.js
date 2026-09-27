import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const baseURL = "http://127.0.0.1:8000/api";

// Get Categories
export const getCategories = createAsyncThunk(
  "categories/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${baseURL}/categories/`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Error fetching categories"
      );
    }
  }
);

// Create Category
export const createCategory = createAsyncThunk(
  "categories/create",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${baseURL}/categories/`,
        data
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Category creation failed"
      );
    }
  }
);

// Update Category
export const updateCategory = createAsyncThunk(
  "categories/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${baseURL}/categories/${id}/`,
        data
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Category update failed"
      );
    }
  }
);

// Deactivate Category
export const deactivateCategory = createAsyncThunk(
  "categories/deactivate",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.patch(
        `${baseURL}/categories/${id}/`,
        {
          is_active: false,
        }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Category deactivation failed"
      );
    }
  }
);

const categorySlice = createSlice({
  name: "categories",

  initialState: {
    loading: false,
    categories: [],
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder

      // GET CATEGORIES
      .addCase(getCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })

      .addCase(getCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // CREATE CATEGORY
      .addCase(createCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(createCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.categories.push(action.payload);
      })

      .addCase(createCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // UPDATE CATEGORY
      .addCase(updateCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(updateCategory.fulfilled, (state, action) => {
        state.loading = false;

        const index = state.categories.findIndex(
          (category) => category.id === action.payload.id
        );

        if (index !== -1) {
          state.categories[index] = action.payload;
        }
      })

      .addCase(updateCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // DEACTIVATE CATEGORY
      .addCase(deactivateCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(deactivateCategory.fulfilled, (state, action) => {
        state.loading = false;

        const index = state.categories.findIndex(
          (category) => category.id === action.payload.id
        );

        if (index !== -1) {
          state.categories[index] = action.payload;
        }
      })

      .addCase(deactivateCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default categorySlice.reducer;