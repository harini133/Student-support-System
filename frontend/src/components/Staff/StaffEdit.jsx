import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import { getStaff, updateStaff } from "../../redux/staffSlice";

function StaffEdit() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const { staff, loading } = useSelector(
    (state) => state.staff
  );

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    department: "",
    is_active: true,
  });

  useEffect(() => {
    dispatch(getStaff());
  }, [dispatch]);

  useEffect(() => {
    const selectedStaff = staff.find(
      (member) => member.id === Number(id)
    );

    if (selectedStaff) {
      setFormData({
        name: selectedStaff.name,
        email: selectedStaff.email,
        department: selectedStaff.department,
        is_active: selectedStaff.is_active,
      });
    }
  }, [staff, id]);

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
        updateStaff({
          id,
          data: {
            ...formData,
            is_active:
              formData.is_active === true ||
              formData.is_active === "true",
          },
        })
      ).unwrap();

      alert("Staff updated successfully");

      navigate("/staff");
    } catch (error) {
      console.log(error);
      alert("Staff update failed");
    }
  };

  return (
    <div className="ticket-page">

      <div className="ticket-header">
        <div>
          <h1>Edit Staff</h1>
          <p>Update support staff details</p>
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
              onChange={handleChange}
            >
              <option value={true}>Active</option>
              <option value={false}>Inactive</option>
            </select>
          </div>

          <div className="form-actions">
            <button
              type="submit"
              className="submit-btn"
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Staff"}
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

export default StaffEdit;
