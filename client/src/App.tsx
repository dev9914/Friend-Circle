import { Route, Routes, useLocation } from 'react-router-dom'
import './App.css'
import Dashboard from './pages/Dashboard'
import Signin from './pages/Signin'
import Signup from './pages/Signup'
import Sidebar from './components/Sidebar'
import { useEffect, useState } from 'react'
import axios from 'axios'
import ProtectedRoute from './components/ProtectedRotues'

const useSmallScreen = () => {
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsSmallScreen(window.innerWidth <= 768);

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return isSmallScreen;
};

function App() {
  const isSmallScreen = useSmallScreen();

  const location = useLocation();
  const hideSidebar = location.pathname === '/signup' || location.pathname === '/signin';
  const apiUrl = import.meta.env.VITE_API_URL;
  const [user, setUser] = useState({})
  const getuser = async ()=>{
    try {
      const response = await axios.get(`${apiUrl}/users/getuser`,{headers:{Authorization: `Bearer ${localStorage.getItem('token')}`}})

      setUser(response.data)
      return response.data
    } catch (error) {
    console.log(error)
    }
  }

  useEffect(()=> {
    getuser();
  },[location])


  return (
    <>
    <div className='flex bg-black'>
    {!hideSidebar && !isSmallScreen && <Sidebar />}
    <div style={{width:'85vw',marginLeft:'15vw'}} className='bg-black'>
      <Routes>
        <Route path='/signin' element={<Signin/>}/>
        <Route path='/' element={
          <ProtectedRoute>
        <Dashboard user={user}/>
        </ProtectedRoute>
        }/>
        <Route path='/signup' element={<Signup/>}/>
      </Routes>
    </div>
      </div>

    </>
  )
}

export default App
