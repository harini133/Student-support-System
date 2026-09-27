import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const baseURL = "http://127.0.0.1:8000/api";

// ---------------- GET ALL TICKETS ----------------

export const getTickets = createAsyncThunk(
  "tickets/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${baseURL}/tickets/`);

      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || "Error fetching tickets"
      );
    }
  }
);



// ---------------- CREATE TICKET ----------------

export const createTicket = createAsyncThunk(
  "tickets/create",
  async (data, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `${baseURL}/tickets/`,
        data
      );

      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || "Ticket creation failed"
      );
    }
  }
);

// ---------------- UPDATE TICKET ----------------

export const updateTicket = createAsyncThunk(
  "tickets/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await axios.patch(
        `${baseURL}/tickets/${id}/`,
        data
      );

      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || "Ticket update failed"
      );
    }
  }
);

// ---------------- DELETE TICKET ----------------

export const deleteTicket = createAsyncThunk(
  "tickets/delete",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${baseURL}/tickets/${id}/`);

      return id;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || "Ticket delete failed"
      );
    }
  }
);

// ---------------- SLICE ----------------

const TicketSlice = createSlice({
  name: "tickets",

  initialState: {
    loading: false,
    tickets: [],
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder


    

      // GET
      .addCase(getTickets.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getTickets.fulfilled, (state, action) => {
        state.loading = false;
        state.tickets = action.payload;
      })

      .addCase(getTickets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // CREATE
      .addCase(createTicket.fulfilled, (state, action) => {
        state.tickets.push(action.payload);
      })

      .addCase(createTicket.rejected, (state, action) => {
        state.error = action.payload;
      })

      // UPDATE
      .addCase(updateTicket.fulfilled, (state, action) => {
        const index = state.tickets.findIndex(
          (item) => item.id === action.payload.id
        );

        if (index !== -1) {
          state.tickets[index] = action.payload;
        }
      })

      // DELETE
      .addCase(deleteTicket.fulfilled, (state, action) => {
        state.tickets = state.tickets.filter(
          (item) => item.id !== action.payload
        );
      });
  },
});

export default TicketSlice.reducer;