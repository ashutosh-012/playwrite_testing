import { useState } from 'react'

const DEPTS = ['', 'Engineering', 'Marketing', 'Finance', 'HR', 'Operations', 'Design']

function validate(f) {
  const errs = {}

  if (!f.name.trim()) {
    errs.name = 'Full name is required'
  } else if (f.name.trim().length < 2) {
    errs.name = 'Name must be at least 2 characters'
  } else if (f.name.trim().length > 80) {
    errs.name = 'Name must be under 80 characters'
  } else if (/\d/.test(f.name)) {
    errs.name = 'Name cannot contain numbers'
  }

  if (!f.email.trim()) {
    errs.email = 'Email is required'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.trim())) {
    errs.email = 'Enter a valid email address'
  }

  if (!f.phone.trim()) {
    errs.phone = 'Phone number is required'
  } else if (!/^\d{10,15}$/.test(f.phone.trim())) {
    errs.phone = 'Enter a valid phone number (digits only, 10-15)'
  }

  if (!f.dept) {
    errs.dept = 'Please select a department'
  }

  if (!f.role.trim()) {
    errs.role = 'Role is required'
  }

  return errs
}

const empty = { name: '', email: '', phone: '', dept: '', role: '' }

export default function EmployeeForm() {
  const [form, setForm] = useState(empty)
  const [errs, setErrs] = useState({})
  const [success, setSuccess] = useState(false)

  function change(field) {
    return (e) => {
      setForm(prev => ({ ...prev, [field]: e.target.value }))
      if (errs[field]) setErrs(prev => ({ ...prev, [field]: '' }))
      setSuccess(false)
    }
  }

  function submit(e) {
    e.preventDefault()
    const found = validate(form)
    if (Object.keys(found).length > 0) {
      setErrs(found)
      setSuccess(false)
      return
    }
    setSuccess(true)
    setForm(empty)
    setErrs({})
  }

  function reset() {
    setForm(empty)
    setErrs({})
    setSuccess(false)
  }

  return (
    <div className="card" style={{ maxWidth: 480 }}>
      <h1 className="card-title">Employee Form</h1>
      <p className="card-sub">Submit employee information</p>

      {success && (
        <div className="alert success" data-testid="form-success">
          Employee record submitted successfully
        </div>
      )}

      <form onSubmit={submit} noValidate>
        <div className="field">
          <label htmlFor="emp-name">Full Name</label>
          <input
            id="emp-name"
            type="text"
            placeholder="Full Name"
            value={form.name}
            onChange={change('name')}
            className={errs.name ? 'err' : ''}
            data-testid="emp-name-input"
          />
          {errs.name && <p className="err-msg" data-testid="emp-name-error">{errs.name}</p>}
        </div>

        <div className="field">
          <label htmlFor="emp-email">Email</label>
          <input
            id="emp-email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={change('email')}
            className={errs.email ? 'err' : ''}
            data-testid="emp-email-input"
          />
          {errs.email && <p className="err-msg" data-testid="emp-email-error">{errs.email}</p>}
        </div>

        <div className="field">
          <label htmlFor="emp-phone">Phone</label>
          <input
            id="emp-phone"
            type="text"
            placeholder="Phone Number"
            value={form.phone}
            onChange={change('phone')}
            className={errs.phone ? 'err' : ''}
            data-testid="emp-phone-input"
          />
          {errs.phone && <p className="err-msg" data-testid="emp-phone-error">{errs.phone}</p>}
        </div>

        <div className="field">
          <label htmlFor="emp-dept">Department</label>
          <select
            id="emp-dept"
            value={form.dept}
            onChange={change('dept')}
            className={errs.dept ? 'err' : ''}
            data-testid="emp-dept-select"
          >
            {DEPTS.map(d => (
              <option key={d} value={d}>{d || 'Select Department'}</option>
            ))}
          </select>
          {errs.dept && <p className="err-msg" data-testid="emp-dept-error">{errs.dept}</p>}
        </div>

        <div className="field">
          <label htmlFor="emp-role">Role</label>
          <input
            id="emp-role"
            type="text"
            placeholder="Role / Job Title"
            value={form.role}
            onChange={change('role')}
            className={errs.role ? 'err' : ''}
            data-testid="emp-role-input"
          />
          {errs.role && <p className="err-msg" data-testid="emp-role-error">{errs.role}</p>}
        </div>

        <button type="submit" className="btn" data-testid="emp-submit-btn">
          Submit
        </button>

        <button
          type="button"
          className="btn btn-ghost"
          onClick={reset}
          data-testid="emp-reset-btn"
          style={{ marginTop: 10 }}
        >
          Reset
        </button>
      </form>
    </div>
  )
}
