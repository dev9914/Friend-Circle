import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { RxAvatar } from 'react-icons/rx'

interface sender {
    senderId : string
}

const ReqAccept = ({senderId}: sender) => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const [user, setUser] = useState({})
    const getuser = async ()=>{
      try {
        const response = await axios.get(`${apiUrl}/users/getuserbyId/${senderId}`,{headers:{Authorization: `Bearer ${localStorage.getItem('token')}`}})
  
        setUser(response.data)
        return response.data
      } catch (error) {
      console.log(error)
      }
    }

    const accept = async ()=>{
        try {
          const response = await axios.post(`${apiUrl}/friend/accept-request`,{senderId:senderId},{headers:{Authorization: `Bearer ${localStorage.getItem('token')}`}})
          window.location.reload();
          return response.data
        } catch (error) {
        console.log(error)
        }
      }

      const reject = async ()=>{
        try {
          const response = await axios.post(`${apiUrl}/friend/reject-request`,{senderId:senderId},{headers:{Authorization: `Bearer ${localStorage.getItem('token')}`}})
          window.location.reload();
          return response.data
        } catch (error) {
        console.log(error)
        }
      }


    useEffect(()=> {
        getuser()
    },[])

  return (
    <div className='flex mb-4 items-center'>
    <div className='cursor-pointer'>
      <RxAvatar size={25}/>
    </div>
    <div className="flex ml-3 flex-col">
    <p className='cursor-pointer text-sm font-semibold -mt-1 font-sans'>{user?.username}</p>
    <p className='-mt-1 opacity-50 text-sm'>{user?.fullName}</p>
    </div>
        <p onClick={()=> reject()} className="font-sans relative md:left-60 max-sm:left-28 font-semibold cursor-pointer hover:text-white text-red-600 text-sm mr-3">Reject</p>
        <p className="font-sans relative md:left-60 font-semibold max-sm:left-28 cursor-pointer hover:text-white text-blue-500 text-sm" onClick={()=> accept()}>Accept</p>
  </div> 
  )
}

export default ReqAccept
