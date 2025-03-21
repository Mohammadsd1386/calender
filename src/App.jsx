import PersianCalendar from './calender'

function App() {

  return (
    // wrapper 
    <div style={{width:"300px" }}>
    <PersianCalendar
      darkMode={false}
      responsive={false} 
      onChange={(date) => console.log(date)} 
      animate={true}
      inputStyle={{ width: '100px', height: '50px' }}
      mode='range'
      />
    </div>


  )
}

export default App
