import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { getTickets } from "../../redux/ticketSlice";

function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { tickets, loading, error } = useSelector(
    (state) => state.tickets
  );

  useEffect(() => {
    dispatch(getTickets());
  }, [dispatch]);

  const totalTickets = tickets.length;

  const openTickets = tickets.filter(
    (ticket) => ticket.status === "Open"
  ).length;

  const inProgressTickets = tickets.filter(
    (ticket) => ticket.status === "In Progress"
  ).length;

  const resolvedTickets = tickets.filter(
    (ticket) => ticket.status === "Resolved"
  ).length;

  const pendingTickets = tickets.filter(
    (ticket) => ticket.status === "Pending"
  ).length;

  const overdueTickets = tickets.filter(
    (ticket) => ticket.is_overdue === true
  ).length;

  if (loading) {
    return <p>Loading dashboard...</p>;
  }

  if (error) {
    return <p>{JSON.stringify(error)}</p>;
  }

  return (
    <div className="dashboard-page">

      <div className="dashboard-header">

  <div>
    <h1 className="text-pink">Dashboard</h1>
    <p className="text-light">Welcome to Student Support System</p>
  </div>

  <div>
   
  </div>

</div>

      <div className="dashboard-cards">

        <div className="dashboard-card">
          <h3>Total Tickets</h3>
          <h2>{totalTickets}</h2>
        </div>

        <div className="dashboard-card">
          <h3>Open Tickets</h3>
          <h2>{openTickets}</h2>
        </div>

        <div className="dashboard-card">
          <h3>In Progress</h3>
          <h2>{inProgressTickets}</h2>
        </div>

        <div className="dashboard-card">
          <h3>Resolved</h3>
          <h2>{resolvedTickets}</h2>
        </div>

        <div className="dashboard-card">
          <h3>Pending Tickets</h3>
          <h2>{pendingTickets}</h2>
        </div>

        <div className="dashboard-card">
          <h3>Overdue Tickets</h3>
          <h2>{overdueTickets}</h2>
        </div>

      </div>

    

    </div>
  );
}

export default Dashboard;