import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { createCategory } from "../../redux/categorySlice";

function CategoryCreate() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading } = useSelector(
    (state) => state.categories
  );

  const [formData, setFormData] = useState({
    name: "",
    description: "",
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
      await dispatch(createCategory(formData)).unwrap();

      alert("Category added successfully");

      navigate("/categories");
    } catch (error) {
      console.log(error);
      alert("Category creation failed");
    }
  };

  return (
    <div className="ticket-page">
      <div className="ticket-form-container">
        <div className="ticket-form-heading">
        <div>
          <h1>Add Category</h1>
          <p>Add a new support ticket category</p>
        </div>
          <button type="button" className="back-to-list-btn" onClick={() => navigate("/categories")}>
            <span className="back-to-list-icon" aria-hidden="true">←</span>
            Back to List
          </button>
        </div>

        <form onSubmit={handleSubmit}>

          <div className="form-group">
            <label>Category Name</label>

            <input
              type="text"
              name="name"
              placeholder="Enter category name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Description</label>

            <textarea
              name="description"
              placeholder="Enter category description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
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
              {loading ? "Adding..." : "Add Category"}
            </button>

            <button
              type="button"
              className="cancel-btn"
              onClick={() => navigate("/categories")}
            >
              Cancel
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default CategoryCreate;
