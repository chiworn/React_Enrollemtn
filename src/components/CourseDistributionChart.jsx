import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";

const COLORS = [
  "#1e40af",
  "#0d9488",
  "#f59e0b",
  "#16a34a",
  "#0284c7",
  "#7c3aed",
];

export function CourseDistributionChart() {
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
        const rows = response.data || [];
        console.log(rows)

        // 🔹 Group by course_name
        const courseMap = {};

      rows.forEach((row) => {
      const course =
        row.course?.course_name || row.course_name || "Unknown";

      courseMap[course] = (courseMap[course] || 0) + 1;
});

        // 🔹 Convert to PieChart format
        const chartData = Object.keys(courseMap).map((course, index) => ({
          name: course,
          value: courseMap[course],
          color: COLORS[index % COLORS.length],
        }));

        setData(chartData);
      })
      .catch(console.error);
  }, []);

  return (
    <div className="rounded-xl bg-card p-6 shadow-card bg-white rounded-3">
      <h4 className="mb-6 text-start pt-4 ps-5 font-semibold">
        Course Distribution
      </h4>

      <div style={{ height: 342 , width:640 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={140}
              paddingAngle={4}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color}
                />
              ))}
            </Pie>

            <Tooltip
              formatter={(value) => [`${value}`, "Enrollments"]}
            />

            <Legend
              layout="vertical"
              align="right"
              verticalAlign="middle"
              iconType="circle"
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
