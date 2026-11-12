import { Navigate, Outlet } from 'react-router-dom'
import { useSession } from '../App.jsx'

export default function ProtectedRoute({ roles }) {
  const { user } = useSession()
  if (!user || !localStorage.getItem('rtc-token')) return <Navigate to="/login" replace />
  if (roles && !roles.includes(user.role)) {
    const home = user.role === 'ADMIN' ? '/admin' : user.role === 'RTC_OFFICER' ? '/officer' : '/dashboard'
    return <Navigate to={home} replace />
  }
  return <Outlet />
}