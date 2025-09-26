import { useState } from 'react'
import './App.css'
import LoginPage from '../pages/loginPage'
import { BrowserRouter , Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import HomePage from '../pages/homePage'
import ServicePage from '../pages/servicesPage'
import ServiceDetails from '../pages/serviceDetails'
import BookingPage from '../pages/bookingPage'
import MyBookings from '../pages/myBookings'


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <BrowserRouter>
      <Toaster/>

      <Routes path="/*">
          <Route path= "/" element={<HomePage/>}/>
          <Route path= "/login" element={<LoginPage/>}/>
          <Route path="/services" element={<ServicePage/>} />
          <Route path="/services/:id" element={<ServiceDetails/>} />
          <Route path="/service/:id" element={<ServiceDetails/>} />
          <Route path="/bookings" element={<BookingPage/>} />
          <Route path="/booking/:id" element={<BookingPage />} />
          <Route path="/my-bookings" element={<MyBookings />} />

          
          

           
          
          


      </Routes>

      </BrowserRouter>
    </>
  )
}

export default App
