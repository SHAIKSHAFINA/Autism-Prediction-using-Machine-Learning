import React from 'react'
import ASDForm from './components/ASDForm'

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="mx-auto max-w-5xl px-4 py-6">
          <h1 className="text-2xl font-bold text-gray-900">Autism Prediction System</h1>
          <p className="text-gray-600 mt-1">Fill out the form to estimate the likelihood of ASD based on AQ-10 and background information.</p>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-8">
        <ASDForm />
      </main>
      <footer className="mx-auto max-w-5xl px-4 py-4 text-sm text-gray-500">
        Built with React, Tailwind CSS, and FastAPI
      </footer>
    </div>
  )
}