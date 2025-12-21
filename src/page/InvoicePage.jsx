
import React, { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import "../assets/style/invoce.css";
import Sidebar from "../components/Sidebar";

export default function InvoicePage() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const token = localStorage.getItem("token");
  
  useEffect(() => {
    fetch(`http://127.0.0.1:8000/api/admin/enrollment/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((res) => setData(res.data));
  }, [id]);

  // 🔹 Auto print after load (optional)
  useEffect(() => {
    if (data) {
      setTimeout(() => window.print(), 500);
    }
  }, [data]);

  if (!data) return <p>Loading invoice...</p>;
  
  return (
      <div className="invoice-layout">
      {/* ✅ Sidebar SHOW on screen */}
      <Sidebar />

      {/* Invoice content */}
      <div className="invoice-content">
        <div className="invoice-container">
          <h2 className="text-center">INVOICE</h2>

          <p><strong>Student:</strong> {data.Frist_name} {data.last_name}</p>
          <p><strong>Course:</strong> {data.course?.course_name}</p>
          <p><strong>Time:</strong> {data.timeslot?.start_time} - {data.timeslot?.end_time}</p>
          <p><strong>Price:</strong> ${data.price?.price_course}</p>

          <div className="print-btn">
            <button onClick={() => window.print()} className="btn btn-primary">
              🖨 Print Invoice
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
