import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { RxAvatar } from 'react-icons/rx'

interface sender {
    Id : string
}

const FriendList = ({Id}: sender) => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const [user, setUser] = useState({})
    const getuser = async ()=>{
      try {
        const response = await axios.get(`${apiUrl}/users/getuserbyId/${Id}`,{headers:{Authorization: `Bearer ${localStorage.getItem('token')}`}})
  
        setUser(response.data)
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
        <p className="font-sans md:absolute md:left-[700px] max-sm:absolute max-sm:left-60 font-semibold cursor-pointer hover:text-white text-blue-500 text-sm mr-3">Friends</p>
  </div> 
  )
}

export default FriendList
