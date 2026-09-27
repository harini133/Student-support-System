import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const baseURL = "http://127.0.0.1:8000/api";

export const getStaff = createAsyncThunk(
  "staff/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${baseURL}/staff/`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Error fetching staff"
      );
    }
  }
);

export const createStaff = createAsyncThunk(
  "staff/create",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${baseURL}/staff/`,
        data
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Staff creation failed"
      );
    }
  }
);

export const updateStaff = createAsyncThunk(
  "staff/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${baseURL}/staff/${id}/`,
        data
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Staff update failed"
      );
    }
  }
);

export const deactivateStaff = createAsyncThunk(
  "staff/deactivate",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.patch(
        `${baseURL}/staff/${id}/`,
        {
          is_active: false,
        }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Staff deactivation failed"
      );
    }
  }
);

const staffSlice = createSlice({
  name: "staff",

  initialState: {
    loading: false,
    staff: [],
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder

      // GET STAFF
      .addCase(getStaff.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getStaff.fulfilled, (state, action) => {
        state.loading = false;
        state.staff = action.payload;
      })

      .addCase(getStaff.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // CREATE STAFF
      .addCase(createStaff.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(createStaff.fulfilled, (state, action) => {
        state.loading = false;
        state.staff.push(action.payload);
      })

      .addCase(createStaff.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // UPDATE STAFF
      .addCase(updateStaff.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(updateStaff.fulfilled, (state, action) => {
        state.loading = false;

        const index = state.staff.findIndex(
          (member) => member.id === action.payload.id
        );

        if (index !== -1) {
          state.staff[index] = action.payload;
        }
      })

      .addCase(updateStaff.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deactivateStaff.pending, (state) => {
  state.loading = true;
  state.error = null;
})

.addCase(deactivateStaff.fulfilled, (state, action) => {
  state.loading = false;

  const index = state.staff.findIndex(
    (member) => member.id === action.payload.id
  );

  if (index !== -1) {
    state.staff[index] = action.payload;
  }
})

.addCase(deactivateStaff.rejected, (state, action) => {
  state.loading = false;
  state.error = action.payload;
});
  },
});

export default staffSlice.reducer;