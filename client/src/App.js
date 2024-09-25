import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './Components/Login'
import Register from './Components/Register'
import Home from './Components/Home'
import Kmit from './Components/Kmit'
import Scrape from './Components/Scrape'

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/home' element={<Home />} />
        <Route path='/kmit' element={<Kmit />} />
        <Route path='/scrape' element={<Scrape />} />
      </Routes>
    </Router >
  )
}

export default App;