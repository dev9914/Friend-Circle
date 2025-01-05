import { useEffect, useState } from "react"
import axios from "axios"
import { Link, useNavigate } from "react-router-dom"
import { RxAvatar } from "react-icons/rx"
import FriendReq from "../components/FriendReq"
import { FaMagnifyingGlassPlus } from "react-icons/fa6"
import ReqAccept from "../components/ReqAccept"
import FriendList from "../components/FriendList"


interface User {
  _id: string;
  username: string;
  fullName: string;
  email: string;
  friends: string[];
  friendRequests: string[];
  interests: string[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface DashboardProps {
  user: User;
}

const useSmallScreen = () => {
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsSmallScreen(window.innerWidth <= 768);

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return isSmallScreen;
};


const Dashboard = ({user}: DashboardProps) => {
  const isSmallScreen = useSmallScreen();
  // console.log(isSmallScreen)

  const navigate = useNavigate()

  const apiUrl = import.meta.env.VITE_API_URL;

  const [query, setquery] = useState('')
  const [searchitem, setSearchItem] = useState([]);

  const logout = async ()=> {

    const response = await axios.post(`${apiUrl}/users/logout`)
    localStorage.removeItem('token')
    navigate('/signin')
    return response.data
  }

  const [reco, setReco] = useState([])
  const getReconmendation = async ()=>{
    try {
      const response = await axios.get(`${apiUrl}/friend/recommendations`,{headers:{Authorization: `Bearer ${localStorage.getItem('token')}`}})

      setReco(response.data)
      return response.data
    } catch (error) {
    console.log(error)
    }
  }

  const pendingRequests = user?.friendRequests?.filter(request => request.status === "pending");


  const getSearch = async ()=>{
    try {
      const response = await axios.get(`${apiUrl}/friend/search?query=${query}`,{headers:{Authorization: `Bearer ${localStorage.getItem('token')}`}})

      setSearchItem(response.data)
      setquery('')
      return response.data
    } catch (error) {
    console.log(error)
    }
  }


  useEffect(()=> {
    getReconmendation()
  }, [])


  return (
    <div className='bg-black h-screen md:flex justify-center'>
      <div className="bg-black md:w-5/12">
        {!isSmallScreen ? (
      <div style={{background:'#171518', width:'40vw',height:"10vh",}} className='rounded-full -ml-8 mt-5 text-white'>
        <div style={{height:"8.5vh",border: '0.5px solid rgba(255, 255, 255, 0.123)',width:"39.5vw",left:'7px',top:"5px"}} className='flex justify-between rounded-full relative'>
          <input value={query} onChange={(e)=> setquery(e.target.value)} style={{background:'#171518',width:'61vw'}} className='ml-2 rounded-full px-3 outline-none' type="text" placeholder='Search for products, brands, and categories...' />
            <div onClick={()=> getSearch()} style={{height:'6vh',width:"6vw"}} className='mr-3 bg-white cursor-pointer mt-2 text-black flex rounded-full'>
            <FaMagnifyingGlassPlus className='mt-3 ml-2' size={18} />
            <p className='font-sans font-semibold ml-2 mt-2 mr-3' >Find</p>
            </div>
        </div>
      </div>
        ): (
          <div style={{background:'#171518', width:'80vw',height:"6vh",}} className='rounded-full -ml-8 mt-5 text-white'>
          <div style={{height:"5.5vh",border: '0.5px solid rgba(255, 255, 255, 0.123)',width:"39.5vw",left:'7px',top:"5px"}} className='flex justify-between rounded-full relative'>
            <input value={query} onChange={(e)=> setquery(e.target.value)} style={{background:'#171518',width:'85vw'}} className='ml-2 rounded-full px-3 outline-none' type="text" placeholder='Search for products, brands, and categories...' />
              <div onClick={()=> getSearch()} style={{height:'4vh',width:"16vw"}} className='mr-3 ml-5 bg-white cursor-pointer mt-1 text-black flex rounded-full'>
              <p className='font-sans font-semibold ml-2 mt-2 mr-3' >Find</p>
              </div>
          </div>
        </div>
        )}
      <div className="text-white mt-5">
        {searchitem.length > 0 && (
      <h1 className="pb-5 text-xl font-sans font-semibold">Searched Account</h1>
        )}
      {searchitem.map((item)=> (
                          <div key={item._id}>
                            <FriendReq _id={item._id} username={item.username} fullName={item.fullName} />
                          </div>
                        )) }
      </div>
      <div className="text-white">
        {pendingRequests?.length >0 && (
        <h1 className="pb-5 text-xl font-sans font-semibold">Friends Requests</h1>
        )}
       {pendingRequests?.map((item)=>(
        <div key={item._id}>
        <ReqAccept senderId={item.sender} />
      </div>
       ))}
      </div>
      <div className="text-white">
        {user?.friends?.length > 0 && (
          <h1 className="pb-5 text-xl font-sans font-semibold">Friends</h1>

        )}
       {user?.friends?.map((item)=>(
        <div key={item}>
        <FriendList Id={item} />
      </div>
       ))}
      </div>
      </div>
      <div className="mt-8 max-sm:mt-20 text-white md:w-5/12">
        <div className="md:ml-28 mr-12">
        <div className='flex items-center'>
          <div className='cursor-pointer'>
            <Link to={'/profile'}>
            <RxAvatar size={30}/>
            </Link>
          </div>
          <div className="flex ml-3 text-white flex-col">
            <Link to={'/profile'}>
          <p className='cursor-pointer text-sm font-semibold -mt-1 font-sans'>{user?.username}</p>
            </Link>
          <p className='-mt-1 opacity-50 text-sm'>{user?.fullName}</p>
          </div>
          <p onClick={()=> logout()} className="absolute right-36 font-sans font-semibold text-blue-500 cursor-pointer hover:text-white text-sm">Logout</p>

        </div> 
        <div className="mt-5">
          <div className="flex justify-between">
            <p className="opacity-75">Suggested for you</p>
            <p className="text-sm font-sans font-semibold cursor-pointer hover:opacity-35" >See All</p>
          </div >
          <div className="mt-5">
           {reco.map((item)=> (
                          <div key={item._id}>
                            <FriendReq _id={item._id} username={item.username} fullName={item.fullName} />
                          </div>
                        )) }
          </div>
          <div className="mt-10">
            <p className="text-sm opacity-40">About
Help
Press
API
Jobs
Privacy
Terms
Locations
Language
Meta Verified</p>
          </div>
        </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard



