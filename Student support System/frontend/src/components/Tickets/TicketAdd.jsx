import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { createTicket } from "../../redux/ticketSlice";
import { getCategories } from "../../redux/categorySlice";

function TicketCreate() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

const { categories } = useSelector(
  (state) => state.categories
);

useEffect(() => {
  dispatch(getCategories());
}, [dispatch]);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    priority: "Medium",
    status: "Open",
  });

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
      await dispatch(createTicket(formData)).unwrap();

      alert("Ticket created successfully");

      navigate("/tickets");
    } catch (error) {
      console.log(error);
      alert("Ticket creation failed");
    }
  };

  return (
    <div className="ticket-page">
      <div className="ticket-form-container">

        <h1>Create Ticket</h1>
        <p>Create a new student support request</p>

        <form onSubmit={handleSubmit}>

          <div className="form-group">
            <label>Title</label>

            <input
              type="text"
              name="title"
              placeholder="Enter ticket title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Description</label>

            <textarea
              name="description"
              placeholder="Enter ticket description"
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
    <option value="">Select Category</option>

    {categories.map((category) => (
      <option key={category.id} value={category.id}>
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

          <button type="submit">
            Create Ticket
          </button>

        </form>
      </div>
    </div>
  );
}

export default TicketCreate;