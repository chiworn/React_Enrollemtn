import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "@fontsource/poppins";          // Default weight
import "@fontsource/poppins/400.css";  // Normal
import "@fontsource/poppins/600.css";  // Semi-bold
import "@fontsource/poppins/700.css";  // Bold
import App from './App.jsx';
import ReactDOM from "react-dom/client";
import { BrowserRouter } from 'react-router-dom';

createRoot(document.getElementById('root')).render(
  <StrictMode>
   <BrowserRouter>
     <App/>
   </BrowserRouter>
  </StrictMode>,
)
