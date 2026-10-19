import { useState, useEffect } from 'react'

const initialEmployees = [
  { id: 1, name: 'Aarav Sharma', email: 'aarav@example.com', department: 'Engineering', role: 'Frontend Developer', salary: 45000, status: 'Active' },
  { id: 2, name: 'Priya Verma', email: 'priya@example.com', department: 'HR', role: 'HR Executive', salary: 35000, status: 'Active' },
  { id: 3, name: 'Rahul Singh', email: 'rahul@example.com', department: 'Finance', role: 'Accountant', salary: 40000, status: 'On Leave' },
  { id: 4, name: 'Neha Gupta', email: 'neha@example.com', department: 'Marketing', role: 'Marketing Manager', salary: 55000, status: 'Active' },
  { id: 5, name: 'Arjun Kumar', email: 'arjun@example.com', department: 'Engineering', role: 'Backend Developer', salary: 50000, status: 'Active' },
]

const departments = ['Engineering', 'HR', 'Finance', 'Marketing', 'Sales', 'Operations']

function App() {
  const [employees, setEmployees] = useState([])
const [loading, setLoading] = useState(true)
const [error, setError] = useState('')
useEffect(() => {
  fetch('http://localhost:5000/api/employees')
    .then((response) => {
      if (!response.ok) {
        throw new Error('Employees load nahi ho paye')
      }
      return response.json()
    })
    .then((data) => {
      setEmployees(
        data.map((employee) => ({
          id: employee.employee_id,
          name: employee.name,
          email: employee.email,
          department: employee.department,
          role: employee.role,
          salary: Number(employee.salary),
          status: employee.status,
        }))
      )
    })
    .catch((err) => setError(err.message))
    .finally(() => setLoading(false))
}, [])
  const [search, setSearch] = useState('')
  const [department, setDepartment] = useState('All Departments')
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [activePage, setActivePage] = useState('Dashboard')
  const [form, setForm] = useState({
    name: '', email: '', department: 'Engineering',
    role: '', salary: '', status: 'Active',
  })

  const filteredEmployees = employees.filter((employee) => {
    const matchesSearch =
      employee.name.toLowerCase().includes(search.toLowerCase()) ||
      employee.email.toLowerCase().includes(search.toLowerCase()) ||
      employee.role.toLowerCase().includes(search.toLowerCase())

  const matchesDepartment =
  department === 'All Departments' ||
  String(employee.department ?? '').trim().toLowerCase() ===
    department.trim().toLowerCase()
    return matchesSearch && matchesDepartment
  })

  const totalSalary = employees.reduce((total, employee) => total + Number(employee.salary || 0), 0)
  const activeEmployees = employees.filter((employee) => employee.status === 'Active').length

  function openAddForm() {
    setEditingId(null)
    setForm({
      name: '', email: '', department: 'Engineering',
      role: '', salary: '', status: 'Active',
    })
    setShowForm(true)
  }

  function openEditForm(employee) {
    setEditingId(employee.id)
    setForm({ ...employee, salary: String(employee.salary) })
    setShowForm(true)
  }

  async function handleDelete(id) {
  const confirmed = window.confirm(
    'Are you sure you want to delete this employee?'
  )

  if (!confirmed) return

  try {
    const response = await fetch(
      `http://localhost:5000/api/employees/${id}`,
      {
        method: 'DELETE',
      }
    )

    const data = await response.json()

    if (!response.ok) {
      alert(data.message || 'Employee delete nahi hua')
      return
    }

    setEmployees((currentEmployees) =>
      currentEmployees.filter((employee) => employee.id !== id)
    )

    alert('Employee deleted successfully!')
  } catch (error) {
    alert('Backend connect nahi ho raha. Server check karo.')
  }
}
  async function handleSubmit(event) {
    event.preventDefault()

    try {
      const response = await fetch(
  editingId !== null
    ? `http://localhost:5000/api/employees/${editingId}`
    : 'http://localhost:5000/api/employees',
  {
        method: editingId !== null ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          department: form.department,
          role: form.role,
          salary: Number(form.salary),
          status: form.status || 'Active',
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        alert(data.message || 'Employee save nahi hua')
        return
      }

      const updatedResponse = await fetch('http://localhost:5000/api/employees')
      const updatedEmployees = await updatedResponse.json()

      setEmployees(
        updatedEmployees.map((employee) => ({
          id: employee.employee_id,
          name: employee.name,
          email: employee.email,
          department: employee.department,
          role: employee.role,
          salary: Number(employee.salary),
          status: employee.status,
        }))
      )

      setShowForm(false)
    } catch (error) {
    console.error('Delete error:', error)
    alert('Delete error: ' + error.message)
}
  }

 async function deleteEmployee(id) {
  const confirmed = window.confirm(
    'Are you sure you want to delete this employee?'
  )

  if (!confirmed) return

  try {
    const response = await fetch(
      `http://localhost:5000/api/employees/${id}`,
      {
        method: 'DELETE',
      }
    )

    const data = await response.json()

    if (!response.ok) {
      alert(data.message || 'Employee delete nahi hua')
      return
    }

    setEmployees((current) =>
      current.filter((employee) => employee.id !== id)
    )

    alert('Employee deleted successfully!')
  } catch (error) {
    alert('Backend connect nahi ho raha. Server check karo.')
  }
}

  const stats = [
    { label: 'Total Employees', value: employees.length, icon: '👥', color: 'bg-blue-50 text-blue-600' },
    { label: 'Active Employees', value: activeEmployees, icon: '✓', color: 'bg-green-50 text-green-600' },
    { label: 'Departments', value: new Set(employees.map((employee) => employee.department)).size, icon: '▦', color: 'bg-purple-50 text-purple-600' },
    { label: 'Monthly Payroll', value: `₹${totalSalary.toLocaleString('en-IN')}`, icon: '₹', color: 'bg-orange-50 text-orange-600' },
  ]

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 md:flex">
      <aside className="w-full bg-slate-950 p-5 text-white md:min-h-screen md:w-64 md:shrink-0">
        <div className="mb-9 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-xl">👥</div>
<div className="min-w-0 flex-1">
<h1 style={{ color: '#ffffff', fontSize: '19px', fontWeight: '750', whiteSpace: 'nowrap' }}>
  EmployEase
</h1>

            <p className="text-xs text-slate-400">Employee Management</p>
          </div>
        </div>

        <p className="mb-3 text-xs font-semibold uppercase tracking-text-slate-500">Workspace</p>
        <nav className="flex gap-2 overflow-x-auto md:flex-col">
          {[
            ['Dashboard', '▦'],
            ['Employees', '👥'],
            ['Departments', '▤'],
          ].map(([label, icon]) => (
            <button
              key={label}
              onClick={() => setActivePage(label)}
              className={`flex shrink-0 items-center gap-3 rounded-xl px-4 py-3 text-left text-sm transition ${
                activePage === label
                  ? 'bg-blue-600 font-semibold text-white'
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <span>{icon}</span>{label}
            </button>
          ))}
        </nav>

        <div className="mt-10 hidden rounded-2xl border border-slate-800 bg-slate-900 p-4 md:block">
          <p className="font-semibold">Project Overview</p>
          <p className="mt-2 text-xs leading-5 text-slate-400">
            Manage employee records, departments and payroll in one place.
          </p>
        </div>

        <p className="mt-5 text-xs text-slate-500 md:mt-10">BCA Final Year Mini Project</p>
      </aside>

      <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-9">
        <header className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="mb-1 text-sm text-slate-500">Workspace / {activePage}</p>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              {activePage === 'Dashboard' ? 'Dashboard Overview' : activePage}
            </h2>
            <p className="mt-2 text-sm text-slate-500">Welcome back! Here is your team overview.</p>
          </div>
          <button
            onClick={openAddForm}
            className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
          >
            + Add Employee
          </button>
        </header>

        {activePage === 'Dashboard' && (
          <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-slate-500">{stat.label}</p>
                  <span className={`flex h-10 w-10 items-center justify-center rounded-xl font-bold ${stat.color}`}>
                    {stat.icon}
                  </span>
                </div>
                <p className="mt-4 break-words text-2xl font-bold">{stat.value}</p>
                <p className="mt-1 text-xs text-slate-400">Current records</p>
              </div>
            ))}
          </section>
        )}

        {activePage === 'Departments' ? (
          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {departments.map((dept) => {
              const count = employees.filter((employee) => employee.department === dept).length
              return (
                <button
                  key={dept}
                  onClick={() => {
                    setDepartment(dept)
                    setActivePage('Employees')
                  }}
                  className="rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sm transition hover:border-blue-300 hover:shadow-md"
                >
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-xl text-blue-600">▦</div>
                  <h3 className="font-bold">{dept}</h3>
                  <p className="mt-2 text-sm text-slate-500">{count} employees</p>
                </button>
              )
            })}
          </section>
        ) : (
          <>
            <section className="mb-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex flex-col gap-3 md:flex-row">
                <div className="relative flex-1">
                  <span className="absolute left-4 top-3 text-slate-400">⌕</span>
                  <input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search name, email or role..."
                    className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
                <select
                  value={department}
                  onChange={(event) => setDepartment(event.target.value)}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500"
                >
                  <option>All Departments</option>
                  {[...new Set([...departments, 'IT'])].map((dept) => (
  <option key={dept} value={dept}>{dept}</option>
))}
                </select>
              </div>
            </section>

            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="flex flex-col justify-between gap-2 border-b border-slate-100 p-5 sm:flex-row sm:items-center">
                <div>
                  <h3 className="font-bold">Employee Directory</h3>
                  <p className="mt-1 text-sm text-slate-500">View and manage your team members</p>
                </div>
                <span className="text-sm text-slate-500">{filteredEmployees.length} records</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[760px] text-left text-sm">
                  <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                    <tr>
                      <th className="px-5 py-4 font-semibold">Employee</th>
                      <th className="px-5 py-4 font-semibold">Department</th>
                      <th className="px-5 py-4 font-semibold">Salary</th>
                      <th className="px-5 py-4 font-semibold">Status</th>
                      <th className="px-5 py-4 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredEmployees.map((employee) => (
                      <tr key={employee.id} className="transition hover:bg-slate-50">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-700">
                              {employee.name.split(' ').map((part) => part[0]).join('').slice(0, 2)}
                            </div>
                            <div>
                              <p className="font-semibold text-slate-800">{employee.name}</p>
                              <p className="mt-1 text-xs text-slate-500">{employee.email}</p>
                              <p className="mt-1 text-xs text-slate-400">{employee.role}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <span className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium">{employee.department}</span>
                        </td>
                        <td className="px-5 py-4 font-medium">₹{Number(employee.salary).toLocaleString('en-IN')}</td>
                        <td className="px-5 py-4">
                          <span className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                            employee.status === 'Active'
                              ? 'bg-green-50 text-green-700'
                              : 'bg-amber-50 text-amber-700'
                          }`}>
                            {employee.status}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex gap-2">
                            <button onClick={() => openEditForm(employee)} className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold hover:bg-blue-50 hover:text-blue-700">Edit</button>
                            <button onClick={() => deleteEmployee(employee.id)} className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50">Delete</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredEmployees.length === 0 && (
                      <tr>
                        <td colSpan="5" className="px-5 py-12 text-center text-slate-500">
                          No employees found. Try another search or add an employee.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}

        <footer className="mt-6 text-center text-xs text-slate-400">
          EmployEase · Employee Management System · Mini Project
        </footer>
      </main>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/50 p-4">
          <div className="my-auto w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold">{editingId !== null ? 'Edit Employee' : 'Add New Employee'}</h3>
                <p className="mt-1 text-sm text-slate-500">Enter the employee details below.</p>
              </div>
              <button onClick={() => setShowForm(false)} className="rounded-lg px-3 py-2 text-slate-500 hover:bg-slate-100">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium">Full Name *</label>
                <input required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Enter full name" className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">Email Address *</label>
                <input required type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} placeholder="name@example.com" className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">Job Role *</label>
                <input required value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value })} placeholder="e.g. Data Analyst" className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500" />
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium">Department *</label>
                  <select value={form.department} onChange={(event) => setForm({ ...form, department: event.target.value })} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none focus:border-blue-500">
                    {departments.map((dept) => <option key={dept}>{dept}</option>)}
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium">Monthly Salary (₹) *</label>
                  <input required min="0" type="number" value={form.salary} onChange={(event) => setForm({ ...form, salary: event.target.value })} placeholder="30000" className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-blue-500" />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">Status</label>
                <select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value })} className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500">
                  <option>Active</option>
                  <option>On Leave</option>
                </select>
              </div>
              <div className="flex gap-3 pt-3">
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold hover:bg-slate-50">Cancel</button>
                <button type="submit" className="flex-1 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700">
                  {editingId !== null ? 'Save Changes' : 'Add Employee'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
