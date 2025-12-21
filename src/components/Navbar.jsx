import React from 'react'
import { useState } from 'react'
import "../assets/style/Navbar.css";
function Navbar({ onMenuClick } ) {
  const [notificationOpen, setNotificationOpen] = useState(false)

  return (
   <>
   <nav className="navbar">
      <div className="navbar-left">
        <button className="menu-btn" onClick={onMenuClick} aria-label="Toggle menu">
          ☰
        </button>
        <input type="text" className="search-input" placeholder="Search students, courses..." />
      </div>

      <div className="navbar-right">
        <div className="notification-wrapper">
          <button
            className="icon-btn"
            onClick={() => setNotificationOpen(!notificationOpen)}
            aria-label="Notifications"
          >
            🔔<span className="badge">3</span>
          </button>

          {notificationOpen && (
            <div className="notification-dropdown">
              <div className="notification-item">New enrollment from John Doe</div>
              <div className="notification-item">Course "Advanced React" is full</div>
              <div className="notification-item">Payment received - $450.00</div>
            </div>
          )}
        </div>

        <button className="profile-avatar" aria-label="User profile">
          👤
        </button>
      </div>
    </nav>
   </>
  )
}

export default Navbar
