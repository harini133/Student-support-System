import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";

import Login from "./components/Login/Login";
import Dashboard from "./components/Dashboard/dashboard";
import TicketList from "./components/Tickets/TicketList";
import TicketCreate from "./components/Tickets/TicketAdd";
import TicketDetails from "./components/Tickets/TicketDetails";
import TicketEdit from "./components/Tickets/TicketEdit";
import StaffManagement from "./components/Staff/StaffManagement";
import StaffCreate from "./components/Staff/StaffCreate";
import StaffEdit from "./components/Staff/StaffEdit";
import CategoryManagement from "./components/Category/CategoryManagement";
import CategoryCreate from "./components/Category/CategoryCreate";
import CategoryEdit from "./components/Category/CategoryEdit";
import Header from "./components/Header/Header";

function App() {
  return (
    <Router>
      <Header />
      <Routes>

        <Route
          path="/"
          element={<Login />}
        />

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        <Route
          path="/tickets"
          element={<TicketList />}
        />

        <Route
          path="/tickets/create"
          element={<TicketCreate />}
        />

        <Route
          path="/tickets/:id"
          element={<TicketDetails />}
        />

        <Route
          path="/tickets/:id/edit"
          element={<TicketEdit />}
        />

        <Route
  path="/staff"
  element={<StaffManagement />}
/>

<Route
  path="/staff/create"
  element={<StaffCreate />}
/>

<Route
  path="/staff/:id/edit"
  element={<StaffEdit />}
/>

<Route
  path="/categories"
  element={<CategoryManagement />}
/>

<Route
  path="/categories/create"
  element={<CategoryCreate />}
/>
<Route
  path="/categories/:id/edit"
  element={<CategoryEdit />}
/>
      </Routes>
    </Router>
  );
}

export default App;