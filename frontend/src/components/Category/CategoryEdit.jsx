import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import {
  getCategories,
  updateCategory,
} from "../../redux/categorySlice";

function CategoryEdit() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const { categories, loading } = useSelector(
    (state) => state.categories
  );

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    is_active: true,
  });

  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);

  useEffect(() => {
    const selectedCategory = categories.find(
      (category) => category.id === Number(id)
    );

    if (selectedCategory) {
      setFormData({
        name: selectedCategory.name,
        description: selectedCategory.description || "",
        is_active: selectedCategory.is_active,
      });
    }
  }, [categories, id]);

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
        updateCategory({
          id,
          data: {
            ...formData,
            is_active:
              formData.is_active === true ||
              formData.is_active === "true",
          },
        })
      ).unwrap();

      alert("Category updated successfully");

      navigate("/categories");
    } catch (error) {
      console.log(error);
      alert("Category update failed");
    }
  };

  return (
    <div className="ticket-page">

      <div className="ticket-header">
        <div>
          <h1>Edit Category</h1>
          <p>Update support ticket category</p>
        </div>
      </div>

      <div className="ticket-form-container">

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
              {loading ? "Updating..." : "Update Category"}
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

export default CategoryEdit;
