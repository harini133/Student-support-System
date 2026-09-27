import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { getTickets, deleteTicket } from "../../redux/ticketSlice";
import { getCategories } from "../../redux/categorySlice";
import CommonAlert from "../../components/CommonAlert/CommonAlert";

function TicketList() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { tickets, loading, error } = useSelector(
    (state) => state.tickets
  );

  const { categories } = useSelector(
    (state) => state.categories
  );

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [alert, setAlert] = useState(null);

  // Load initial tickets and categories
  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);

  // Send API request whenever filter changes
  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(
        getTickets({
          search,
          category: categoryFilter,
          status: statusFilter,
          priority: priorityFilter,
        })
      );
    }, 300);

    return () => clearTimeout(timer);
  }, [
    dispatch,
    search,
    categoryFilter,
    statusFilter,
    priorityFilter,
  ]);

  const handleDelete = (id) => {
  setAlert({
    type: "confirm",
    title: "Delete Ticket",
    message: "Are you sure you want to delete this ticket?",
    onConfirm: async () => {
      try {
        await dispatch(deleteTicket(id)).unwrap();

        setAlert({
          type: "success",
          title: "Deleted Successfully",
          message: "Ticket has been deleted successfully.",
        });
      } catch (error) {
        setAlert({
          type: "error",
          title: "Delete Failed",
          message: "Unable to delete the ticket.",
        });
      }
    },
  });
};

  if (loading) {
    return <p>Loading tickets...</p>;
  }

  if (error) {
    return <p>{JSON.stringify(error)}</p>;
  }

  return (
    
    <div className="ticket-page">
      {alert && (
  <CommonAlert
    type={alert.type}
    title={alert.title}
    message={alert.message}
    onClose={() => setAlert(null)}
    onConfirm={alert.onConfirm}
  />
)}

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

      {/* Filters */}
      <div className="ticket-filters">

        <input
          type="text"
          placeholder="Search by title"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />

        <select
          value={categoryFilter}
          onChange={(event) =>
            setCategoryFilter(event.target.value)
          }
        >
          <option value="">All Categories</option>

          {categories.map((category) => (
            <option
              key={category.id}
              value={category.id}
            >
              {category.name}
            </option>
          ))}
        </select>

        <select
          value={statusFilter}
          onChange={(event) =>
            setStatusFilter(event.target.value)
          }
        >
          <option value="">All Status</option>
          <option value="Open">Open</option>
          <option value="Assigned">Assigned</option>
          <option value="In Progress">In Progress</option>
          <option value="Pending">Pending</option>
          <option value="Resolved">Resolved</option>
          <option value="Closed">Closed</option>
        </select>

        <select
          value={priorityFilter}
          onChange={(event) =>
            setPriorityFilter(event.target.value)
          }
        >
          <option value="">All Priority</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
          <option value="Urgent">Urgent</option>
        </select>

      </div>

      {/* Ticket Table */}
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
                <td colSpan="7">
                  No tickets found
                </td>
              </tr>
            ) : (
              tickets.map((ticket) => (
                <tr key={ticket.id}>

                  <td>{ticket.id}</td>

                  <td>{ticket.title}</td>

                  <td>{ticket.category_name}</td>

                  <td>{ticket.priority}</td>

                  <td>{ticket.status}</td>

                  <td>
                    {new Date(
                      ticket.created_at
                    ).toLocaleDateString()}
                  </td>

                  <td>

                    <button
                      className="view-btn"
                      onClick={() =>
                        navigate(`/tickets/${ticket.id}`)
                      }
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
                      onClick={() =>
                        handleDelete(ticket.id)
                      }
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