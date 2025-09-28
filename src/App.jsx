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

import MyAdoptionsPage from '../pages/MyAdoptionsPage'
import AdminDashboard from '../pages/AdminDashboard'
import AdoptionForm from '../pages/AdoptionForm'
// import AdoptionDetailsPage from '../pages/AdoptionDetailsPage'
// import AdminAdoptionViewPage from '../pages/AdminAdoptionViewPage'


import AllPetsPage from '../pages/allPetsPage'
import PetDetailsPage from '../pages/petDetailsPage'
import RegisterPage from '../pages/registerPage'
import PublicAddPetPage from '../pages/publicAddPetPage'

import ProductOverview from '../pages/home/productDetailPage'
import ProductsPage from '../pages/productsPage'
import Cart from '../pages/home/cart'
import ShippingScreen from '../pages/home/shipping'
import OrderSummary from '../pages/home/orderSummary'






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

          
          

           
          
          


          <Route path="/adoptions" element={<MyAdoptionsPage />} />
          {/* <Route path="/adoptions/:adoptionId" element={<AdoptionDetailsPage />} /> */}
          <Route path="/adopt/:petId" element={<AdoptionForm />} />
          <Route path="/adopt/:petId/edit" element={<AdoptionForm isEdit={true} />} />         
          {/* <Route path="/admin/adoptions/pet/:petId" element={<AdminAdoptionViewPage />} /> */}
           <Route path="/admin/*" element={<AdminDashboard />} />
           
           


          <Route path="/pets" element={<AllPetsPage/>} />
          <Route path="/petInfo/:petId" element={<PetDetailsPage/>} />
          <Route path="/register" element={<RegisterPage/>}/>
          <Route path="/add-pet" element={<PublicAddPetPage />} /> 

          <Route path= "/shop" element={<ProductsPage/>}/>
          <Route path="/product/:productId" element={<ProductOverview/>} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/shipping" element={<ShippingScreen />} />
          <Route path="/order/:orderId" element={<OrderSummary />} />

          






      </Routes>

      </BrowserRouter>
    </>
  )
}

export default App