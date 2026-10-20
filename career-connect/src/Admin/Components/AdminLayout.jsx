import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Outlet } from 'react-router-dom'

import { fetchAssignments } from '../../Redux/Slice/assignmentSlice'
import { fetchNotifications } from '../../Redux/Slice/notificationSlice'
import { fetchSubmissions } from '../../Redux/Slice/submissionSlice'
import { fetchUsers } from '../../Redux/Slice/userSlice'
import AdminHeader from './AdminHeader'
import AdminSidebar from './AdminSidebar'

function AdminLayout() {
  const dispatch = useDispatch()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  // Every admin page works on the same career-server records.
  useEffect(() => {
    dispatch(fetchUsers())
    dispatch(fetchAssignments())
    dispatch(fetchSubmissions())
    dispatch(fetchNotifications())
  }, [dispatch])

  return (
    <div className="min-h-screen bg-black text-neutral-200">
      <AdminSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <div className="lg:pl-64">
        <AdminHeader onToggleSidebar={() => setIsSidebarOpen(true)} />

        <main className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AdminLayout
