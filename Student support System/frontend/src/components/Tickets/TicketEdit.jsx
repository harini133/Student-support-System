import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import { updateTicket } from "../../redux/ticketSlice";
import { getCategories } from "../../redux/categorySlice";

function TicketEdit() {
  const { id } = useParams();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { tickets } = useSelector(
    (state) => state.tickets
  );

  const { categories } = useSelector(
    (state) => state.categories
  );

  const ticket = tickets.find(
    (item) => item.id === Number(id)
  );

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    priority: "Medium",
    status: "Open",
  });

  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);

  useEffect(() => {
    if (ticket) {
      setFormData({
        title: ticket.title,
        description: ticket.description,
        category: ticket.category,
        priority: ticket.priority,
        status: ticket.status,
      });
    }
  }, [ticket]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      await dispatch(
        updateTicket({
          id: Number(id),
          data: formData,
        })
      ).unwrap();

      alert("Ticket updated successfully");

      navigate("/tickets");
    } catch (error) {
      console.log(error);
      alert("Ticket update failed");
    }
  };

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

      <div className="ticket-form-container">

        <h1>Edit Ticket</h1>

        <p>Update student support ticket</p>

        <form onSubmit={handleSubmit}>

          <div className="form-group">
            <label>Title</label>

            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Description</label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Category</label>

            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="">
                Select Category
              </option>

              {categories.map((category) => (
                <option
                  key={category.id}
                  value={category.id}
                >
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Priority</label>

            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Urgent">Urgent</option>
            </select>
          </div>

          <div className="form-group">
            <label>Status</label>

            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="Open">Open</option>
              <option value="Assigned">Assigned</option>
              <option value="In Progress">
                In Progress
              </option>
              <option value="Pending">Pending</option>
              <option value="Resolved">Resolved</option>
              <option value="Closed">Closed</option>
            </select>
          </div>

          <button type="submit">
            Update Ticket
          </button>

        </form>

      </div>

    </div>
  );
}

export default TicketEdit;