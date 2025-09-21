import React, { useState } from 'react'
import CustomerModule from './components/customer/Customer'
import ManufacturingModule from './components/manufacturing/Manufacture'
import './index.css'

function App() {
  const [activeModule, setActiveModule] = useState('customer')

  const renderModule = () => {
    switch(activeModule) {
      case 'customer':
        return <CustomerModule activeModule={activeModule} setActiveModule={setActiveModule} />
      case 'manufacturing':
        return <ManufacturingModule />
      default:
        return <CustomerModule activeModule={activeModule} setActiveModule={setActiveModule} />
    }
  }

  return (
    <div className="App">
      {renderModule()}
    </div>
  )
}

export default App
