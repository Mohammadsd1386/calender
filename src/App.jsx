import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import PersianCalendar from './calender'

function App() {
  const [count, setCount] = useState(0)

  return (
<PersianCalendar
  responsive={false} 
  onChange={(date) => console.log(date)} 
/>

  )
}

export default App
