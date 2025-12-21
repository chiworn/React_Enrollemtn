import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import "../assets/style/term.css";

export default function AddtermModal() {
  const [activeTab, setActiveTab] = useState("terms");
  const [showTermModal, setShowTermModal] = useState(false);
  const [showTimeModal, setShowTimeModal] = useState(false);
  const [editingTerm, setEditingTerm] = useState(null); // null means not editing
  const [editingTime, setEditingTime] = useState(null);
  const [selectedDay, setSelectedDay] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [terms, setTerms] = useState([]);
  const [timeClasses, setTimeClasses] = useState([]);

  useEffect(() => {
    fetchTerms();
    fetchTimeClasses();
  }, []);

  const fetchTerms = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch("http://127.0.0.1:8000/api/admin/ternslot", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json",
        },
      });

      const data = await response.json();
      console.log("Terms Data:", data);

      setTerms(data.Data || data.data || []);
    } catch (error) {
      console.error("Error fetching terms:", error);
    }
  };

  const fetchTimeClasses = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch("http://127.0.0.1:8000/api/admin/timeslots", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json",
        },
      });

      const data = await response.json();
      console.log("Time Classes:", data);

      setTimeClasses(data.Data || data.data || []);
    } catch (error) {
      console.error("Error fetching time classes:", error);
    }
  };

  const handleSaveTerm = async () => {
  const token = localStorage.getItem("token");
  if (!selectedDay.trim()) return alert("Please enter a valid day!");

  try {
    if (editingTerm) {
      // UPDATE existing term
      const response = await fetch(`http://127.0.0.1:8000/api/admin/ternslot/${editingTerm.id}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tern_day: selectedDay }),
      });
      await response.json();
      setEditingTerm(null); // clear editing state
    } else {
      // ADD new term
      const response = await fetch("http://127.0.0.1:8000/api/admin/ternslot", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tern_day: selectedDay }),
      });
      await response.json();
    }

    fetchTerms(); // refresh table
    setSelectedDay("");
    setShowTermModal(false);
  } catch (error) {
    console.error("Error saving term:", error);
  }
  };

  const handleSaveTimeClass = async () => {
  const token = localStorage.getItem("token");
  if (!startTime || !endTime) return alert("Fill in all fields!");

  try {
    const url = editingTime
      ? `http://127.0.0.1:8000/api/admin/timeslots/${editingTime.id}` // UPDATE
      : "http://127.0.0.1:8000/api/admin/timeslots";                 // ADD

    const method = editingTime ? "PUT" : "POST";

    const response = await fetch(url, {
      method,
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        start_time: startTime,
        end_time: endTime,
      }),
    });

    const result = await response.json();
    console.log("Result:", result);

    fetchTimeClasses(); // Reload list

    // Reset modal
    setShowTimeModal(false);
    setStartTime("");
    setEndTime("");
    setEditingTime(null);

    } catch (error) {
      console.error("Error saving:", error);
    }
  };

  const handleDeleteTerm = async (id) => {
  const token = localStorage.getItem("token");
  if (!window.confirm("Are you sure you want to delete this term day?")) return;

  try {
    const response = await fetch(`http://127.0.0.1:8000/api/admin/ternslot/${id}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Accept": "application/json",
      },
    });

    const result = await response.json();
    console.log("Delete Term:", result);
    fetchTerms(); // refresh table
  } catch (error) {
    console.error("Error deleting term:", error);
  }
  };

  const handleDeleteTime = async (id) => {
  const token = localStorage.getItem("token");

  if (!confirm("Are you sure you want to delete this time class?")) return;

  try {
    await fetch(`http://127.0.0.1:8000/api/admin/timeslots/${id}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });

    fetchTimeClasses(); // reload list after delete

  } catch (error) {
    console.error("Delete Error:", error);
  }
  };





  return (
    <div>
      <Sidebar />
      <div className="schedule-container">
  <h2 className="title pt-4">Schedule Management</h2>
  <p className="subtitle">Manage term days and class time slots</p>
  <ul className="nav nav-tabs mb-3 custom-tabs">
    <li className="nav-item">
      <button
        className={`nav-link ${activeTab === "terms" ? "active" : ""}`}
        onClick={() => setActiveTab("terms")}
      >
        Term Days
      </button>
    </li>
    <li className="nav-item">
      <button
        className={`nav-link ${activeTab === "times" ? "active" : ""}`}
        onClick={() => setActiveTab("times")}
      >
        Time Classes
      </button>
    </li>
  </ul>
    {/* Terms Table */}
    {activeTab === "terms" && (
      <>
        <div className="d-flex justify-content-between mb-2">
          <h5>Term Days</h5>
          <button
          className="btn btn-outline-primary tittlebtn"
          onClick={() => {
            setEditingTerm(null);   // not editing
            setSelectedDay("");     // clear form
            setShowTermModal(true);
          }}
        >
          + Add Term Day
        </button>
        </div>

        <div className="table-responsive">
          <table className="table table-striped table-bordered table-hover custom-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Term Day</th>
                <th>Created At</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {terms.length === 0 ? (
                <tr><td colSpan="4" className="text-center">No term days found</td></tr>
              ) : (
                terms.map((term) => (
                  <tr key={term.id}>
                    <td>{term.id}</td>
                    <td>{term.tern_day}</td>
                    <td>{new Date(term.created_at).toLocaleDateString()}</td>
                    <td className="text-end">
                      <button
                      className="btn btn-outline-primary btn-sm px-3 me-1 tittlebtn"
                      onClick={() => {
                        setEditingTerm(term);           // store term we want to edit
                        setSelectedDay(term.tern_day);  // prefill modal input
                        setShowTermModal(true);         // open modal
                      }}
                    >
                      <i className="bi bi-pencil-fill me-2"></i> Edit
                    </button>
                    <button
                          className="btn btn-outline-danger btn-sm px-3 "
                          onClick={() => handleDeleteTerm(term.id)} // call delete API
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
      </>
    )}

    {/* Time Classes Table */}
    {activeTab === "times" && (
      <>
        <div className="d-flex justify-content-between mb-2">
          <h5>Time Classes</h5>
        <button
            className="btn btn-outline-primary tittlebtn"
            onClick={() => {
              setEditingTime(null);   // reset edit mode
              setStartTime("");       // clear input
              setEndTime("");         // clear input
              setShowTimeModal(true); // open modal
            }}
          >
            + Add Time Class
          </button> 
        </div>

        <div className="table-responsive">
          <table className="table table-striped table-bordered table-hover custom-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Start</th>
                <th>End</th>
                <th>Created At</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {timeClasses.length === 0 ? (
                <tr><td colSpan="5" className="text-center">No time classes found</td></tr>
              ) : (
                timeClasses.map((time) => (
                  <tr key={time.id}>
                    <td>{time.id}</td>
                    <td>{time.start_time}</td>
                    <td>{time.end_time}</td>
                    <td>{new Date(time.created_at).toLocaleDateString()}</td>
                    <td className="text-end">
                  <button
                      className="btn btn-outline-primary btn-sm px-3 me-1"
                      onClick={() => {
                        setEditingTime(time);            // correct name
                        setStartTime(time.start_time);   // correct
                        setEndTime(time.end_time);       // correct
                        setShowTimeModal(true);          // open modal
                      }}
                    >
                      <i className="bi bi-pencil-fill me-2"></i> Edit
                    </button>
                  <button
                      className="btn btn-outline-danger btn-sm px-3"
                      onClick={() => handleDeleteTime(time.id)}
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
      </>
    )}

    {/* From input  */}
    {showTermModal && (
    <div className="modal show d-block" tabIndex="-1">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header header1 text-white">
            <h5 className="modal-title">
              {editingTerm ? "Edit Term Day" : "Add New Term Day"}
            </h5>
            <button
              type="button"
              className="btn-close btn btn-outline-danger"
              onClick={() => {
                setShowTermModal(false);
                setEditingTerm(null); // clear editing state
              }}
            ></button>
          </div>
          <div className="modal-body">
            <input
              type="text"
              className="form-control"
              placeholder="Enter day (e.g., Monday)"
              value={selectedDay}
              onChange={(e) => setSelectedDay(e.target.value)}
            />
          </div>
          <div className="modal-footer">
            <button
              className="btn btn-secondary py-1"
              onClick={() => {
                setShowTermModal(false);
                setEditingTerm(null);
              }}
            >
              Cancel
            </button>
            <button
              className="btn btn-outline-primary py-1 tittlebtn"
              onClick={handleSaveTerm}
              >
              {editingTerm ? "Update Term Day" : "Add Term Day"}
              </button>

            
            
          </div>
        </div>
      </div>
    </div>
    )}

    {/* Time Modal */}
    {showTimeModal && (
    <div className="modal show d-block" tabIndex="-1">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          
          <div className="modal-header header1 text-white">
            <h5 className="modal-title">
              {editingTime ? "Update Time Class" : "Add New Time Class"}
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={() => {
                setShowTimeModal(false);
                setEditingTime(null);
              }}
            ></button>
          </div>

          <div className="modal-body">
            <div className="mb-3">
              <label className="form-label">Start Time</label>
              <input
                type="text"
                placeholder="hh:mm AM/PM"
                className="form-control"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">End Time</label>
              <input
                type="text"
                placeholder="hh:mm AM/PM"
                className="form-control"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button className="btn btn-primary py-1" onClick={() => setShowTimeModal(false)}>
              Cancel
            </button>

            <button
              className="btn btn-outline-primary py-1 tittlebtn"
              onClick={handleSaveTimeClass}
            >
              {editingTime ? "Update Time Class" : "Add Time Class"}
            </button>
          </div>

        </div>
      </div>
    </div>
    )}

  </div>
</div>
  );
}
