import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AddStudent from "./pages/admin/AddStudent";
import AddFaculty from "./pages/admin/AddFaculty";
import AllCourses from "./pages/admin/AllCourses";
import CreateCourseOffering from "./pages/admin/CreateCourseOffering";
import ViewAllStudents from "./pages/admin/ViewAllStudents";
import ViewAllFaculty from "./pages/admin/ViewAllFaculty";
import ViewCurrentCourseOfferings from "./pages/admin/ViewCurrentcourseOfferings";

import FacultyProfile from "./pages/faculty/FacultyProfile";
import FacultyCurrentCourses from "./pages/faculty/CurrentCourses";
import ApproveEnrollment from "./pages/faculty/ApproveEnrollment";

import StudentProfile from "./pages/student/StudentProfile";
import StudentCurrentCourses from "./pages/student/CurrentCourses";
import Registration from "./pages/student/Registration";
import PrevGradeSheet from "./pages/student/PrevGradeSheet";

import Login from "./pages/Login";

import Otp from "./pages/Otp";

import ForgotPassword from "./pages/ForgotPassword";

import ResetPassword from "./pages/ResetPassword";




function App() {
  return (
    <>
      <Toaster position="top-right" />
      <Router>
      <Routes>

        {/* LOGIN PAGE */}
        <Route path="/login" element={<Login />} />

        {/* HOME PAGE */}
        <Route
          path="/"
          element={
            <h1 className="text-center mt-10 text-3xl">
              Welcome to Course Registration System
            </h1>
          }
        />

        {/*OTP PAGE */}
        <Route path="/otp" element={<Otp />} />

        {/*FORGOT PASSWORD PAGE */}
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/*RESET PASSWORD PAGE*/}
        <Route path="/reset-password" element={<ResetPassword />} />


        {/* ADMIN ROUTES */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/add-student" element={<AddStudent />} />
        <Route path="/admin/add-faculty" element={<AddFaculty />} />
        <Route path="/admin/all-courses" element={<AllCourses />} />
        <Route path="/admin/create-course-offering" element={<CreateCourseOffering />} />
        <Route path="/admin/view-all-students" element={<ViewAllStudents />} />
        <Route path="/admin/view-all-faculty" element={<ViewAllFaculty />} />
        <Route path="/admin/view-current-offerings" element={<ViewCurrentCourseOfferings />} />

        {/* FACULTY ROUTES */}
        <Route path="/faculty/profile" element={<FacultyProfile />} />
        <Route path="/faculty/current-courses" element={<FacultyCurrentCourses />} />
        <Route path="/faculty/approve-enrollment" element={<ApproveEnrollment />} />

        {/* STUDENT ROUTES */}
        <Route path="/student/profile" element={<StudentProfile />} />
        <Route path="/student/current-courses" element={<StudentCurrentCourses />} />
        <Route path="/student/registration" element={<Registration />} />
        <Route path="/student/previous-grades" element={<PrevGradeSheet />} />


      </Routes>
    </Router>
    </>
    
  );
}

export default App;
