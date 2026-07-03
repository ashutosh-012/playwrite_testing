import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import EmployeeForm from './pages/EmployeeForm'
import Dashboard from './pages/Dashboard'

function PrivateRoute({ children }) {
  const logged = localStorage.getItem('auth')
  return logged ? children : <Navigate to="/login" />
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/employee" element={<PrivateRoute><EmployeeForm /></PrivateRoute>} />
      </Routes>
    </BrowserRouter>
  )
}
