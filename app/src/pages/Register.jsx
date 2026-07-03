import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function validate(f) {
  const errs = {}

  if (!f.username.trim()) {
    errs.username = 'Username is required'
  } else if (f.username.trim().length < 3) {
    errs.username = 'Username must be at least 3 characters'
  }

  if (!f.email.trim()) {
    errs.email = 'Email is required'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.trim())) {
    errs.email = 'Enter a valid email address'
  }

  if (!f.mobile.trim()) {
    errs.mobile = 'Mobile number is required'
  } else if (!/^\d{10,15}$/.test(f.mobile.trim())) {
    errs.mobile = 'Enter a valid mobile number (10-15 digits)'
  }

  if (!f.pass) {
    errs.pass = 'Password is required'
  } else if (f.pass.length < 8) {
    errs.pass = 'Password must be at least 8 characters'
  }

  return errs
}

export default function Register() {
  const nav = useNavigate()
  const [form, setForm] = useState({ username: '', email: '', mobile: '', pass: '' })
  const [show, setShow] = useState(false)
  const [errs, setErrs] = useState({})
  const [done, setDone] = useState(false)

  function change(field) {
    return (e) => {
      setForm(prev => ({ ...prev, [field]: e.target.value }))
      if (errs[field]) setErrs(prev => ({ ...prev, [field]: '' }))
    }
  }

  function submit(e) {
    e.preventDefault()
    const found = validate(form)
    if (Object.keys(found).length > 0) {
      setErrs(found)
      return
    }
    setDone(true)
    setTimeout(() => nav('/login'), 1500)
  }

  return (
    <div className="card">
      <h1 className="card-title">Register</h1>
      <p className="card-sub">Create a new account</p>

      {done && <div className="alert success" data-testid="register-success">Account created! Redirecting...</div>}

      <form onSubmit={submit} noValidate>
        <div className="field">
          <label htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            placeholder="Username"
            value={form.username}
            onChange={change('username')}
            className={errs.username ? 'err' : ''}
            data-testid="username-input"
          />
          {errs.username && <p className="err-msg" data-testid="username-error">{errs.username}</p>}
        </div>

        <div className="field">
          <label htmlFor="reg-email">Email</label>
          <input
            id="reg-email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={change('email')}
            className={errs.email ? 'err' : ''}
            data-testid="reg-email-input"
          />
          {errs.email && <p className="err-msg" data-testid="reg-email-error">{errs.email}</p>}
        </div>

        <div className="field">
          <label htmlFor="mobile">Mobile Number</label>
          <input
            id="mobile"
            type="text"
            placeholder="Mobile Number"
            value={form.mobile}
            onChange={change('mobile')}
            className={errs.mobile ? 'err' : ''}
            data-testid="mobile-input"
          />
          {errs.mobile && <p className="err-msg" data-testid="mobile-error">{errs.mobile}</p>}
        </div>

        <div className="field">
          <label htmlFor="reg-pass">Password</label>
          <div className="pw-wrap">
            <input
              id="reg-pass"
              type={show ? 'text' : 'password'}
              placeholder="Password"
              value={form.pass}
              onChange={change('pass')}
              className={errs.pass ? 'err' : ''}
              data-testid="reg-pass-input"
            />
            <button
              type="button"
              className="pw-toggle"
              onClick={() => setShow(s => !s)}
              data-testid="reg-pw-toggle"
            >
              {show ? 'Hide' : 'Show'}
            </button>
          </div>
          {errs.pass && <p className="err-msg" data-testid="reg-pass-error">{errs.pass}</p>}
        </div>

        <button type="submit" className="btn" data-testid="register-btn">
          Register
        </button>
      </form>

      <p className="link">
        Already have an account? <Link to="/login" data-testid="login-link">Login</Link>
      </p>
    </div>
  )
}
