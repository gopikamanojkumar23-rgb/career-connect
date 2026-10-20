
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { Outlet } from 'react-router-dom'

import { fetchAssignments } from '../../Redux/Slice/assignmentSlice'
import { fetchNotifications } from '../../Redux/Slice/notificationSlice'
import { fetchSubmissions } from '../../Redux/Slice/submissionSlice'
import { fetchUsers } from '../../Redux/Slice/userSlice'
import UserHeader from './UserHeader'
import UserSidebar from './UserSidebar'

function UserLayout() {
  const dispatch = useDispatch()

  // The student portal reads the same records the admin panel writes to.
  useEffect(() => {
    dispatch(fetchUsers())
    dispatch(fetchAssignments())
    dispatch(fetchSubmissions())
    dispatch(fetchNotifications())
  }, [dispatch])

  return (
    <div className="min-h-screen bg-black text-yellow-400">
      <UserHeader />

      <div className="flex">
        <UserSidebar />

        <main className="min-w-0 flex-1 p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default UserLayout
