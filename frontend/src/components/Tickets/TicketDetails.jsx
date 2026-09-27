import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getTicketHistory } from "../../redux/ticketSlice";

function TicketDetails() {
  const { id } = useParams();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { tickets, history, loading, error } = useSelector(
    (state) => state.tickets
  );

 const ticket = tickets.find(
  (item) => item.id === Number(id)
);

useEffect(() => {
  dispatch(getTicketHistory(Number(id)));
}, [dispatch, id]);

  if (!ticket) {
    return (
      <div className="ticket-page">
        <h2>Ticket not found</h2>

        <button className="back-to-list-btn" onClick={() => navigate("/tickets")}>
          <span className="back-to-list-icon" aria-hidden="true">←</span>
          Back to List
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
            className="back-to-list-btn"
            onClick={() => navigate("/tickets")}
          >
            <span className="back-to-list-icon" aria-hidden="true">←</span>
            Back to List
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
            <p>{ticket.category_name}</p>
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
        <div className="ticket-history">
  <h2>Activity History</h2>

  {loading ? (
    <p>Loading history...</p>
  ) : error ? (
    <p>{JSON.stringify(error)}</p>
  ) : history.length === 0 ? (
    <p>No activity history found.</p>
  ) : (
    history.map((item) => (
      <div className="history-item" key={item.id}>
        <h4>{item.action}</h4>

        {item.old_value && (
          <p>
            <strong>From:</strong> {item.old_value}
          </p>
        )}

        {item.new_value && (
          <p>
            <strong>To:</strong> {item.new_value}
          </p>
        )}

        <small>
          {new Date(item.created_at).toLocaleString()}
        </small>
      </div>
    ))
  )}
</div>

      </div>

    </div>
  );
}

export default TicketDetails;
