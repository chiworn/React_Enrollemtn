import React, { useEffect, useState, useRef } from "react";
import Sidebar from "../components/Sidebar";

export default function Entrollment() {
  const [enrollments, setEnrollments] = useState([]);
  const [printEnrollment, setPrintEnrollment] = useState(null);
  const printRef = useRef(null);

  // Fake course, term, price for UI demo
  const courses = [
    { id: 1, name: "English Basic" },
    { id: 2, name: "Computer Office" },
  ];

  const terms = [
    { id: 1, name: "Morning" },
    { id: 2, name: "Evening" },
  ];

  const timeslots = [
    { id: 1, slot: "7:00 - 8:00 AM" },
    { id: 2, slot: "5:00 - 6:00 PM" },
  ];

  const prices = [
    { id: 1, price: 50 },
    { id: 2, price: 60 },
  ];

  // Helper functions
  const getCourseName = (id) => courses.find((c) => c.id === id)?.name || "";
  const getTermName = (id) => terms.find((t) => t.id === id)?.name || "";
  const getTimeslot = (id) => timeslots.find((t) => t.id === id)?.slot || "";
  const getPrice = (id) => prices.find((p) => p.id === id)?.price || 0;

  // Fetch demo data
  useEffect(() => {
    setEnrollments([
      {
        id: 1,
        first_name: "John",
        last_name: "Doe",
        email: "john@example.com",
        phone: "012345678",
        course_id: 1,
        term_id: 1,
        timeslot_id: 1,
        price_id: 1,
      },
    ]);
  }, []);

  // Print function
  const handlePrint = () => {
    const printContent = printRef.current.innerHTML;
    const win = window.open("", "_blank");

    win.document.write(`
      <html>
        <head>
          <title>Invoice</title>
          <style>
            @media print {
              body {
                font-family: Arial, sans-serif;
                background: white;
              }
            }
          </style>
        </head>
        <body>${printContent}</body>
      </html>
    `);

    win.document.close();
    win.focus();
    win.print();
    win.close();
  };

  return (
    <div style={{ padding: "20px" }}>
        <Sidebar/>      <h2>Enrollment List</h2>

      {/* Enrollment Table */}
      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}>
        <thead>
          <tr>
            <th style={{ padding: "8px", borderBottom: "1px solid #ddd" }}>Name</th>
            <th style={{ padding: "8px", borderBottom: "1px solid #ddd" }}>Course</th>
            <th style={{ padding: "8px", borderBottom: "1px solid #ddd" }}>Action</th>
          </tr>
        </thead>

        <tbody>
          {enrollments.map((item) => (
            <tr key={item.id}>
              <td style={{ padding: "8px" }}>
                {item.first_name} {item.last_name}
              </td>
              <td style={{ padding: "8px" }}>{getCourseName(item.course_id)}</td>
              <td style={{ padding: "8px" }}>
                <button
                  onClick={() => setPrintEnrollment(item)}
                  style={{
                    padding: "5px 10px",
                    border: "1px solid #1e3a5f",
                    background: "#fff",
                    color: "#1e3a5f",
                    cursor: "pointer",
                    borderRadius: "4px",
                  }}
                >
                  Print Invoice
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Invoice Preview Modal */}
      {printEnrollment && (
        <div
          style={{
            position: "fixed",
            left: 0,
            top: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "20px",
          }}
        >
          <div
            style={{
              background: "white",
              width: "600px",
              padding: "20px",
              borderRadius: "8px",
            }}
          >
            <h3>Invoice Preview</h3>

            {/* Printable Area */}
            <div ref={printRef} style={{ padding: "20px" }}>

              {/* Header */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  borderBottom: "2px solid #1e3a5f",
                  paddingBottom: "10px",
                  marginBottom: "20px",
                }}
              >
                <h2 style={{ color: "#1e3a5f" }}>EduCenter</h2>

                <div style={{ textAlign: "right" }}>
                  <h3 style={{ margin: 0, color: "#1e3a5f" }}>INVOICE</h3>
                  <p style={{ margin: 0 }}>#{String(printEnrollment.id).padStart(5, "0")}</p>
                  <p style={{ margin: 0 }}>Date: {new Date().toLocaleDateString()}</p>
                </div>
              </div>

              {/* Info Sections */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                <div style={{ background: "#f1f5f9", padding: "15px", borderRadius: "8px" }}>
                  <p style={{ fontSize: "12px", color: "#555", marginBottom: "6px" }}>Bill To</p>
                  <p style={{ fontWeight: "bold" }}>
                    {printEnrollment.first_name} {printEnrollment.last_name}
                  </p>
                  <p>Email: {printEnrollment.email}</p>
                  <p>Phone: {printEnrollment.phone}</p>
                </div>

                <div style={{ background: "#f1f5f9", padding: "15px", borderRadius: "8px" }}>
                  <p style={{ fontSize: "12px", color: "#555", marginBottom: "6px" }}>Course Info</p>
                  <p>Course: {getCourseName(printEnrollment.course_id)}</p>
                  <p>Term: {getTermName(printEnrollment.term_id)}</p>
                  <p>Timeslot: {getTimeslot(printEnrollment.timeslot_id)}</p>
                </div>
              </div>

              {/* Price Table */}
              <table
                style={{
                  width: "100%",
                  marginTop: "20px",
                  borderCollapse: "collapse",
                }}
              >
                <thead>
                  <tr>
                    <th
                      style={{
                        background: "#1e3a5f",
                        color: "white",
                        padding: "10px",
                        textAlign: "left",
                      }}
                    >
                      Description
                    </th>
                    <th
                      style={{
                        background: "#1e3a5f",
                        color: "white",
                        padding: "10px",
                        textAlign: "right",
                      }}
                    >
                      Amount
                    </th>
                  </tr>
                </thead>

                <tbody>
                  <tr>
                    <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>
                      Course Fee
                    </td>
                    <td style={{ padding: "10px", textAlign: "right", borderBottom: "1px solid #ddd" }}>
                      ${getPrice(printEnrollment.price_id)}
                    </td>
                  </tr>

                  <tr>
                    <td style={{ padding: "10px", fontWeight: "bold", background: "#f8fafc" }}>
                      Total
                    </td>
                    <td
                      style={{
                        padding: "10px",
                        textAlign: "right",
                        fontWeight: "bold",
                        background: "#f8fafc",
                      }}
                    >
                      ${getPrice(printEnrollment.price_id)}
                    </td>
                  </tr>
                </tbody>
              </table>

              <p
                style={{
                  textAlign: "center",
                  marginTop: "30px",
                  fontSize: "12px",
                  color: "#666",
                }}
              >
                Thank you for enrolling with EduCenter!
              </p>
            </div>

            {/* Buttons */}
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px" }}>
              <button
                onClick={() => setPrintEnrollment(null)}
                style={{ padding: "8px 14px", background: "#ccc", border: "none", borderRadius: "4px" }}
              >
                Close
              </button>

              <button
                onClick={handlePrint}
                style={{
                  padding: "8px 14px",
                  background: "#1e3a5f",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                }}
              >
                Print Invoice
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
