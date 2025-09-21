import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/layout/Layout'
import CustomerModule from './components/customer/Customer'
import ManufacturingModule from './components/manufacturing/Manufacture'
import SalesModule from './components/sales/Sales'
import RecordModule from './components/record/Record'
import './index.css'

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/customer" replace />} />
            <Route path="customer" element={<CustomerModule />} />
            <Route path="manufacturing" element={<ManufacturingModule />} />
            <Route path="record" element={<RecordModule />} />
            <Route path="sell" element={<SalesModule />} />
          </Route>
        </Routes>
      </div>
    </Router>
  )
}

export default App
