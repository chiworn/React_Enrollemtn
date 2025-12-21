import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTachometerAlt,faRightFromBracket , faUserGraduate, faBook, faCheck, faDollarSign, faCalendar, faClock, faCog } from '@fortawesome/free-solid-svg-icons';
import "../assets/style/sidebar.css";
import { Link } from "react-router-dom";
import { useState } from "react";
export default function Sidebar() {
     const [open, setOpen] = useState(true)
const menuItems = [
  { label: "Dashboard", icon: <FontAwesomeIcon icon={faTachometerAlt} />, href: "/Dashboard" },
  { label: "Entrollment", icon: <FontAwesomeIcon icon={faUserGraduate} />, href: "/Entrollment" },
  { label: "Courses", icon: <FontAwesomeIcon icon={faBook} />, href: "/AddCourseModal" },
  { label: "Term & Time", icon: <FontAwesomeIcon icon={faCheck} />, href: "/term&time" },
  { label: "Price Plan", icon: <FontAwesomeIcon icon={faDollarSign} />, href: "/pricemanagerment" },
  { label: "Term Slots", icon: <FontAwesomeIcon icon={faCalendar} />, href: "#" },
  { label: "Time Slots", icon: <FontAwesomeIcon icon={faClock} />, href: "#" },
  { label: "Settings", icon: <FontAwesomeIcon icon={faCog} />, href: "#" },
];

  return (
    <>
    <aside className={`sidebar ${open ? "open" : "closed"}`}>
        <div className="sidebar-header mt-3  ">
          <div className="sidebar-logo">
            <span></span>
            {open && <span className="logo-text ">ETEC CENTER</span>}
             <p>building skill IT 2012</p>
           
          </div>
          
          <button className="close-btn" onClick={() => setOpen(false)} aria-label="Close sidebar">
            ✕
          </button>
        </div>
        <hr />
       

        <nav className="sidebar-nav pt-5 ">
          {menuItems.map((item) => (
           
              <Link key={item.label} to={item.href} className="nav-item fs-5" title={item.label}>
              <span className="nav-icon p-0">{item.icon}</span>
              {open && <span className="nav-label m-0">{item.label}</span>}
            </Link>
          ))}
        </nav>

        <div className="sidebar-footer ">
          <a href="#" className="nav-item logout" title="Logout">
            <span className="nav-icon"><FontAwesomeIcon icon={faRightFromBracket} />  </span>
            {open && <span className="nav-label fs-5 text-danger">Logout</span>}
          </a>
        </div>
      </aside>

      {open && <div className="sidebar-overlay" onClick={() => setOpen(false)} />}
    </>
  );
}
