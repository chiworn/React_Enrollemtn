import React from 'react'
import Sidebar from '../components/Sidebar'
import { useState } from 'react';
import "../assets/style/term.css";

// const API_BASE_URL = "http://127.0.0.1:8000/api"; 


export default function AddtermModal() {
  const [activeTab, setActiveTab] = useState("terms");
  const [showTermModal, setShowTermModal] = useState(false);
  const [showTimeModal, setShowTimeModal] = useState(false);
  const [selectedDay, setSelectedDay] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  
  const [terms, setTermshow] = useState([]);
  const [timeClasses, setTimeClasses] = useState([]);
    useEffect(() => {
    fetchTerms();
    fetchTimeClasses();
  }, []);

  const fetchTimeClasses = async () => {
  const token = localStorage.getItem("token");
  try {
    const response = await fetch("http://127.0.0.1:8000/api/admin/timeslots", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Accept": "application/json"
      },
    });

    const data = await response.json();
    console.log("Time Classes:", data);

    setTimeClasses(data.Data || data.data || data);
  } catch (error) {
    console.error("Error fetching time classes:", error);
  }
};


    const fetchTerms = async () => {
    const token = localStorage.getItem("token");
    try {
        const response = await fetch("http://127.0.0.1:8000/api/admin/ternslot", {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Accept": "application/json"
        },
        });

        const data = await response.json();
        console.log("Terms Data:", data);

        setTermshow(data.Data || data.data || data); 
    } catch (error) {
        console.error("Error fetching terms:", error);
    }
    };
    console.log(terms);


  const handleAddTimeClass = () => {
    if (!startTime || !endTime) return alert("Please fill in all fields");
    const newTimeClass = { id: timeClasses.length + 1, start_time: startTime, end_time: endTime, created_at: new Date().toISOString() };
    setTimeClasses([...timeClasses, newTimeClass]);
    setStartTime("");
    setEndTime("");
    setShowTimeModal(false);
  };

  const handleDeleteTerm = (id) => setTerms(terms.filter(t => t.id !== id));
  const handleDeleteTimeClass = (id) => setTimeClasses(timeClasses.filter(t => t.id !== id));

  return (
    <div>
         <Sidebar/>
         <div className="schedule-container">
      <h2 className="title pt-4">Schedule Management</h2>
      <p className="subtitle">Manage term days and class time slots</p>

      {/* Tabs */}
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

      {/* Terms Tab */}
      {activeTab === "terms" && (
        <>
          <div className="d-flex justify-content-between mb-2">
            <h5>Term Days</h5>
            <button className="btn btn-outline-primary tittlebtn" onClick={() => setShowTermModal(true)}>+  Add Term Day</button>
          </div>

          <div className="table-responsive">
            <table className="table table-striped table-bordered table-hover custom-table">
              <thead className="thead">
                <tr>
                  <th>ID</th>
                  <th>Term Day</th>
                  <th>Created At</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {terms.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center">No term days added yet</td>
                  </tr>
                ) : (
                  terms.map(term => (
                    <tr key={term.id}>
                      <td>{term.id}</td>
                      <td>{term.term_day}</td>
                      <td>{new Date(term.created_at).toLocaleDateString()}</td>
                      <td className="text-end">
                        <button className="btn btn-outline-primary px-3 btn-sm me-1"> <i className="bi bi-pencil-fill me-2 "></i> Edit</button>
                        <button className="btn btn-outline-danger btn-sm px-3" onClick={() => handleDeleteTerm(term.id)}> <i className="bi bi-trash-fill me-2"></i>Delete</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Time Classes Tab */}
      {activeTab === "times" && (
        <>
          <div className="d-flex justify-content-between mb-2">
            <h5>Time Classes</h5>
            <button className="btn btn-outline-primary tittlebtn" onClick={() => setShowTimeModal(true)}>+ Add Time Class</button>
          </div>

          <div className="table-responsive">
            <table className="table table-striped table-bordered table-hover custom-table">
              <thead className="table">
                <tr>
                  <th>ID</th>
                  <th>Start Time</th>
                  <th>End Time</th>
                  <th>Created At</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {timeClasses.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center">No time classes added yet</td>
                  </tr>
                ) : (
                  timeClasses.map(time => (
                    <tr key={time.id}>
                      <td>{time.id}</td>
                      <td>{time.start_time}</td>
                      <td>{time.end_time}</td>
                      <td>{new Date(time.created_at).toLocaleDateString()}</td>
                      <td className="text-end">
                        <button className="btn btn-outline-primary px-3 btn-sm me-1"> <i className="bi bi-pencil-fill me-2 "></i> Edit</button>
                        <button className="btn btn-outline-danger btn-sm px-3" onClick={() => handleDeleteTimeClass(time.id)}> <i className="bi bi-trash-fill me-2"></i>Delete</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Term Modal */}
      {showTermModal && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header header1 text-white">
                <h5 className="modal-title">Add New Term Day</h5>
                <button type="button" className="btn-close btn btn-outline-danger" onClick={() => setShowTermModal(false)}></button>
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
                <button className="btn btn-secondary py-1" onClick={() => setShowTermModal(false)}>Cancel</button>
                <button className="btn btn-outline-primary py-1 tittlebtn " onClick={handleAddTerm}>Add Term Day</button>
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
                <h5 className="modal-title">Add New Time Class</h5>
                <button type="button" className="btn-close" onClick={() => setShowTimeModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Start Time</label>
                  <input type="time" className="form-control" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
                </div>
                <div className="mb-3">
                  <label className="form-label">End Time</label>
                  <input type="time" className="form-control" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-primary py-1" onClick={() => setShowTimeModal(false)}>Cancel</button>
                <button className="btn btn-outline-primary py-1 tittlebtn " onClick={handleAddTimeClass}>Add Time Class</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
    </div>
  )
}
