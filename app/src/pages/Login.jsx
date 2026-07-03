import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

const VALID_EMAIL = 'admin@corp.com'
const VALID_PASS = 'Admin@123'

function validate(email, pass) {
  const errs = {}
  const trimEmail = email.trim()
  const trimPass = pass.trim()

  if (!trimEmail) {
    errs.email = 'Email is required'
  } else if (trimEmail.length > 150) {
    errs.email = 'Email is too long'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimEmail)) {
    errs.email = 'Enter a valid email address'
  }

  if (!trimPass) {
    errs.pass = 'Password is required'
  }

  return errs
}

export default function Login() {
  const nav = useNavigate()
  const [email, setEmail] = useState('')
  const [pass, setPass] = useState('')
  const [show, setShow] = useState(false)
  const [errs, setErrs] = useState({})
  const [apiErr, setApiErr] = useState('')

  function submit(e) {
    e.preventDefault()
    const found = validate(email, pass)
    if (Object.keys(found).length > 0) {
      setErrs(found)
      setApiErr('')
      return
    }

    if (email.trim() === VALID_EMAIL && pass === VALID_PASS) {
      localStorage.setItem('auth', 'true')
      nav('/dashboard')
    } else {
      setApiErr('Invalid email or password')
    }
  }

  function change(setter, field) {
    return (e) => {
      setter(e.target.value)
      if (errs[field]) setErrs(prev => ({ ...prev, [field]: '' }))
      setApiErr('')
    }
  }

  return (
    <div className="card">
      <h1 className="card-title">Welcome</h1>
      <p className="card-sub">Login to your account</p>

      {apiErr && <div className="alert error" data-testid="api-error">{apiErr}</div>}

      <form onSubmit={submit} noValidate>
        <div className="field">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            placeholder="Email"
            value={email}
            onChange={change(setEmail, 'email')}
            className={errs.email ? 'err' : ''}
            data-testid="email-input"
            maxLength={200}
          />
          {errs.email && <p className="err-msg" data-testid="email-error">{errs.email}</p>}
        </div>

        <div className="field">
          <label htmlFor="password">Password</label>
          <div className="pw-wrap">
            <input
              id="password"
              type={show ? 'text' : 'password'}
              placeholder="Password"
              value={pass}
              onChange={change(setPass, 'pass')}
              className={errs.pass ? 'err' : ''}
              data-testid="password-input"
            />
            <button
              type="button"
              className="pw-toggle"
              onClick={() => setShow(s => !s)}
              data-testid="pw-toggle"
              aria-label="Toggle password visibility"
            >
              {show ? 'Hide' : 'Show'}
            </button>
          </div>
          {errs.pass && <p className="err-msg" data-testid="password-error">{errs.pass}</p>}
        </div>

        <div className="forgot">
          <Link to="/forgot" data-testid="forgot-link">Forgot Password?</Link>
        </div>

        <button
          type="submit"
          className="btn"
          data-testid="login-btn"
          disabled={!email && !pass}
        >
          Login
        </button>
      </form>

      <p className="link">
        Don't have an account? <Link to="/register" data-testid="register-link">Create Now</Link>
      </p>
    </div>
  )
}
