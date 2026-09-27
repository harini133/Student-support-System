import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
  getCategories,
  deactivateCategory,
} from "../../redux/categorySlice";

function CategoryManagement() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { categories, loading, error } = useSelector(
    (state) => state.categories
  );

  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);

  const handleDeactivate = async (id) => {
    const confirmDeactivate = window.confirm(
      "Are you sure you want to deactivate this category?"
    );

    if (!confirmDeactivate) {
      return;
    }

    try {
      await dispatch(deactivateCategory(id)).unwrap();

      alert("Category deactivated successfully");
    } catch (error) {
      console.log(error);
      alert("Category deactivation failed");
    }
  };

  if (loading) {
    return <p>Loading categories...</p>;
  }

  if (error) {
    return <p>{JSON.stringify(error)}</p>;
  }

  return (
    <div className="ticket-page">

      <div className="ticket-header">
        <div>
          <h1>Category Management</h1>
          <p>Manage support ticket categories</p>
        </div>

        <button
          className="create-ticket-btn"
          onClick={() => navigate("/categories/create")}
        >
          Add Category
        </button>
      </div>

      <div className="ticket-table-container">

        <table className="ticket-table">

          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Description</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>

            {categories.length === 0 ? (
              <tr>
                <td colSpan="5">
                  No categories found
                </td>
              </tr>
            ) : (
              categories.map((category) => (
                <tr key={category.id}>

                  <td>{category.id}</td>

                  <td>{category.name}</td>

                  <td>
                    {category.description || "-"}
                  </td>

                  <td>
                    {category.is_active
                      ? "Active"
                      : "Inactive"}
                  </td>

                  <td>

                    <button
                      className="edit-btn"
                      onClick={() =>
                        navigate(
                          `/categories/${category.id}/edit`
                        )
                      }
                    >
                      Edit
                    </button>

                    {category.is_active && (
                      <button
                        className="delete-btn"
                        onClick={() =>
                          handleDeactivate(category.id)
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

export default CategoryManagement;