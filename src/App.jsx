import { useState } from 'react'
import './App.css'
import PlaceOrder from './components/PlaceOrder.jsx'

function App() {
  
  return (
    <>
      <div className='flex flex-col items-center justify-center min-h-screen bg-yellow-200 text-2xl font-semibold'>
        <p>My Bakery web app</p>
        <p>Let's Goooo🚀🚀</p>
      <PlaceOrder />
      </div>
    </>
  )
}

export default App
