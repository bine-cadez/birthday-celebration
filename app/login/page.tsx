'use client'

import type React from 'react'

import { useState } from 'react'

export default function LoginPage() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ password }),
    })
    if (res.ok) {
      window.location.href = '/'
    } else {
      const data = await res.json().catch(() => ({}))
      setError(data?.error ?? 'vpis ni uspel')
    }
  }

  return (
    <main className='min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-slate-50 to-stone-100'>
      <div className='w-full max-w-md'>
        <div className='bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200/50 p-8'>
          <div className='text-center mb-8'>
            <h1 className='text-2xl font-light text-slate-800 tracking-wide'>
              Vpiši geslo
            </h1>
          </div>

          <form onSubmit={onSubmit} className='space-y-6'>
            <div className='space-y-2'>
              <input
                type='password'
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder='Geslo'
                className='w-full border-0 border-b-2 border-slate-200 bg-transparent px-0 py-3 text-slate-700 placeholder-slate-400 focus:border-slate-400 focus:outline-none focus:ring-0 transition-colors duration-200'
                autoFocus
              />
            </div>

            {error && (
              <div className='bg-red-50 border border-red-200 rounded-lg p-3'>
                <p className='text-red-700 text-sm font-medium'>{error}</p>
              </div>
            )}

            <button
              className='w-full bg-slate-800 hover:bg-slate-700 text-white font-medium py-3 px-6 rounded-xl transition-all duration-200 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]'
              type='submit'
            >
              Vpis
            </button>
          </form>
        </div>
      </div>
    </main>
  )
}
