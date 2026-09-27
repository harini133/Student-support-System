import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getTickets, deleteTicket } from "../../redux/ticketSlice";

function TicketList() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { tickets, loading, error } = useSelector(
    (state) => state.tickets
  );

  useEffect(() => {
    dispatch(getTickets());
  }, [dispatch]);

  const handleDelete = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this ticket?"
    );

    if (confirmDelete) {
      dispatch(deleteTicket(id));
    }
  };

  if (loading) {
    return <p>Loading tickets...</p>;
  }

  if (error) {
    return <p>{JSON.stringify(error)}</p>;
  }

  return (
    <div className="ticket-page">
      <div className="ticket-header">
        <div>
          <h1>Tickets</h1>
          <p>Manage student support tickets</p>
        </div>

       <button
  className="create-ticket-btn"
  onClick={() => navigate("/tickets/create")}
>
  Create Ticket
</button>
      </div>

      <div className="ticket-table-container">
        <table className="ticket-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Category</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Created Date</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {tickets.length === 0 ? (
              <tr>
                <td colSpan="7">No tickets found</td>
              </tr>
            ) : (
              tickets.map((ticket) => (
                <tr key={ticket.id}>
                  <td>{ticket.id}</td>

                  <td>{ticket.title}</td>

                  <td>{ticket.category}</td>

                  <td>{ticket.priority}</td>

                  <td>{ticket.status}</td>

                  <td>
                    {new Date(ticket.created_at).toLocaleDateString()}
                  </td>

                  <td>
                  <button
  className="view-btn"
  onClick={() => navigate(`/tickets/${ticket.id}`)}
>
  View
</button>

                    <button
  className="edit-btn"
  onClick={() =>
    navigate(`/tickets/${ticket.id}/edit`)
  }
>
  Edit
</button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(ticket.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TicketList;