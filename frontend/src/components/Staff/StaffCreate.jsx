import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { createStaff } from "../../redux/staffSlice";

function StaffCreate() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading } = useSelector((state) => state.staff);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    department: "",
    is_active: true,
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
      await dispatch(createStaff(formData)).unwrap();

      alert("Staff added successfully");

      navigate("/staff");
    } catch (error) {
      console.log(error);
      alert("Staff creation failed");
    }
  };

  return (
    <div className="ticket-page">

      <div className="ticket-header">
        <div>
          <h1>Add Staff</h1>
          <p>Add a new support staff member</p>
        </div>
      </div>

      <div className="ticket-form-container">

        <form onSubmit={handleSubmit}>

          <div className="form-group">
            <label>Name</label>

            <input
              type="text"
              name="name"
              placeholder="Enter staff name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Email</label>

            <input
              type="email"
              name="email"
              placeholder="Enter staff email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Department</label>

            <input
              type="text"
              name="department"
              placeholder="Enter department"
              value={formData.department}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Status</label>

            <select
              name="is_active"
              value={formData.is_active}
              onChange={(event) =>
                setFormData({
                  ...formData,
                  is_active: event.target.value === "true",
                })
              }
            >
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>

          <div className="form-actions">
            <button
              type="submit"
              className="submit-btn"
              disabled={loading}
            >
              {loading ? "Adding..." : "Add Staff"}
            </button>

            <button
              type="button"
              className="cancel-btn"
              onClick={() => navigate("/staff")}
            >
              Cancel
            </button>
          </div>

        </form>

      </div>

    </div>
  );
}

export default StaffCreate;
