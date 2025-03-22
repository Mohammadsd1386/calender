import PersianCalendar from './calender'

function App() {

  return (
    // wrapper 
    <div style={{width:"300px", margin:"auto" }}>
    <PersianCalendar
      darkMode={true}
      responsive={false} 
      onChange={(date) => console.log(date)} 
      animate={true}
      mode='range'
      showHolidays={true}
      />
    </div>


  )
}

export default App
