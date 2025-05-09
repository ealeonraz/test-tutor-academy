import React, { useLayoutEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/HomePage/Home.jsx';
import StudentDashboardHome from './pages/dashboard/Dashboard.jsx';
import TutorDashboardHome from './pages/TutorDashboard';
import StudentProfileView from './pages/StudentProfileView.jsx';
import "./App.css";
import Layout from './components/Layout';
import NotesPage from './pages/NotesPage/NotesPage.jsx';
import SearchResults from './pages/SearchResults/SearchResults.jsx';
import PrivateRoute from "./context/PrivateRoutes.jsx"
import StudentDashboardCalendar from './pages/Calendar/DashboardCalendar.jsx';
import AdminDashboardHome from './pages/AdminDashboard.jsx';
import TutorProfileView from './pages/TutorProfileView.jsx';
import ResetPassword from './pages/ResetPassword';
import TutorPayrollPage from './pages/TutorPayrollPage.jsx';




function App() {
  return (

    <Routes element={<Layout />}>
      <Route path="/" element={<Home />} />
      <Route element = {<PrivateRoute/>}>
        <Route path="/student-dashboard" element={<StudentDashboardHome />} />
        <Route path="/student-dashboard/calendar" element={<StudentDashboardCalendar/>}/>
        <Route path="/studentdashboard/search-results" element={<SearchResults />} />
        <Route path="/admin-dashboard" element={<AdminDashboardHome/>}/>
        <Route path="/admin-dashboard/tutors" element={<TutorProfileView />} />
        <Route path="/tutor-dashboard/payroll" element={<TutorPayrollPage />} />
        <Route path="/tutor-dashboard" element={<TutorDashboardHome />} />
        <Route path="/tutor-dashboard/students" element={<StudentProfileView />} />
        <Route path="/student-dashboard/notes" element={<NotesPage/>} />
      </Route>
      <Route path="/reset-password" element={<ResetPassword/>}/>
    </Routes>
  );
}

export default App;
