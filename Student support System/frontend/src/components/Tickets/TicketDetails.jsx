import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

function TicketDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { tickets } = useSelector(
    (state) => state.tickets
  );

  const ticket = tickets.find(
    (item) => item.id === Number(id)
  );

  if (!ticket) {
    return (
      <div className="ticket-page">
        <h2>Ticket not found</h2>

        <button onClick={() => navigate("/tickets")}>
          Back to Tickets
        </button>
      </div>
    );
  }

  return (
    <div className="ticket-page">

      <div className="ticket-details-container">

        <div className="ticket-details-header">
          <div>
            <h1>Ticket Details</h1>
            <p>View support ticket information</p>
          </div>

          <button
            onClick={() => navigate("/tickets")}
          >
            Back to Tickets
          </button>
        </div>

        <div className="ticket-details">

          <div className="detail-item">
            <label>Ticket ID</label>
            <p>{ticket.id}</p>
          </div>

          <div className="detail-item">
            <label>Title</label>
            <p>{ticket.title}</p>
          </div>

          <div className="detail-item">
            <label>Description</label>
            <p>{ticket.description}</p>
          </div>

          <div className="detail-item">
            <label>Category</label>
            <p>{ticket.category}</p>
          </div>

          <div className="detail-item">
            <label>Priority</label>
            <p>{ticket.priority}</p>
          </div>

          <div className="detail-item">
            <label>Status</label>
            <p>{ticket.status}</p>
          </div>

          <div className="detail-item">
            <label>Created Date</label>
            <p>
              {new Date(
                ticket.created_at
              ).toLocaleString()}
            </p>
          </div>

          <div className="detail-item">
            <label>Updated Date</label>
            <p>
              {new Date(
                ticket.updated_at
              ).toLocaleString()}
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}

export default TicketDetails;