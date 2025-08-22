import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { courseService } from "@/services/api/courseService";
import { assignmentService } from "@/services/api/assignmentService";
import Assignments from "@/components/pages/Assignments";
import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Calendar from "@/components/pages/Calendar";
import CourseDetails from "@/components/pages/CourseDetails";
import Dashboard from "@/components/pages/Dashboard";
import Attendance from "@/components/pages/Attendance";
import Courses from "@/components/pages/Courses";
import Grades from "@/components/pages/Grades";
import Announcements from "@/components/pages/Announcements";
import Library from "@/components/pages/Library";
import BookIssues from "@/components/pages/BookIssues";
import Layout from "@/components/organisms/Layout";
function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
<Routes>
<Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
<Route path="courses" element={<Courses />} />
            <Route path="courses/:id" element={<CourseDetails />} />
            <Route path="assignments" element={<Assignments />} />
            <Route path="attendance" element={<Attendance />} />
            <Route path="grades" element={<Grades />} />
            <Route path="calendar" element={<Calendar />} />
            <Route path="announcements" element={<Announcements />} />
            <Route path="library" element={<Library />} />
            <Route path="book-issues" element={<BookIssues />} />
          </Route>
        </Routes>
        
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          style={{ zIndex: 9999 }}
        />
      </div>
    </BrowserRouter>
  );
}

export default App;