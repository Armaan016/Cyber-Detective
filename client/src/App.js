import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './Components/Login'
import Register from './Components/Register'
import Home from './Components/Home'
import Kmit from './Components/Kmit'
import Scrape from './Components/Scrape'
import Tokens from './Components/Tokens'
import GenerateQA from './Components/GenerateQA'
import Query from './Components/Query'

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/home' element={<Home />} />
        <Route path='/kmit' element={<Kmit />} />
        <Route path='/scrape' element={<Scrape />} />
        <Route path='/tokens' element={<Tokens />} />
        <Route path='/generate' element={<GenerateQA />} />
        <Route path='/qa' element={<Query />} />
      </Routes>
    </Router >
  )
}

export default App;