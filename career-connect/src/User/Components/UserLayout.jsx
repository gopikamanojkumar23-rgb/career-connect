
import UserHeader from './UserHeader'
import UserSidebar from './UserSidebar'

function UserLayout({ children }) {
  return (
    <div className="min-h-screen bg-black text-yellow-400">
      <UserHeader />

      <div className="flex">
        <UserSidebar />

        <main className="min-w-0 flex-1 p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}

export default UserLayout
