import { RxAvatar } from 'react-icons/rx'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'

interface UsersforfollowProps {
    _id: string,
    fullName: string,
    username: string
}

const FriendReq = ({ _id, fullName, username, }: UsersforfollowProps) => {
    const apiUrl = import.meta.env.VITE_API_URL;

    const SendReq = async ()=> {
       try {
         const response = await axios.post(`${apiUrl}/friend/friend-request`,{recipientId: _id},{headers:{Authorization: `Bearer ${localStorage.getItem('token')}`}})
         alert('Request Sent')
         return response.data
       } catch (error) {
        alert("Friend request alreay sent")
        console.log(error)
       }
      }

  return (
    <div key={_id} className='flex mb-4 items-center'>
    <div className='cursor-pointer'>
      <RxAvatar size={25}/>
    </div>
    <div className="flex ml-3 flex-col">
    <p className='cursor-pointer text-sm font-semibold -mt-1 font-sans'>{username}</p>
    <p className='-mt-1 opacity-50 text-sm'>{fullName}</p>
    </div>
        <p onClick={()=> SendReq()} className="font-sans relative md:left-60 max-sm:left-28 font-semibold cursor-pointer hover:text-white text-blue-500 text-sm">Add Friend</p>
  </div> 
  )
}

export default FriendReq
