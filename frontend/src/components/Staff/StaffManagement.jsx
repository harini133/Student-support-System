import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
  getStaff,
  deactivateStaff,
} from "../../redux/staffSlice";

function StaffManagement() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { staff, loading, error } = useSelector(
    (state) => state.staff
  );

  useEffect(() => {
    dispatch(getStaff());
  }, [dispatch]);

  const handleDeactivate = async (id) => {
    const confirmDeactivate = window.confirm(
      "Are you sure you want to deactivate this staff member?"
    );

    if (!confirmDeactivate) {
      return;
    }

    try {
      await dispatch(deactivateStaff(id)).unwrap();

      alert("Staff deactivated successfully");
    } catch (error) {
      console.log(error);
      alert("Staff deactivation failed");
    }
  };

  if (loading) {
    return <p>Loading staff...</p>;
  }

  if (error) {
    return <p>{JSON.stringify(error)}</p>;
  }

  return (
    <div className="ticket-page">

      <div className="ticket-header">
        <div>
          <h1>Staff Management</h1>
          <p>Manage support staff members</p>
        </div>

        <button
          className="create-ticket-btn"
          onClick={() => navigate("/staff/create")}
        >
          Add Staff
        </button>
      </div>

      <div className="ticket-table-container">

        <table className="ticket-table">

          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Department</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>

            {staff.length === 0 ? (
              <tr>
                <td colSpan="6">
                  No staff found
                </td>
              </tr>
            ) : (
              staff.map((member) => (
                <tr key={member.id}>

                  <td>{member.id}</td>

                  <td>{member.name}</td>

                  <td>{member.email}</td>

                  <td>{member.department}</td>

                  <td>
                    {member.is_active
                      ? "Active"
                      : "Inactive"}
                  </td>

                  <td>

                    <button
                      className="edit-btn"
                      onClick={() =>
                        navigate(`/staff/${member.id}/edit`)
                      }
                    >
                      Edit
                    </button>

                    {member.is_active && (
                      <button
                        className="delete-btn"
                        onClick={() =>
                          handleDeactivate(member.id)
                        }
                      >
                        Deactivate
                      </button>
                    )}

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

export default StaffManagement;