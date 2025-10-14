import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Dashboard from './admin/dashboard'
import Home from './client/home'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path="/admin" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
