import { useNavigate, Link } from 'react-router-dom'

export default function Dashboard() {
  const nav = useNavigate()

  function logout() {
    localStorage.removeItem('auth')
    nav('/login')
  }

  return (
    <div className="dash-wrap">
      <h1 data-testid="dashboard-heading">Welcome, Admin</h1>
      <p>You are logged in to the Employee Portal</p>
      <div className="dash-nav">
        <Link to="/employee" data-testid="emp-form-link">Employee Form</Link>
        <button
          className="btn"
          onClick={logout}
          data-testid="logout-btn"
          style={{ width: 'auto', padding: '10px 22px' }}
        >
          Logout
        </button>
      </div>
    </div>
  )
}
