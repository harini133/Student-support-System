import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import { updateTicket } from "../../redux/ticketSlice";
import { getCategories } from "../../redux/categorySlice";
import { getStaff } from "../../redux/staffSlice";
import CommonAlert from "../../components/CommonAlert/CommonAlert";

function TicketEdit() {
  const { id } = useParams();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [alert, setAlert] = useState(null);

  const { tickets } = useSelector(
    (state) => state.tickets
  );

  const { categories } = useSelector(
    (state) => state.categories
  );

  const { staff } = useSelector(
    (state) => state.staff
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
    assigned_staff: "",
    pending_reason: "",
    resolution_remarks: "",
  });

  useEffect(() => {
    dispatch(getCategories());
    dispatch(getStaff());
  }, [dispatch]);

  useEffect(() => {
    if (ticket) {
      setFormData({
        title: ticket.title,
        description: ticket.description,
        category: ticket.category,
        priority: ticket.priority,
        status: ticket.status,
        assigned_staff: ticket.assigned_staff || "",
        pending_reason: ticket.pending_reason || "",
        resolution_remarks:  ticket.resolution_remarks||"",
      });
    }
  }, [ticket]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  const handleStatusChange = (event) => {
    const status = event.target.value;

    setFormData((previousData) => ({
      ...previousData,
      status,
      pending_reason:
        status === "Pending"
          ? previousData.pending_reason
          : "",
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Pending reason validation
   // Pending reason validation
if (
  formData.status === "Pending" &&
  !formData.pending_reason.trim()
) {
  alert("Please enter a pending reason.");
  return;
}

// Staff required for Assigned/In Progress
if (
  (formData.status === "Assigned" ||
    formData.status === "In Progress") &&
  !formData.assigned_staff
) {
  alert("Please assign a staff member.");
  return;
}

// Resolution remarks required for Resolved
if (
  formData.status === "Resolved" &&
  !formData.resolution_remarks.trim()
) {
  alert("Please enter resolution remarks.");
  return;
}

   

    try {
      await dispatch(
        updateTicket({
          id: Number(id),
          data: {
            ...formData,
            category: Number(formData.category),
            assigned_staff:
              formData.assigned_staff
                ? Number(formData.assigned_staff)
                : null,
            pending_reason:
              formData.status === "Pending"
                ? formData.pending_reason.trim()
                : null,
            resolution_remarks:
              formData.status === "Resolved"
                ? formData.resolution_remarks.trim()
                : null,
          },
        })
      ).unwrap();

      setAlert({
  type: "success",
  title: "Updated Successfully",
  message: "Ticket has been updated successfully.",
});

      
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
{alert && (
  <CommonAlert
    type={alert.type}
    title={alert.title}
    message={alert.message}
    onClose={() => {
      setAlert(null);
      navigate("/tickets");
    }}
  />
)}
      <div className="ticket-form-container">
        <div className="ticket-form-heading">
          <div>
            <h1>Edit Ticket</h1>
            <p>Update student support ticket</p>
          </div>
          <button type="button" className="back-to-list-btn" onClick={() => navigate("/tickets")}>
            Back to List
          </button>
        </div>

        <form onSubmit={handleSubmit}>

          {/* Title */}
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

          {/* Description */}
          <div className="form-group">
            <label>Description</label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>

          {/* Category */}
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

              {categories
                .filter((category) => category.is_active)
                .map((category) => (
                  <option
                    key={category.id}
                    value={category.id}
                  >
                    {category.name}
                  </option>
                ))}
            </select>
          </div>

          {/* Priority */}
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

          {/* Status */}
          <div className="form-group">
            <label>Status</label>

            <select
              name="status"
              value={formData.status}
              onChange={handleStatusChange}
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

          {/* Assigned Staff */}
          <div className="form-group">
            <label>Assigned Staff</label>

            <select
              name="assigned_staff"
              value={formData.assigned_staff}
              onChange={handleChange}
            >
              <option value="">
                Select Staff
              </option>

              {staff
                .filter((member) => member.is_active)
                .map((member) => (
                  <option
                    key={member.id}
                    value={member.id}
                  >
                    {member.name} - {member.department}
                  </option>
                ))}
            </select>
          </div>

          {/* Pending Reason */}
          {formData.status === "Pending" && (
            <div className="form-group">
              <label>Pending Reason</label>

              <textarea
                name="pending_reason"
                placeholder="Enter reason for pending"
                value={formData.pending_reason}
                onChange={handleChange}
                required
              />

              <small>
                Please mention why this ticket is currently pending.
              </small>
            </div>
          )}

          {formData.status === "Resolved" && (
  <div className="form-group">
    <label>Resolution Remarks</label>

    <textarea
      value={formData.resolution_remarks}
      onChange={(e) =>
        setFormData({
          ...formData,
          resolution_remarks: e.target.value,
        })
      }
      placeholder="Enter resolution remarks"
      rows="4"
    />
  </div>
)}

          <div className="ticket-form-actions">
            <button type="submit" className="create-ticket-btn">
              Update
            </button>
          </div>

        </form>

      </div>

    </div>
  );
}

export default TicketEdit;
