import React from 'react'

import { PersianCalendar } from 'persian-calender'

const App = () => {

    return (
      <PersianCalendar
        darkMode={false}
        responsive={false} 
        onChange={(date) => console.log(date)} 
      />
  
    )
  }

export default App
