import { useState } from 'react'
import './css/signin.css'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { useNavigate } from "react-router-dom"

const Signup = () => {

  const navigate = useNavigate()
  const apiUrl = import.meta.env.VITE_API_URL

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [fullname, setfullName] = useState('')
  const [interests , setInterests] = useState('')
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.name === "email") {
      setEmail(e.target.value);
    }
    if (e.target.name === "password") {
      setPassword(e.target.value);
    }
    if (e.target.name === "username") {
      setUsername(e.target.value);
    }
    if (e.target.name === "fullname") {
      setfullName(e.target.value);
    } 
    if (e.target.name === "interests") {
      setInterests(e.target.value);
    } 
  };

  const signup = async() =>{
    try {
      const response = await axios.post(`${apiUrl}/users/signup`,{
        email: email,
        password:password,
        fullName: fullname,
        username: username,
        interests: interests
      }, {withCredentials: true})

      setEmail('')
      setPassword('')
      setfullName('')
      setInterests(''),
      setUsername("")
      navigate('/')
      localStorage.setItem("token", response.data.token)
      localStorage.setItem("tokenExpiry", "15d")
      return response.data
    } catch (error) {
      console.log(error)
      setEmail('')
      setPassword('')
    }
    
  }

  const handleSignUp = ()=> {
    setError("");

  if (!email) {
    return setError("Email is required");
  } else if (!email.endsWith("@gmail.com")) {
    return setError("Email must end with '@gmail.com'");
  }

    if(!email) {
      return setError("Email and password is required")
    }
    if(!password) {
      return setError("Password is required")
    }
    if(!username) {
      return setError("Password is required")
    }
    if(!fullname) {
      return setError("Password is required")
    }
    signup()
  }
  return (
    <div style={{height:'110vh',marginLeft:'-15vw'}} className='text-white flex justify-center'>
    <div className='maincardsignup mt-3 rounded-md'>
     <div className='m-7'>
         <div className='flex'>
         {/* <img src={icon} className='mr-2' style={{width:'25px', height:"25px"}} alt="" /> */}
         <h1 className='text-xl mb-4 text-blue-500 font-sans font-semibold'>Friend Circle</h1>
         </div>
         <h1 className='text-3xl font-sans font-semibold'>Sign Up</h1>
         <div className='flex flex-col mt-4'>
             <label htmlFor="" className='text-gray-500 ml-1 text-md mb-2 font-sans font-semibold'>Username</label>
             <input type="text" autoComplete="off" value={username} onChange={handleInputChange} name="username" id="" className='bg-black text-sm placeholder-opacity-5 text-gray-200 h-10 pl-3 rounded-lg' placeholder='Enter your username' />
         </div>
         <div className='flex flex-col mt-4'>
             <label htmlFor="" className='text-gray-500 ml-1 text-md mb-2 font-sans font-semibold'>FullName</label>
             <input type="text" autoComplete="off" value={fullname} onChange={handleInputChange} name="fullname" id="" className='bg-black text-sm placeholder-opacity-5 text-gray-200 h-10 pl-3 rounded-lg' placeholder='Enter your username' />
         </div>
         <div className='flex flex-col mt-6'>
             <label htmlFor="" className='text-gray-500 ml-1 text-md mb-2 font-sans font-semibold'>Email</label>
             <input autoComplete="off" type="text" value={email} onChange={handleInputChange} name="email" id="" className='bg-black text-sm placeholder-opacity-5 text-gray-200 h-10 pl-3 rounded-lg' placeholder='your@gmail.com' />
         </div>
         <div className='flex flex-col mt-6'>
             <label htmlFor="" className='text-gray-500 ml-1 text-md mb-2 font-sans font-semibold'>Interests</label>
             <input autoComplete="off" type="text" value={interests} onChange={handleInputChange} name="interests" id="" className='bg-black text-sm placeholder-opacity-5 text-gray-200 h-10 pl-3 rounded-lg' placeholder='football, cricket ...' />
         </div>
         <div className='flex flex-col mt-4'>
             <label htmlFor="" className='text-gray-500 ml-1 text-md mb-2 font-sans font-semibold'>Password</label>
             <input autoComplete="off" type="password" value={password} onChange={handleInputChange} name="password" id="" className='bg-black text-sm placeholder-opacity-5 text-gray-200 h-10 pl-3 rounded-lg' placeholder='• • • • • •' />
         </div>
         <div className='mt-3'>
         </div>
         <div onClick={handleSignUp} className='bg-white mt-5 rounded-lg cursor-pointer h-10 flex justify-center'>
         <button className='text-black font-sans font-semibold'>Sign Up</button>
         </div>
         <div className='flex justify-center mt-3 text-white'>
             <p className='mr-1'>Already have an account?</p>
             <Link to='/signin'>
             <p className='font-semibold font-sans underline cursor-pointer'>Sign In</p>
             </Link>
         </div>
     </div>
    </div>
 </div>
  )
}

export default Signup
