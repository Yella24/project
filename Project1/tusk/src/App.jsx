import React from 'react'
import {Routes , Route} from "react-router-dom"
import Home from './component/Home'
import { ToastContainer } from 'react-toastify'



const App = () => {
  return (
    <div>
      <ToastContainer/>
      <Routes>
        <Route path='/' element={<Home></Home>}></Route>
      </Routes>
    </div>
  )
}

export default App