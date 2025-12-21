"use client"

import "../assets/style/statistic.css";

export default function StatisticCard({ title, value, icon, color }) {
  return (
            <div className="statistic-card col-2" style={{ borderTopColor: color }}>
            <div className="card-header">
                <h3 className="card-title">{title}</h3>
                <span className="card-icon" style={{ color }}>
                {icon}
                </span>
            </div>
            <div className="card-value">{value}</div>
            <div className="card-footer">
                <span className="trend trend-up">↑ 12% from last month</span>
            </div>
            </div>            
  )
}
