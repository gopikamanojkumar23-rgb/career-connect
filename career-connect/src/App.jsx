
import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import UserHeader from './User/Components/UserHeader.jsx'
import UserSlidebar from './User/Components/UserSidebar.jsx'
import UserLayout from './User/Components/UserLayout'

import UserDashboard from './User/Pages/UserDashboard'
import MyAssingment from './User/Pages/MyAssignments'
import MyProgress from './User/Pages/MyProgress'
import Notification from './User/Pages/Notifications'
import Profile from './User/Pages/Profile'
import SubmitWork from './User/Pages/SubmitWork'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<UserLayout />}>
          <Route path="/" element={<UserDashboard />} />
          <Route path="/assignments" element={<MyAssingment />} />
          <Route path="/progress" element={<MyProgress />} />
          <Route path="/notifications" element={<Notification />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/submit-work" element={<SubmitWork />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
