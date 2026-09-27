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

  if (loading) {
    return <p>Loading dashboard...</p>;
  }

  if (error) {
    return <p>{JSON.stringify(error)}</p>;
  }

  return (
    <div className="dashboard-page">

      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Welcome to Student Support System</p>
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

      </div>

      <div className="recent-tickets">

        <h2>Recent Tickets</h2>

        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {tickets.slice(0, 5).map((ticket) => (
              <tr key={ticket.id}>

                <td>{ticket.id}</td>

                <td>{ticket.title}</td>

                <td>{ticket.priority}</td>

                <td>{ticket.status}</td>

                <td>
                  <button
                    className="view-btn"
                    onClick={() =>
                      navigate(`/tickets/${ticket.id}`)
                    }
                  >
                    View
                  </button>
                </td>

              </tr>
            ))}
          </tbody>
        </table>

      </div>

    </div>
  );
}

export default Dashboard;