import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import "../assets/style/course.css";

export default function CourseManagement() {
  const [orders, setOrders] = useState([]);
  const [formData, setFormData] = useState({
    course_name: "",
    duration_month: "",
    description: "",
  });
  const [editingCourse, setEditingCourse] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchCourses();
  }, []);

  // Fetch courses
  const fetchCourses = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/admin/course", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setOrders(data.Data || []);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "duration_month" ? parseInt(value) : value,
    }));
  };

  // Open modal for Add
  const handleAddNew = () => {
    setEditingCourse(null);
    setFormData({ course_name: "", duration_month: "", description: "" });
    setShowModal(true);
  };

  // Open modal for Edit
  const handleEdit = (course) => {
    setEditingCourse(course);
    setFormData({
      course_name: course.course_name,
      duration_month: course.duration_month,
      description: course.description,
    });
    setShowModal(true);
  };

  // Submit Add or Edit
  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editingCourse
      ? `http://127.0.0.1:8000/api/admin/course/${editingCourse.id}`
      : "http://127.0.0.1:8000/api/admin/course";
    const method = editingCourse ? "PUT" : "POST";

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
        setEditingCourse(null);
        setFormData({ course_name: "", duration_month: "", description: "" });
        fetchCourses();
      }
    } catch (error) {
      console.error(error);
      alert("Error saving course");
    }
  };

  // Delete course
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;
    try {
      await fetch(`http://127.0.0.1:8000/api/admin/course/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchCourses();
    } catch (error) {
      console.error(error);
      alert("Error deleting course");
    }
  };

  return (
    <div>
      <Sidebar />

      <div className="container-fluid py-3 account-settings-container">
        <h1 className="title pt-2">Courses Management</h1>
        <p className="subtitle">Manage available courses and their details</p>

        <div className="d-flex justify-content-between mb-2">
          <h5 className="tittlebtn1 px-5 py-2 fw-bold">All Courses</h5>
          <button className="btn btn-outline-primary tittlebtn my-2" onClick={handleAddNew}>
            + Add Course
          </button>
        </div>

        <table className="table table-striped table-bordered table-hover custom-table">
          <thead>
            <tr>
              <th>No</th>
              <th>Course Name</th>
              <th>Duration (Month)</th>
              <th>Description</th>
              <th>Created At</th>
              <th className="text-end">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center">
                  No courses found
                </td>
              </tr>
            ) : (
              orders.map((course, index) => (
                <tr key={course.id}>
                  <td>{index + 1}</td>
                  <td>{course.course_name}</td>
                  <td>{course.duration_month} Month</td>
                  <td>{course.description}</td>
                  <td>{new Date(course.created_at).toLocaleDateString()}</td>
                  <td className="text-end">
                    <button
                      className="btn btn-sm btn-outline-primary me-1 tittlebtn px-2"
                      onClick={() => handleEdit(course)}
                    >
                      <i className="bi bi-pencil-fill me-2"></i>Edit
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDelete(course.id)}
                    >
                       <i className="bi bi-trash-fill me-2"></i>Delete
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
                  {editingCourse ? "Edit Course" : "Add New Course"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setShowModal(false);
                    setEditingCourse(null);
                  }}
                ></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label>Course Name</label>
                    <input
                      type="text"
                      className="form-control"
                      name="course_name"
                      value={formData.course_name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label>Duration (Month)</label>
                    <input
                      type="number"
                      className="form-control"
                      name="duration_month"
                      value={formData.duration_month}
                      onChange={handleChange}
                      min={1}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label>Description</label>
                    <textarea
                      className="form-control"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
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
                    {editingCourse ? "Update Course" : "Add Course"}
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
