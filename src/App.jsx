import { useState } from 'react'
import './App.css'
import LoginPage from '../pages/loginPage'
import { BrowserRouter , Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import HomePage from '../pages/homePage'
import AllPetsPage from '../pages/allPetsPage'
import PetDetailsPage from '../pages/petDetailsPage'


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <BrowserRouter>
      <Toaster/>

      <Routes path="/*">
          <Route path= "/" element={<HomePage/>}/>
          <Route path= "/login" element={<LoginPage/>}/>
          <Route path="/pets" element={<AllPetsPage/>} />
          <Route path="/petInfo/:petId" element={<PetDetailsPage/>} />


      </Routes>

      </BrowserRouter>
    </>
  )
}

export default App
