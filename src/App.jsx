import { useState } from 'react'
import './App.css'
import LoginPage from '../pages/loginPage'
import { BrowserRouter , Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import HomePage from '../pages/homePage'
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
