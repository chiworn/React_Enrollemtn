import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import "../assets/style/Entrollment.css";
import { Eye, Pencil, Printer } from "lucide-react";
import logo from "../assets/image/image copy.png";

import { useNavigate } from "react-router-dom";

export default function EnrollmentManagement() {
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [enrollments, setEnrollments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [timeslots, setTimeslots] = useState([]);
  const [terms, setTerms] = useState([]);
  const [prices, setPrices] = useState([]);
  const navigate = useNavigate();
  const getStatusColor = (status) => {
  switch (status) {
    case "Pending":
      return "#facc15"; // yellow
    case "Approved":
      return "#22c55e"; // green
    case "Rejected":
      return "#ef4444"; // red
    case "Completed":
      return "#3b82f6"; // blue
    default:
      return "#9ca3af"; // gray
  }
};
  const token = localStorage.getItem("token");
  const [formData, setFormData] = useState({
    course_id: "",
    timeslot_id: "",
    term_id: "",
    price_id: "",
    Frist_name: "",
    last_name: "",
    phone: "",
    email: "",
    status: "",
  });
  // console.log(formData);

  useEffect(() => {
     loadDropdowns();
     loadEnrollments();
  }, []);

  // Load dropdown data
  const loadDropdowns = async () => {
    const urls = {
      c: "http://127.0.0.1:8000/api/admin/course",
      t: "http://127.0.0.1:8000/api/admin/timeslots",
      tr: "http://127.0.0.1:8000/api/admin/ternslot",
      p: "http://127.0.0.1:8000/api/admin/price",
    };

    const fetchData = async (url) =>
      (await fetch(url, { headers: { Authorization: `Bearer ${token}` } })).json();

    const [courseData, timeData, termData, priceData] = await Promise.all([
      fetchData(urls.c),
      fetchData(urls.t),
      fetchData(urls.tr),
      fetchData(urls.p),
    ]);

    setCourses(courseData.Data || []);
    setTimeslots(timeData.Data || []);
    setTerms(termData.data || []);
    setPrices(priceData.Data || []);
  };

  const loadEnrollments = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/admin/enrollment", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setEnrollments(data.data || []);
    } catch (err) {
      console.error("Error loading enrollments", err);
    }
  };    
  // console.log(enrollments);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Submit form
  const handleSubmit = async (e) => {
  e.preventDefault();

  const url = isEdit
    ? `http://127.0.0.1:8000/api/admin/enrollment/${editId}`
    : "http://127.0.0.1:8000/api/admin/enrollment";

  const method = isEdit ? "PUT" : "POST";

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

    if (res.ok) {
      alert(isEdit ? "Enrollment updated!" : "Enrollment registered!");

      setFormData({
        course_id: "",
        timeslot_id: "",
        term_id: "",
        price_id: "",
        Frist_name: "",
        last_name: "",
        phone: "",
        email: "",
        status: "",
      });

      setIsEdit(false);
      setEditId(null);
      loadEnrollments();
    }
  } catch (error) {
    console.error(error);
    alert("Something went wrong");
  }
};
  const handleEditEnrollment = (en) => {
    console.log("Data Edit :",en);
  setFormData({
    course_id: en.course?.id || en.course_id || "",
    timeslot_id: en.timeslot?.id || en.timeslot_id || "",
    term_id: en.term?.id || en.term_id || "",
    price_id: en.price?.id || en.price_id || "",
    Frist_name: en.Frist_name || "",
    last_name: en.last_name || "",
    phone: en.phone || "",
    email: en.email || "",
    status: en.status || "",
  });

  setEditId(en.id);
  setIsEdit(true);

  window.scrollTo({ top: 0, behavior: "smooth" });
};
console.log("From EDIt",formData);

  const handleViewInvoice = async (id) => {
      console.log(id);
      // const token = localStorage.getItem("token"); // or whatever your auth method is
      try {
         const res = await fetch(`http://127.0.0.1:8000/api/admin/enrollment/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });
        const result = await res.json();
        setSelectedInvoice(result); // save data for modal
      } catch (error) {
        console.error("Error loading invoice", error);
      }
  };
  console.log(selectedInvoice);
 
  return (
    <div>
      <Sidebar />
        <div className="modal fade hide-scroll" id="exampleModal" tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div  className="modal-dialog modal-dialog-centered modalwidth hide-scroll" >
        <div className="modal-content mt-1">
          <div className="modal-body p-0 pb-0  ">
          {!selectedInvoice ? (
            <div className="text-center p-5">Loading invoice...</div>
          ) : (
            <>
              {/* Modal Body */}
              <div className="modal-body invoice-body p-0 rounded-2">
                {/* Invoice Header */}
                <div className="mb-1 d-flex justify-content-between align-items-center bginvoice m-0 rounded-top-3 px-3 py-1">
                  <div className="d-flex align-items-center gap-3">
                      <img
                        src={logo}
                        alt="Etec Center "
                        className="rounded-2"
                        style={{ width: "63px", height: "60px", objectFit: "cover" }}
                      />

                      <div className="">
                        <h3 className="text-start fw-bold text-primary mb-1 text-white">
                          Etec Center
                        </h3>
                        <p className="text-shadow mb-0 text-white">
                          Building your IT skill since 2012
                        </p>
                      </div>
                    </div>
                  <div className="text-end p-0 py-2 ">
                    <h4 className="fw-bold mb-1 text-white text-shadow">INVOICE</h4>
                    <p className=" mb-0 text-white  "># 000{selectedInvoice.data.id}</p>
                    <p className="text-white mb-0">
                      Date: {new Date(selectedInvoice.data.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Bill To */}
                <div className="row mb-1 px-3 pt-2">
                  <div className="col-md-6 mb-0 mb-md-0">
                    <div className="card border-light">
                      <div className="card-body">
                        <h6 className="fw-bold text-primary mb-0">
                          <i className="bi bi-person-circle me-2"></i> BILL TO
                        </h6>
                        <p className="fw-semibold mb-2">
                          {selectedInvoice.data.Frist_name} {selectedInvoice.data.last_name}
                        </p>
                        <p className="text-muted mb-2">{selectedInvoice.data.email}</p>
                        <p className="text-muted mb-0">{selectedInvoice.data.phone}</p>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="card border-light">
                      <div className="card-body">
                        <h6 className="fw-bold text-primary mb-4">
                          <i className="bi bi-calendar-check me-2"></i> ENROLLMENT DETAILS
                        </h6>
                         <div className="d-flex justify-content-between mb-2">
                          <span className="text-muted">Enrolled :</span>
                          <span className="px-2 rounded-2 me-0 p-0">
                            {new Date().toLocaleString()}
                          </span>
                        </div>
                        <div className="d-flex justify-content-between mb-2 ">
                          <span className="text-muted">Status:</span>
                          <span className="px-2 rounded-2 bg-success text-white me-2">
                            {selectedInvoice.data.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <hr />

                {/* Description Table */}
                <div className="table-responsive mb-0 px-2">
                  <table className="table">
                    <thead className="table-light">
                      <tr>
                        <th>Course</th>
                        <th>Schedule</th>
                        <th className="text-end">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="fw-semibold">{selectedInvoice.data.course_name}</td>
                        <td className="text-muted">Term: {selectedInvoice.data.tern_day} • Timeslot: {selectedInvoice.data.start_time} - {selectedInvoice.data.end_time}</td>
                        <td className="text-end fw-bold">{selectedInvoice.data.price_course} $</td>
                      </tr>
                    </tbody>
                    <tfoot className="table-light ">
                      <tr>
                        <td colSpan={2} className="text-end fw-bold">
                          Total
                        </td>
                        <td className="text-end fw-bold text-primary fs-5">{selectedInvoice.data.price_course + 5} $</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            
            </>
          )}
           </div>
           <hr />
             <div className="modal-body p-0 pb-0">
          {!selectedInvoice ? (
            <div className="text-center p-2 ">Loading invoice...</div>
          ) : (
             <>
              {/* Modal Body */}
              <div className="modal-body invoice-body p-0 rounded-3">
                {/* Invoice Header */}
                <div className="mb-1 d-flex justify-content-between align-items-center bginvoice m-0 rounded-top-3 px-3 py-1">
                  <div className="d-flex align-items-center gap-3">
                      <img
                        src={logo}
                        alt="Etec Center "
                        className="rounded-2"
                        style={{ width: "63px", height: "60px", objectFit: "cover" }}
                      />

                      <div className="">
                        <h3 className="text-start fw-bold text-primary mb-1 text-white">
                          Etec Center
                        </h3>
                        <p className="text-shadow mb-0 text-white">
                          Building your IT skill since 2012
                        </p>
                      </div>
                    </div>
                  <div className="text-end p-0 py-2 ">
                    <h4 className="fw-bold mb-1 text-white text-shadow">INVOICE</h4>
                    <p className=" mb-0 text-white  "># 000{selectedInvoice.data.id}</p>
                    <p className="text-white mb-0">
                      Date: {new Date(selectedInvoice.data.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Bill To */}
                <div className="row mb-1 px-3 pt-2">
                  <div className="col-md-6 mb-0 mb-md-0">
                    <div className="card border-light">
                      <div className="card-body">
                        <h6 className="fw-bold text-primary mb-0">
                          <i className="bi bi-person-circle me-2"></i> BILL TO
                        </h6>
                        <p className="fw-semibold mb-2">
                          {selectedInvoice.data.Frist_name} {selectedInvoice.data.last_name}
                        </p>
                        <p className="text-muted mb-2">{selectedInvoice.data.email}</p>
                        <p className="text-muted mb-0">{selectedInvoice.data.phone}</p>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="card border-light">
                      <div className="card-body">
                        <h6 className="fw-bold text-primary mb-4">
                          <i className="bi bi-calendar-check me-2"></i> ENROLLMENT DETAILS
                        </h6>
                         <div className="d-flex justify-content-between mb-2">
                          <span className="text-muted">Enrolled :</span>
                          <span className="px-2 rounded-2 me-0 p-0">
                            {new Date().toLocaleString()}
                          </span>
                        </div>
                        <div className="d-flex justify-content-between mb-2 ">
                          <span className="text-muted">Status:</span>
                          <span className="px-2 rounded-2 bg-success text-white me-2">
                            {selectedInvoice.data.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <hr />

                {/* Description Table */}
                <div className="table-responsive mb-0 px-2">
                  <table className="table">
                    <thead className="table-light">
                      <tr>
                        <th>Course</th>
                        <th>Schedule</th>
                        <th className="text-end">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="fw-semibold">{selectedInvoice.data.course_name}</td>
                        <td className="text-muted">Term: {selectedInvoice.data.tern_day} • Timeslot: {selectedInvoice.data.start_time} - {selectedInvoice.data.end_time}</td>
                        <td className="text-end fw-bold">{selectedInvoice.data.price_course} $</td>
                      </tr>
                    </tbody>
                    <tfoot className="table-light ">
                      <tr>
                        <td colSpan={2} className="text-end fw-bold">
                          Total
                        </td>
                        <td className="text-end fw-bold text-primary fs-5">{selectedInvoice.data.price_course + 5} $</td>
                      </tr>
                    </tfoot>
                  </table>
                  <div className="d-flex justify-content-end pb-2">
                      <button
                      type="button"
                      className="btn btn-outline-secondary me-2"
                      data-bs-dismiss="modal"
                    >
                      Close
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => window.print()}
                    >
                      Print Invoice
                    </button>
                  </div>
                   
                </div>
              </div>
            
            </>
          )}
          </div>

        </div>
      </div>
    </div>


      <div className="container-fluid speacall-content py-3">
        <form className="card m-0 p-0 shadow " onSubmit={handleSubmit}>
        <h4 className="mb-3 Register text-start ps-3 text-white py-3 rounded-top-2">
          {isEdit ? "Edit Enrollment" : "Register New Student"}
        </h4>
          <div className="row p-3">
            <div className="col-md-3 mb-3 pb-1 text-start ">
              <label className="pb-2 ms-1">Add_Course *</label>
              <select className="form-select" name="course_id" value={formData.course_id} onChange={handleChange} required>
                <option value="">-- Select Course --</option>
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>{c.course_name}</option>
                ))}
              </select>
            </div>

            <div className="col-md-3 mb-3 text-start">
              <label className="pb-2 ms-1">Time_Slot *</label>
              <select className="form-select" name="timeslot_id" value={formData.timeslot_id} onChange={handleChange} required>
                <option value="">-- Select Time --</option>
                {timeslots.map((t) => (
                  <option key={t.id} value={t.id}>{t.start_time} -- {t.end_time}</option>
                ))}
              </select>
            </div>

            <div className="col-md-3 mb-3 text-start">
              <label className="pb-2 ms-1">Chouse_Term *</label>
              <select className="form-select" name="term_id" value={formData.term_id} onChange={handleChange} required>
                <option value="">-- Select Term --</option>
                {terms.map((tr) => (
                  <option key={tr.id} value={tr.id}>{tr.tern_day}</option>
                ))}
              </select>
            </div>

            <div className="col-md-3 mb-3 text-start">
              <label className="pb-2 ms-1">Chouse_Price *</label>
              <select className="form-select" name="price_id" value={formData.price_id  } onChange={handleChange} required>
                <option value="">-- Select Price --</option>
                {prices.map((p) => (
                  <option key={p.id} value={p.id}>${p.price_course}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="row p-3">
            <div className="col-md-3 mb-3 text-start">
              <label className="pb-2 ms-1">First_Name *</label>
              <input className="form-control"   value={formData.Frist_name} name="Frist_name" onChange={handleChange} required />
            </div>

            <div className="col-md-3 mb-3 text-start">
              <label className="pb-2 ms-1">Last_Name *</label>
              <input className="form-control"  value={formData.last_name} name="last_name" onChange={handleChange} required />
            </div>

            <div className="col-md-3 mb-3 text-start">
              <label className="pb-2 ms-1">Phone_number *</label>
              <input className="form-control" value={formData.phone} name="phone" onChange={handleChange} required />
            </div>

            <div className="col-md-3 mb-3 text-start">
              <label className="pb-2 ms-1">Enter_Email *</label>
              <input type="email" className="form-control" value={formData.email} name="email" onChange={handleChange} required />
            </div>
           <div className="col-md-3  mt-3 text-start">
                <label className="pb-2 ms-1">Choose_status *</label>
                <select
                    value={formData.status}
                    className="form-control form-select"
                    name="status"
                    onChange={handleChange}
                    required
                >
                    <option value="">-- Select status --</option>
                    <option value="Approved">Approved</option>
                    <option value="Pending">Pending</option>
                    <option value="Rejected">Rejected</option>
                </select>
                </div>
                <div className="col-md-9 mb-3 mt-5 pt-2">
                   
                
                <div className=" d-flex justify-content-end  me-3 "> 
                <button
                    type="button"
                    className="btn btn-danger mt-2 fw-bold px-3 me-2"
                    onClick={() => {
                      setFormData({
                        course_id: "",
                        timeslot_id: "",
                        term_id: "",
                        price_id: "",
                        Frist_name: "",
                        last_name: "",
                        phone: "",
                        email: "",
                        status: "",
                      });
                      setIsEdit(false);
                      setEditId(null);
                    }}
                  >
                    <i className="bi bi-x-circle me-1"></i>
                    Cancel & Clear 
                  </button>


                   <button type="submit" className="btn btn-success mt-2 fw-bold px-3 me-2">
                    <i className={`bi ${isEdit ? "bi-pencil-square" : "bi-person-plus"} me-2`}></i>
                    {isEdit ? "Update Enrollment" : "Register"}
                  </button>

                </div>
                </div>
                
          </div>
                
         
        </form>
         <h5 className= " Register text-start ps-3 mb-0 mt-3 text-white py-3 rounded-top-2" style={{ fontFamily: "Poppins, sans-serif" }}>All Enrollments</h5>
        <div
            className="scroll-container  m-0 p-0"
            style={{
                maxHeight: "410px",
                overflowY: "scroll",
                scrollbarWidth: "none", // Firefox
                msOverflowStyle: "none", // IE 10+
            }}
            >
         
          <table className="table table-bordered table-striped ">
            <thead  style={{
                position: "sticky",
                top: 0,        // stick to the top of the container
                background: "#fff", // make sure it has a background
                zIndex: 10,    // higher than table rows
              }}>
              <tr>
                <th className="text-secondary px-1">ID_Stu</th>
                 <th className="">No</th>
                <th>Name_Student</th>
                <th>Course</th>
                <th>Time & term </th>
                <th>total_price</th>
                <th>Register_at</th>
                <th>Status</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
          <tbody>
  {[...enrollments]
    .sort((a, b) => b.id - a.id)
    .map((en, index) => (
      <tr key={en.id}>
        <td >
          <p className="bg-secondary mt-2 text-white fw-bold h-100 py-1 px-2 rounded-3 mb-0"># {en.id}</p>
        </td>
        <td className="pt-3">{index + 1} </td>
        <td className="fw-bold pt-3">
          {en.Frist_name} {en.last_name}
        </td>
        <td className="text-secondary pt-3">
          {en.course?.course_name || en.course_name}
        </td>
        <td className="text-center ps-3">
          <div className="text-secondary">
            {en.timeslot?.time_slot || `${en.start_time} - ${en.end_time}`}
          </div>
          <small className="ms-1 text-success">
            {en.term?.term_day || en.tern_day}
          </small>
        </td>
        <td className="text-secondary pt-3">
          {en.price?.price_course || en.price_course}$$
        </td>
        <td className="text-secondary pt-3">
          {new Date(en.created_at).toLocaleDateString()}
        </td>
        <td className="pt-3">
          <span
            className="status-badge"
            style={{
              backgroundColor: getStatusColor(en.status),
              color: "#fff",
              padding: "4px 10px",
              borderRadius: "12px",
              fontSize: "12px",
              fontWeight: "500",
              minWidth: "80px",
              display: "inline-block",
            }}
          >
            {en.status}
          </span>
        </td>
        <td className="text-center px-0 mx-0">
          <div className="d-inline-flex gap-1">
            <button
              type="button"
              className="btn btn-sm btn-outline-success fw-bold"
              data-bs-toggle="modal"
              data-bs-target="#exampleModal"
              onClick={() => handleViewInvoice(en.id)}
            >
              View & Print <i className="bi bi-printer ms-1"></i>
            </button>

            <button
              className="btn btn-outline-warning btn-sm"
              onClick={() => handleEditEnrollment(en)}
            >
              <i className="bi bi-pencil"></i> Edit
            </button>
          </div>
        </td>
      </tr>
    ))}
</tbody>

          </table>
        </div>
      </div>
    </div>
  );
}
