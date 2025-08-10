import React, { useMemo, useState } from 'react'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const initialValues = {
  age: '',
  gender: '',
  ethnicity: '',
  country_of_residence: '',
  jaundice: '',
  family_history_asd: '',
  used_app_before: '',
  relation: '',
  a1: '', a2: '', a3: '', a4: '', a5: '', a6: '', a7: '', a8: '', a9: '', a10: ''
}

export default function ASDForm() {
  const [values, setValues] = useState(initialValues)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState(null)

  const allFieldsFilled = useMemo(() => {
    return Object.values(values).every(v => v !== '' && v !== null && v !== undefined)
  }, [values])

  const handleChange = (e) => {
    const { name, value } = e.target
    setValues(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setResult(null)

    if (!allFieldsFilled) {
      setError('Please complete all fields before submitting.')
      return
    }

    setSubmitting(true)
    try {
      // Convert integer fields
      const intFields = ['age','a1','a2','a3','a4','a5','a6','a7','a8','a9','a10']
      const payload = { ...values }
      intFields.forEach(k => payload[k] = Number(payload[k]))

      const { data } = await axios.post(`${API_URL}/predict`, payload, {
        headers: { 'Content-Type': 'application/json' }
      })
      setResult(data)
    } catch (err) {
      const msg = err?.response?.data?.detail || 'Error: Unable to get prediction'
      setError(String(msg))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Age</label>
            <input type="number" name="age" min="1" max="120" value={values.age} onChange={handleChange} className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Gender</label>
            <select name="gender" value={values.gender} onChange={handleChange} className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" required>
              <option value="">Select</option>
              <option value="M">Male</option>
              <option value="F">Female</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Ethnicity</label>
            <input type="text" name="ethnicity" value={values.ethnicity} onChange={handleChange} placeholder="e.g., White, Asian, Black" className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Country of residence</label>
            <input type="text" name="country_of_residence" value={values.country_of_residence} onChange={handleChange} placeholder="e.g., United Kingdom" className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Jaundice (at birth)</label>
            <select name="jaundice" value={values.jaundice} onChange={handleChange} className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" required>
              <option value="">Select</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Family history of ASD</label>
            <select name="family_history_asd" value={values.family_history_asd} onChange={handleChange} className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" required>
              <option value="">Select</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Used this app before?</label>
            <select name="used_app_before" value={values.used_app_before} onChange={handleChange} className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" required>
              <option value="">Select</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Relation to test subject</label>
            <select name="relation" value={values.relation} onChange={handleChange} className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" required>
              <option value="">Select</option>
              <option value="Self">Self</option>
              <option value="Parent">Parent</option>
              <option value="Relative">Relative</option>
              <option value="Healthcare professional">Healthcare professional</option>
              <option value="Others">Others</option>
            </select>
          </div>
        </div>

        <fieldset className="border rounded-md p-4">
          <legend className="text-sm font-semibold text-gray-700">AQ-10 responses (0 = No, 1 = Yes)</legend>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-2">
            {Array.from({ length: 10 }).map((_, idx) => {
              const key = `a${idx+1}`
              return (
                <div key={key}>
                  <label className="block text-sm text-gray-700">{key.toUpperCase()}</label>
                  <select name={key} value={values[key]} onChange={handleChange} className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" required>
                    <option value="">Select</option>
                    <option value="0">0</option>
                    <option value="1">1</option>
                  </select>
                </div>
              )
            })}
          </div>
        </fieldset>

        <div className="flex items-center gap-3">
          <button type="submit" disabled={!allFieldsFilled || submitting} className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 disabled:opacity-50">
            {submitting ? 'Processing…' : 'Get Prediction'}
          </button>
          {!allFieldsFilled && (
            <span className="text-sm text-gray-500">Please complete all fields</span>
          )}
        </div>
      </form>

      {error && (
        <div className="mt-6 rounded-md bg-red-50 p-4 text-red-800 border border-red-200">{error}</div>
      )}

      {result && (
        <div className="mt-6 rounded-md bg-green-50 p-4 border border-green-200">
          <p className="text-lg font-semibold text-gray-900">Prediction: <span className="font-bold">{result.prediction}</span></p>
          <p className="text-gray-700">Probability: {(result.probability * 100).toFixed(1)}%</p>
        </div>
      )}
    </div>
  )
}