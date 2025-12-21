import React, { useEffect, useState } from 'react';
import '../assets/style/Dashboard.css';
import Sidebar from '../components/Sidebar';
import axios from 'axios';
import Navbar from '../components/Navbar';
import StatisticCard from '../components/StatisticCard,';
import EnrollmentChart from '../components/EnrollmentChart';
import { CourseDistributionChart } from '../components/CourseDistributionChart';


function Dashboard() {
  const [enrollments, setEnrollments] = useState([]);
  // const [openActionId, setOpenActionId] = useState(null);
  const [stats, setStats] = useState([]);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedEnrollment, setSelectedEnrollment] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://127.0.0.1:8000/api/admin/enrollment", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((response) => {
        setEnrollments(response.data); // ✅ important
         buildStats(response.data);
      })
      .catch(console.error);
  }, []);
   useEffect(() => {
    const delay = setTimeout(() => {
      fetchEnrollments();
    }, 400); // wait 400ms after typing

    return () => clearTimeout(delay); // clear previous timeout if typing
  }, [search]); 

  const buildStats = (data) => {
  const totalEnrollments = data.length;
  const uniqueStudents = new Set(data.map(e => e.id)).size;
  const uniqueCourses  = new Set(data.map(e => e.course_id)).size;
  const uniqueTeachers = new Set(data.map(e => e.term_id)).size;
  
const totalPrice = data.reduce(
  (sum, e) => sum + Number(e.price_course || 0),0
);
console.log("totla_price:" ,totalPrice);
setStats([
  {
    title: "Total Students",
    value: uniqueStudents,
    icon: "👥",
    color: "#3b82f6",
    id: "students", // ✅ unique key
  },
  {
    title: "Total Courses",
    value: uniqueCourses,
    icon: "📚",
    color: "#10b981",
    id: "courses",
  },
  {
    title: "Total Enrollments",
    value: totalEnrollments,
    icon: "📝",
    color: "#f59e0b",
    id: "enrollments",
  },
  {
    title: "Total Revenue",
    value: `$${(totalPrice || 0).toLocaleString()}`,
    icon: "💰",
    color: "#8b5cf6",
    id: "revenue",
  },
  {
    title: "Active TERM NOW ",
    value: uniqueTeachers,
    icon: "👨‍🏫",
    color: "#ef4444",
    id: "teachers",
  },
]);

};

  const getStatusColor = (status) => {
    if (status === "Approved") return "#16a34a";
    if (status === "Pending") return "#f59e0b";
    return "#DC0E0E";
  };

  console.log("Data in table",enrollments);

  const handleView = (enrollment) => {
  setSelectedEnrollment(enrollment);
  setShowViewModal(true);
};

 const fetchEnrollments = async () => {
  setLoading(true);
  try {
    const res = await axios.get(
      `http://localhost:8000/api/admin/enrollment?search=${search}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // or your token source
        },
      }
    );
    setEnrollments(res.data.data);
  } catch (error) {
    console.error("Error fetching enrollments:", error);
  }
  setLoading(false);
};



  return (
<div className="dashboard-container vh-100 vw-100 d-flex    ">

      {/* SIDEBAR */}
     <Sidebar/>
        <div className="table-wrapper ">
         
          <Navbar/>
           <div className=" container-fliud nabar ">
            <div className='row gap-5 d-flex justify-content-center align-items-center py-3'>
               {stats.map((stat) => (
                  <StatisticCard key={stat.id} {...stat} />
                ))}

            </div>
             
            </div>
            <div className='container-fluid p-2 pe-4'>
              <div className='row'>
                <div className='col-md-6 mb-2 '>
                  <EnrollmentChart/>
                </div>
                <div className='col-md-6 mb-2 '>
                  <CourseDistributionChart/>
                </div>
              </div>
            </div>
            <div>
                <input
                  type="text"
                  placeholder="Search ID or student name..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="form-control w-25 mb-3 ms-4"
                />
                 <table className="enrollments-table mx-4">
                    <thead>
                      <tr>
                        <th>Student Name</th>
                        <th>Course</th>
                        <th>Term</th>
                        <th>Time Slot</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>

                    <tbody>
                      {loading ? (
                          <tr>
                            <td colSpan="6" className="text-center">Loading...</td>
                          </tr>
                        ) :enrollments.map((enrollment) => (
                      <tr key={`${enrollment.id}-${enrollment.student_id}-${enrollment.course_id}`}>

                          {/* Student Name */}
                          <td className="name-cell">
                            {enrollment.Frist_name} {enrollment.last_name}
                          </td>

                          {/* Course */}
                          <td>{enrollment.course_name}</td>

                          {/* Term */}
                          <td>{enrollment.tern_day}</td>

                          {/* Time Slot */}
                          <td>
                            {enrollment.start_time} - {enrollment.end_time}
                          </td>

                          {/* Status */}
                          <td>
                            <span
                              className="status-badge"
                              style={{
                                backgroundColor: getStatusColor(enrollment.status),
                              }}
                            >
                              {enrollment.status}
                            </span>
                          </td>

                          {/* Actions */}
                          <td className='d-flex justify-content-center align-content-center pt-3'>
                              <div className="d-flex justify-content-start  align-content-center  w-50 ">
                        <p
                          className="btn btn-sm btn-outline-primary dropdown-item small  x py-0  me-2"
                          onClick={() => handleView(enrollment)}
                        >
                          View
                        </p>

                        <p className=" btn btn-sm btn-outline-danger small opacity-75 py-0  me-2">Approve</p>
                      </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
               </table>

            </div>
           
            
    
               
        {showViewModal && selectedEnrollment && (
        <>
          {/* Backdrop */}
          <div
            className="modal-backdrop  show"
            style={{ zIndex: 1050 }}
            onClick={() => setShowViewModal(false)}
          ></div>

          {/* Modal */}
          <div
            className="modal show d-block"
            tabIndex={-1}
            style={{ zIndex: 1055 }}
          >
            <div className="modal-dialog  modal-dialog-centered ">
              <div className="modal-content rounded-4">

                {/* Header */}
                <div className="modal-header">
                  <h5 className="modal-title">
                    <i className="bi bi-eye me-2"></i> Student Details
                  </h5>
                </div>

                {/* Body */}
                <div className="modal-body mt-3 mb-0">
                  <div className="row g-3">

                    <div className="col-md-6 text-start m-0">
                      <small className="text-muted">Full Name</small>
                      <p className="fw-bold">
                        {selectedEnrollment.Frist_name} {selectedEnrollment.last_name}
                      </p>
                    </div>

                    <div className="col-md-6  text-start ps-5 m-0 ">
                      <small className="text-muted">Status</small><br />
                      <small 
                        className=" px-1 py-1 rounded-3 m-0 p-0 px-2"
                        style={{
                          backgroundColor: getStatusColor(selectedEnrollment.status),
                        }}
                      >
                        {selectedEnrollment.status}
                      </small>
                    </div>
                        <div className="col-md-6 text-start mt-1">
                      <small className="text-muted ">Email</small>
                      <p className="">
                        {selectedEnrollment.email} </p>
                    </div>

                    <div className="col-md-6 text-start ps-5 mt-1">
                      <small className="text-muted">Phone_number</small><br />
                      <small 
                        className=" px-1 py-1 rounded-3 m-0 p-0"
                      >
                        {selectedEnrollment.phone}
                      </small>
                    </div>
                    <hr className='mt-0' />
                    <small className="text-muted text-start mt-0 mb-2">Course Informantion</small>
                  <div className="col-md-6 text-start mt-1">
                      <small className="text-muted ">Course </small>
                      <p className="">
                        {selectedEnrollment.email} </p>
                    </div>

                    <div className="col-md-6 text-start ps-5 mt-1">
                      <small className="text-muted">Price_course</small><br />
                      <small 
                        className=" px-1 py-1 rounded-3 m-0 p-0"
                      >
                        {selectedEnrollment.price_course}.00$
                      </small>
                    </div>
                    <div className="col-md-6 text-start mt-0">
                      <small className="text-muted ">Timeslot </small>
                      <p className="small">
                        {selectedEnrollment.start_time} - {selectedEnrollment.end_time}  </p>
                    </div>

                    <div className="col-md-6 text-start ps-5 mt-0">
                      <small className="text-muted">term_slot</small><br />
                      <small 
                        className=" px-1 py-1 small rounded-3 m-0 p-0"
                      >
                        {selectedEnrollment.tern_day}
                      </small>
                    </div>
                      <hr className='mt-0 mb-0' />
                  <div className="col-md-6 text-start mt-1">
                      <small className="text-muted ">Cread_at </small>
                      <p className="">
                        {selectedEnrollment.created_at} </p>
                    </div>

                  </div>
                </div>

                {/* Footer */}
                <div className="modal-footer mt-0 pt-0">
                  <button
                    className="btn btn-outline-primary px-4"
                    onClick={() => setShowViewModal(false)}
                  >
                    Close
                  </button>
                </div>

              </div>
            </div>
          </div>
        </>
      )}

    
    

    </div>
      </div>

  )
}

export default Dashboard
