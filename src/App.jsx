import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Route, Routes } from 'react-router-dom'
import Login from './log/Login';
import './log/Login.css';
import Register from './log/Register'
import Dashboard from './page/Dashboard'
import "bootstrap-icons/font/bootstrap-icons.css";
import AddCourseModal from './page/AddCourseModal';
import AddtermModal from './page/AddtermModal'
import AddpriceModal from './page/AddpriceModal'

import EnrollmentManagement from './page/EnrollmentManagement'
import InvoicePage from './page/InvoicePage'
import EnrollmentChart from './components/EnrollmentChart'
import { CourseDistributionChart } from './components/CourseDistributionChart'




function App() {
  // const [count, setCount] = useState(0)

  return (
   <Routes>
        <Route path="/" element={<Login/>} />
        <Route path='/register' element={<Register/>}></Route>
        <Route path='/Dashboard' element={<Dashboard/>}></Route>
        <Route path='/AddCourseModal' element={<AddCourseModal/>}></Route>
        <Route path='/term&time' element={<AddtermModal/>}></Route>
        <Route path='/pricemanagerment' element={<AddpriceModal/>}></Route>
        <Route path='/Entrollment' element={<EnrollmentManagement/>}></Route>
        <Route path='/invoice/:id' element={<InvoicePage/>}></Route>
        <Route path='/chart' element={<CourseDistributionChart/>}></Route>

   </Routes>
  )
}

export default App
