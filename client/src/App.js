import React, { useContext } from 'react'
import Home from './pages/home/Home'
import Login from './pages/login/Login'
import Register from './pages/register/Register'
import Profile from './pages/profile/Profile'
import Messenger from './components/messenger/Messenger'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';



const App = () => {
  const { user } = useContext(AuthContext);
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={user ? <Home /> : < Register />} exact />
          <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} exact />
          <Route path="/register" element={user ? <Navigate to="/login" /> : <Register />} exact/>
          <Route path="/profile/:username" element={user ? <Profile /> : <Login />} exact />
          <Route path="/messenger" element={user ? <Messenger /> :<Navigate to="/login" />} exact />

        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
