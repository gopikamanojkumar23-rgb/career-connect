import { BrowserRouter, Route, Routes } from 'react-router-dom'

import './App.css'

import ProtectedRoute from './Components/ProtectedRoute'

import AdminLayout from './Admin/Components/AdminLayout'
import AdminDashboard from './Admin/Pages/AdminDashboard'
import AdminFeedback from './Admin/Pages/AdminFeedback'
import AdminNotifications from './Admin/Pages/AdminNotifications'
import AdminProgress from './Admin/Pages/AdminProgress'
import AdminReports from './Admin/Pages/AdminReports'
import AdminStudyPlan from './Admin/Pages/AdminStudyPlan'
import CreateAssignments from './Admin/Pages/CreateAssignments'
import ManageAssignments from './Admin/Pages/ManageAssignments'
import ManageUsers from './Admin/Pages/ManageUsers'
import Submissions from './Admin/Pages/Submissions'

import UserLayout from './User/Components/UserLayout'

import UserDashboard from './User/Pages/UserDashboard'
import MyAssingment from './User/Pages/MyAssignments'
import MyProgress from './User/Pages/MyProgress'
import Notification from './User/Pages/Notifications'
import Profile from './User/Pages/Profile'
import SubmitWork from './User/Pages/SubmitWork'

import Home from './Pages/Home'
import Login from './Pages/Login'
import Register from './Pages/Register'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          element={
            <ProtectedRoute>
              <UserLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<UserDashboard />} />
          <Route path="/assignments" element={<MyAssingment />} />
          <Route path="/progress" element={<MyProgress />} />
          <Route path="/notifications" element={<Notification />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/submit-work" element={<SubmitWork />} />
        </Route>

        <Route
          element={
            <ProtectedRoute allowedRoles={['Admin']}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<ManageUsers />} />
          <Route path="/admin/assignments" element={<ManageAssignments />} />
          <Route path="/admin/assignments/create" element={<CreateAssignments />} />
          <Route path="/admin/study-plan" element={<AdminStudyPlan />} />
          <Route path="/admin/submissions" element={<Submissions />} />
          <Route path="/admin/progress" element={<AdminProgress />} />
          <Route path="/admin/notifications" element={<AdminNotifications />} />
          <Route path="/admin/feedback" element={<AdminFeedback />} />
          <Route path="/admin/reports" element={<AdminReports />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}


export default App
