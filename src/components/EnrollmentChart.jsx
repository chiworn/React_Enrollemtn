import { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function EnrollmentChart() {
  const [data, setData] = useState([]);
useEffect(() => {
  const token = localStorage.getItem("token");

  fetch("https://laravel-api-enrollmentnew-main-m8wa07.free.laravel.cloud/api/admin/enrollment", {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((response) => {
      const rows = response.data; // ✅ IMPORTANT

      const monthMap = {};

      rows.forEach((row) => {
        const month = new Date(row.created_at).toLocaleString("en-US", {
          month: "short",
        });

        monthMap[month] = (monthMap[month] || 0) + 1;
      });

      const chartData = Object.keys(monthMap).map((m) => ({
        month: m,
        enrollments: monthMap[m],
      }));

      setData(chartData);
    })
    .catch(console.error);
}, []);
console.log("Data tred course : ",data);


  return (
    <div className="container-fluid bg-white rounded-3 shadow-card ms-3" >
      <h6 className="mb-6 text-start fs-4 font-semibold ps-3 pt-3">Enrollment Trends</h6>

      <div style={{ height: "350px" ,width: "720px" }} className="py-3"> 
        <ResponsiveContainer width="100%" height="100%" >
          <AreaChart data={data}>
            <defs>
              <linearGradient
                id="enrollmentGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="5%" stopOpacity={0.3} />
                <stop offset="95%" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />

            <Area
              type="monotone"
              dataKey="enrollments"
              stroke="#1e40af"
              fill="url(#enrollmentGradient)"
              strokeWidth={3}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
