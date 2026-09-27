import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const baseURL = "http://127.0.0.1:8000/api";

export const getDashboardSummary = createAsyncThunk(
  "dashboard/getSummary",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${baseURL}/dashboard/summary/`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Error fetching dashboard data"
      );
    }
  }
);

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState: { data: null, loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getDashboardSummary.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getDashboardSummary.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(getDashboardSummary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default dashboardSlice.reducer;
