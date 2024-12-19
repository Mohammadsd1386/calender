import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import PersianCalendar from './calender'

function App() {

  return (
    
    <PersianCalendar
      darkMode={false}
      responsive={false} 
      onChange={(date) => console.log(date)} 
      animate={true}
      inputStyle={{ width: '100px', height: '50px' }}
      />

  )
}

export default App
