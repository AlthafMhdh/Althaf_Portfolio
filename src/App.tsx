import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Dashboard from './admin/dashboard'
import Home from './client/home'
//import { useEffect, useState } from 'react';
import Login from './admin/login';
import ProtectedRoute from './routes/ProtectedRoute';
//import { auth } from './firebase/config';

function App() {
  // const [isLoggedIn, setIsLoggedIn] = useState(false);

  // useEffect(() => {
  //   const unsubscribe = auth.onAuthStateChanged((user) => {
  //     setIsLoggedIn(!!user);
  //   });
  //   return () => unsubscribe();
  // }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path="/admin" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route path="/login" element={<Login/>} 
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App
