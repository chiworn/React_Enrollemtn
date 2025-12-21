import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import "../assets/style/course.css";

export default function AddpriceModal() {
  const [prices, setPrices] = useState([]);
  const [formData, setFormData] = useState({
    price_course: "",
  });
  const [editingPrice, setEditingPrice] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchPrices();
  }, []);

  // Fetch all prices
  const fetchPrices = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/admin/price", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setPrices(data.Data || []);
    } catch (error) {
      console.error("Error fetching prices:", error);
    }
  };
  console.table(prices);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: parseFloat(value) });
  };

  // Open modal for Add
  const handleAddNew = () => {
    setEditingPrice(null);
    setFormData({ price_course: "" });
    setShowModal(true);
  };

  // Open modal for Edit
  const handleEdit = (price) => {
    setEditingPrice(price);
    setFormData({ price_course: price.price_course });
    setShowModal(true);
  };

  // Submit Add or Edit
  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editingPrice
      ? `http://127.0.0.1:8000/api/admin/price/${editingPrice.id}`
      : "http://127.0.0.1:8000/api/admin/price";
    const method = editingPrice ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
           Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log("Server Response:", data);

      if (res.ok) {
        setShowModal(false);
        setEditingPrice(null);
        setFormData({ price_course: "" });
        fetchPrices();
      }
    } catch (error) {
      console.error(error);
      alert("Error saving price");
    }
  };

  // Delete price
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this price?")) return;
    try {
      await fetch(`http://127.0.0.1:8000/api/admin/price/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchPrices();
    } catch (error) {
      console.error(error);
      alert("Error deleting price");
    }
  };

  return (
    <div>
      <Sidebar />

      <div className="container-fluid py-3 account-settings-container">
        <h1 className="title pt-2">Price Management</h1>
        <p className="subtitle">Manage course prices</p>

        <div className="d-flex justify-content-between mb-2">
          <h5 className="tittlebtn1  px-2 py-2 fw-bold">All Prices</h5>
          <button className="btn btn-outline-primary tittlebtn my-2" onClick={handleAddNew}>
            + Add Price
          </button>
        </div>

        <table className="table table-striped table-bordered table-hover custom-table">
          <thead>
            <tr>
              <th>No</th>
              <th>Price</th>
              <th>Created At</th>
              <th className="text-end">Actions</th>
            </tr>
          </thead>
          <tbody>
            {prices.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center">
                  No prices found
                </td>
              </tr>
            ) : (
              prices.map((price, index) => (
                <tr key={price.id}>
                  <td>{index + 1}</td>
                  <td>${price.price_course.toFixed(2)}</td>
                  <td>{new Date(price.created_at).toLocaleDateString()}</td>
                  <td className="text-end">
                    <button
                      className="btn btn-sm btn-outline-primary me-1 tittlebtn px-3 me-2"
                      onClick={() => handleEdit(price)}
                    >
                      <i className="bi bi-pencil-fill me-2"></i>Edit
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDelete(price.id)}
                    >
                      <i className="bi bi-trash-fill me-2"></i> Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header header1 text-white">
                <h5 className="modal-title">
                  {editingPrice ? "Edit Price" : "Add New Price"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setShowModal(false);
                    setEditingPrice(null);
                  }}
                ></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label>Price</label>
                    <input
                      type="number"
                      step="0.01"
                      className="form-control"
                      name="price_course"
                      value={formData.price_course}
                      onChange={handleChange}
                      min={0}
                      required
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-outline-primary tittlebtn">
                    {editingPrice ? "Update Price" : "Add Price"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
