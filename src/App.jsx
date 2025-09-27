import { useState } from 'react'
import './App.css'
import LoginPage from '../pages/loginPage'
import { BrowserRouter , Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import HomePage from '../pages/homePage'
import MyAdoptionsPage from '../pages/MyAdoptionsPage'
import AdminDashboard from '../pages/AdminDashboard'
import AdoptionForm from '../pages/AdoptionForm'
// import AdoptionDetailsPage from '../pages/AdoptionDetailsPage'
// import AdminAdoptionViewPage from '../pages/AdminAdoptionViewPage'









function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <BrowserRouter>
      <Toaster/>

      <Routes path="/*">
          <Route path= "/" element={<HomePage/>}/>
          <Route path= "/login" element={<LoginPage/>}/>
          <Route path="/adoptions" element={<MyAdoptionsPage />} />
          {/* <Route path="/adoptions/:adoptionId" element={<AdoptionDetailsPage />} /> */}
          <Route path="/adopt/:petId" element={<AdoptionForm />} />
          <Route path="/adopt/:petId/edit" element={<AdoptionForm isEdit={true} />} />         
          {/* <Route path="/admin/adoptions/pet/:petId" element={<AdminAdoptionViewPage />} /> */}
           <Route path="/admin/*" element={<AdminDashboard />} />
           
           

         


      </Routes>

      </BrowserRouter>
    </>
  )
}

export default App
