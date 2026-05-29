import { useState } from 'react'
import axios from 'axios'

function App() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    message: '',
  })
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setStatus('')
    setError('')
    setLoading(true)

    try {
      const response = await axios.post('/api/contact', form)
      setStatus(response.data.message || 'Form Submitted Successfully')
      setForm({ name: '', email: '', message: '' })
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#f7f5f2] text-slate-950">
      <section className="mx-auto grid min-h-screen w-full max-w-6xl items-center gap-10 px-5 py-10 md:grid-cols-[0.95fr_1.05fr] md:px-8">
        <div className="space-y-6">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-rose-700">
            She Can Foundation
          </p>
          <div className="space-y-4">
            <h1 className="max-w-xl text-4xl font-bold leading-tight text-slate-950 md:text-6xl">
              Share your message with us
            </h1>
            <p className="max-w-lg text-base leading-7 text-slate-700 md:text-lg">
              Fill this simple form to connect with She Can Foundation. Your
              details will be saved securely in MongoDB through our Node.js API.
            </p>
          </div>
          <div className="grid max-w-lg grid-cols-3 gap-3 text-sm text-slate-700">
            <div className="rounded-lg border border-rose-100 bg-white p-4 shadow-sm">
              <strong className="block text-2xl text-rose-700">React</strong>
              Frontend
            </div>
            <div className="rounded-lg border border-emerald-100 bg-white p-4 shadow-sm">
              <strong className="block text-2xl text-emerald-700">Node</strong>
              Backend
            </div>
            <div className="rounded-lg border border-sky-100 bg-white p-4 shadow-sm">
              <strong className="block text-2xl text-sky-700">Mongo</strong>
              Database
            </div>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-lg border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/70 md:p-8"
        >
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-950">Contact Form</h2>
            <p className="mt-2 text-sm text-slate-600">
              Name, email, and message are required.
            </p>
          </div>

          <div className="space-y-5">
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-800">
                Name
              </span>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter your name"
                className="w-full rounded-md border border-slate-300 px-4 py-3 text-slate-950 outline-none transition focus:border-rose-500 focus:ring-4 focus:ring-rose-100"
                required
                minLength="2"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-800">
                Email
              </span>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full rounded-md border border-slate-300 px-4 py-3 text-slate-950 outline-none transition focus:border-rose-500 focus:ring-4 focus:ring-rose-100"
                required
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-800">
                Message
              </span>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                placeholder="Write your message"
                rows="5"
                className="w-full resize-none rounded-md border border-slate-300 px-4 py-3 text-slate-950 outline-none transition focus:border-rose-500 focus:ring-4 focus:ring-rose-100"
                required
                minLength="5"
              />
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-md bg-rose-700 px-5 py-3 font-semibold text-white transition hover:bg-rose-800 disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              {loading ? 'Submitting...' : 'Submit'}
            </button>

            {status && (
              <p className="rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800">
                {status}
              </p>
            )}

            {error && (
              <p className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                {error}
              </p>
            )}
          </div>
        </form>
      </section>
    </main>
  )
}

export default App
