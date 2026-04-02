import React, { useEffect, useRef, useState } from "react";
import "./Login.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGraduationCap } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from "react-router-dom";
import { faArrowRightToBracket } from "@fortawesome/free-solid-svg-icons";
import Swal from 'sweetalert2';
import axios from "axios";
export default function Login() {
  const particlesRef = useRef(null);
  useEffect(() => {
    // Disable pinch zoom
    const handleTouchMove = (e) => {
      if (e.scale !== 1) e.preventDefault();
    };

    // Disable Ctrl + scroll / Ctrl + + / Ctrl + -
    const handleWheel = (e) => {
      if (e.ctrlKey) e.preventDefault();
    };
    const handleKeyDown = (e) => {
      if (e.ctrlKey && (e.key === "+" || e.key === "-" || e.key === "0")) {
        e.preventDefault();
      }
    };

    document.addEventListener("wheel", handleWheel, { passive: false });
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("touchmove", handleTouchMove, { passive: false });

    return () => {
      document.removeEventListener("wheel", handleWheel);
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("touchmove", handleTouchMove);
    };
  }, []);
  const navigate = useNavigate();
  useEffect(() => {
    // Load particles.js script
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js";
    script.async = true;
    
    script.onload = () => {
      if (window.particlesJS && particlesRef.current) {
        window.particlesJS("particles-js", {
          particles: {
            number: { 
              value: 120, 
              density: { 
                enable: true, 
                value_area: 1000 
              } 
            },
            color: { value: "#000" },
            shape: { type: "circle" },
            opacity: { 
              value: 0.5, 
              random: true 
            },
            size: { 
              value: 3, 
              random: true 
            },
            line_linked: {
              enable: true,
              distance: 150,
              color: "#000",
              opacity: 0.4,
              width: 1,
            },
            move: { 
              enable: true, 
              speed: 2.5, 
              direction: "none", 
              out_mode: "bounce" 
            },
          },
          interactivity: {
            detect_on: "canvas",
            events: {
              onhover: { 
                enable: true, 
                mode: "repulse" 
              },
              onclick: { 
                enable: true, 
                mode: "push" 
              },
            },
            modes: { 
              repulse: { 
                distance: 120, 
                duration: 0.4 
              } 
            },
          },
          retina_detect: true,
        });
      }
    };

    document.body.appendChild(script);

    // Parallax effect
    const bg = document.getElementById("particles-js");
    const handleMouseMove = (e) => {
      if (bg) {
        const x = (window.innerWidth / 2 - e.pageX) / 40;
        const y = (window.innerHeight / 2 - e.pageY) / 40;
        bg.style.transform = `translate(${x}px, ${y}px) scale(1.05)`;
      }
    };

    document.addEventListener("mousemove", handleMouseMove);

    // Cleanup function
     
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      // Remove the script if component unmounts
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

    const [formData, setFormData] = useState({
      email: "",
      password: "",
    });
      const handleChange = (e) => {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      });
    };
     // 🔹 handle form submit
    const handleSubmit = async (e) => {
      e.preventDefault();
      console.log("Form data before fetch:", formData);
       try {
      const res = await axios.post("https://laravel-api-enrollmentnew-main-m8wa07.free.laravel.cloud/api/login", formData);

      // Example response: { token: "...", user: {...} }
      const token = res.data.token;
      const user = res.data.user;
      console.log(res);

      // Store token in localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      Swal.fire({
        icon: "success",
        title: "Login Successful",
        text: `Welcome back, ${user.name}!`,
        timer: 1000,
        showConfirmButton: false,
      });

      // Redirect to dashboard or home
      navigate("/Dashboard");
    } catch (error) {
      console.error("Login error:", error);
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: error.response?.data?.message || "Something went wrong",
      });
    }
    };


  return (
    <>
   
     
     <div className="login-page m-0">
         <div id="particles-js" ref={particlesRef}></div>
      <div className="login-container">
        <div className="login-card ">
          <div className="row g-0 h-100 w-100">
            {/* Left Side */}
            <div className="col-lg-5 col-md-6">
              <div className="login-left">
                <div>
                  <div className="brand-logo">
                    <FontAwesomeIcon className="iconst" icon={faGraduationCap} />
                    {/* <FontAwesomeIcon icon={byPrefixAndName.fas['graduation-cap']} /> */}
                  </div>
                  <h5 className="brand-title no-select ">ETEC CENTER</h5>
                  <p className="brand-subtitle no-select">Sign in to continue to your dashboard</p>
                </div>
              </div>
            </div>

            {/* Right Side */}
            <div className="col-lg-7 col-md-6">
              <div className="login-right">
                <h3 className="form-title no-select">Sign In</h3>

                 <form onSubmit={handleSubmit} method="post">

                        {/* Email */}
                        <div className="form-floating mb-3">
                        <input
                            type="email"
                            name="email"
                            className="form-control"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="name@example.com"
                            required
                        />
                        <label htmlFor="email">
                            <i className="fas fa-envelope me-2"></i>Email address
                        </label>
                        </div>

                        {/* Password */}
                        <div className="form-floating mb-3">
                        <input
                            type="password"
                            name="password"
                            className="form-control"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Password"
                            required
                        />
                        <label htmlFor="password">
                            <i className="fas fa-lock me-2"></i>Password
                        </label>
                        </div>

                        {/* Remember me + Forgot */}
                        <div className="d-flex justify-content-between align-items-center mb-3">
                        <div className="form-check">
                            <input className="form-check-input" type="checkbox" id="rememberMe" />
                            <label className="form-check-label" htmlFor="rememberMe">
                            Remember me
                            </label>
                        </div>
                        <a href="#" className="forgot-password">
                            Forgot Password?
                        </a>
                        </div>

                        {/* Submit */}
                        <button type="submit" className="btn btn-primary w-100">
                        <FontAwesomeIcon className="me-2" icon={faArrowRightToBracket} />Sing in
                        </button>
                    </form>

                <p className="signup-text no-select">
                  Don't have an account?{" "}
                  <Link to={'/register'} className="forgot-password no-select" >register accout</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
   
  );
}