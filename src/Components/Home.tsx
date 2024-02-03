import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../Hooks";
import {account,appwriteDB} from '../appwrite';
import { LogoutUser, SaveUser } from "../Redux/Actions/UserActions";

const Home = () => {
    const Navigate = useNavigate();
  const User = useAppSelector((state)=>state.UserState.User);
 const [Fetching,setFetching]=useState(false);
 const dispatch = useAppDispatch();
  

const FetchCurrentUser =
useCallback(
async()=>{
  try {
    setFetching(true);
    const User = await account.get();
    const FetchUser = await appwriteDB.getDocument('65bd1697148950b2b2a7','65bd16a3930e4a44270a',User.$id);
    dispatch(SaveUser({
      Id:FetchUser.$id,
      email:FetchUser.email,
      firstName:FetchUser.firstName,
      password:'',
      gender:FetchUser.gender,
      lastName:FetchUser.lastName,
      phone:FetchUser.phone,
      ProfileImg:FetchUser.ProfileImg,
      LoggedIn:true,
      repeatPassword:'',
    }));
    setFetching(false);
  } catch (error) {
    setFetching(false);
    Navigate('/auth');
  }
  
},[]);

useEffect(()=>{
  FetchCurrentUser();
},[FetchCurrentUser]);

  const HandleLogout = async()=>{
   if(User){
    setFetching(true);
    await account.deleteSession('current');
   await dispatch(LogoutUser());
   Navigate('/auth');
   setFetching(false); 
   }
  }

    return (
        <div className="w-full relative flex flex-col justify-center items-center h-screen bg-gradient-to-r from-gray-700 via-gray-900 to-black">

       <button onClick={HandleLogout} className="text-white ml-2 absolute left-10 border py-2 px-4  hover: top-5 rounded-lg opacity-80 hover:opacity-100 transition-all  ease-in">Logout</button>
       
       {User && !Fetching?
        <div className="bg-white relative shadow-lg max-w-md w-full  overflow-hidden rounded-lg border">
        <button onClick={()=>Navigate('/CompleteProfile')} className="text-blue-500 opacity-75 hover:opacity-100 border border-blue-500 p-2 text-sm absolute rounded-md right-2 top-2">Edit Information</button>
        <div className="px-4 py-5 flex flex-col justify-center items-center sm:block sm:px-6">
          <div className="flex gap-2 items-center">
            {User.ProfileImg?
          <img src={User.ProfileImg} alt="Profile Img" className="w-20 h-20 rounded-full object-cover" />
          :
          <div className="w-20 h-20 bg-black rounded-full"/>  
          }
          <h3 className="text-lg  leading-6 font-medium text-gray-900">
            User Profile
          </h3>
          </div>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
          Information about the user.
          </p>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
          <dl className="sm:divide-y sm:divide-gray-200">
            <div className="py-3 sm:py-5 flex justify-center items-center flex-col border-b sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Full name</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {User?`${User.firstName} ${User.lastName}` : 'Users Name'}
              </dd>
            </div>
            <div className="py-3 sm:py-5 flex justify-center items-center flex-col border-b-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Email address</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {User?`${User.email}` : 'Users Email'}
              </dd>
            </div>
            <div className="py-3 sm:py-5 flex justify-center items-center flex-col border-b-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Phone number</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {User?`${User.phone}` : 'Users Phone Number'}
              </dd>
            </div>
            <div className="py-3 sm:py-5 flex justify-center items-center flex-col  sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Gender</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {User?`${User.gender}` : 'Users gender'}
              </dd>
            </div>
          </dl>
        </div>
      </div>
      :
      <div className="bg-white w-[450px] h-[400px] animate-pulse  overflow-hidden shadow rounded-lg border">
        
      </div>
}
      </div>
  )
}

export default Home