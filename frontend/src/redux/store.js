import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import ticketReducer from "./ticketSlice";
import categoryReducer from "./categorySlice";
import staffReducer from "./staffSlice";
import dashboardReducer from "./dashboardSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    tickets: ticketReducer,
    categories: categoryReducer,
    staff: staffReducer,
    dashboard: dashboardReducer,
  },
});

export default store;
