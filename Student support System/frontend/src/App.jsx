import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./components/Login/Login";
import Dashboard from "./components/Dashboard/dashboard";
import TicketList from "./components/Tickets/TicketList";
import TicketCreate from "./components/Tickets/TicketAdd";
import TicketDetails from "./components/Tickets/TicketDetails";
import TicketEdit from "./components/Tickets/TicketEdit";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/tickets" element={<TicketList />} />
        <Route path="/tickets/create" element={<TicketCreate />} />
        <Route path="/tickets/:id" element={<TicketDetails />}/>
        <Route path="/tickets/:id/edit" element={<TicketEdit />} />
      </Routes>
    </Router>
  );
}

export default App;