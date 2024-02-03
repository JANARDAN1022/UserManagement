//import { useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom"
import {account,ID,appwriteDB} from '../../appwrite';
import { useState } from "react";
import { useAppDispatch } from "../../Hooks";
import {SaveUser} from '../../Redux/Actions/UserActions'

const Login = () => {
    const Navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [CurrentForm,setCurrentForm]=useState('Login');

const [AuthInfo,setAuthInfo] = useState({
  email: "",
  password:'',
  confirmPassword:'',
  Name:'',
});

const [AuthErrors,setAuthErrors]=useState({
  email: "",
  password:'',
  confirmPassword:'',
  Name:'',
});

const [Loading,setLoading]=useState(false);



const HandleAuth = async(e:any,FormType:string)=>{
e.preventDefault();
const EmailSymbol = AuthInfo.email?.split('@')[1];
const ValidateEmail = EmailSymbol?.split('.').length===2;



if(AuthInfo.email!=='' && AuthInfo.password!=='' && ValidateEmail){
  if(AuthInfo.password===AuthInfo.confirmPassword){
    try {
      setLoading(true)
      if(FormType==='Login'){
      const LoginUser = await account.createEmailSession(AuthInfo.email,AuthInfo.password);
      const GetUser = await appwriteDB.getDocument('65bd1697148950b2b2a7','65bd16a3930e4a44270a',LoginUser.userId)
     if(GetUser){
      await dispatch(SaveUser({
        Id:GetUser.$id,
        email:GetUser.email,
        firstName:GetUser.firstName,
        password:'',
        gender:GetUser.gender,
        lastName:GetUser.lastName,
        phone:GetUser.phone,
        ProfileImg:GetUser.ProfileImg,
        LoggedIn:true,
        repeatPassword:'',
      }));
      Navigate('/');
    }
    }else{
        const User = await account.create(ID.unique(),AuthInfo.email,AuthInfo.password,AuthInfo.Name);  
     if(User){
      const UserData = {
        email:User.email,
        firstName:User.name,
        password:'',
        gender:'',
        lastName:'',
        phone:'',
        ProfileImg:'',
      }
      await appwriteDB.createDocument('65bd1697148950b2b2a7','65bd16a3930e4a44270a',User.$id,UserData)
      await account.createEmailSession(AuthInfo.email,AuthInfo.password);
      await dispatch(SaveUser({...UserData,LoggedIn:true,Id:User.$id,repeatPassword:'',}));
      Navigate('/CompleteProfile');
     }  
    } 
       setLoading(false);
    } catch (error:any) {
      setLoading(false);
    }
      }else{
  setAuthErrors({...AuthErrors,confirmPassword:'Passwords Do Not Match*'});
  setTimeout(() => {
    setAuthErrors({...AuthErrors,confirmPassword:''});
  }, 3000);
  }
}else{
  if(AuthInfo.Name==='' && FormType==='Register'){
    setAuthErrors({...AuthErrors,Name:'This field cannot be empty*'});
    setTimeout(() => {
      setAuthErrors({...AuthErrors,Name:''});
    }, 3000);
  }else if(AuthInfo.email===''){
    setAuthErrors({...AuthErrors,email:'This field cannot be empty*'});
    setTimeout(() => {
      setAuthErrors({...AuthErrors,email:''});
    }, 3000);
   }else if(!ValidateEmail){
    setAuthErrors({...AuthErrors,email:'Please Enter A Valid Email*'});
    setTimeout(() => {
      setAuthErrors({...AuthErrors,email:''});
    }, 3000);
   }
   else if(AuthInfo.password===''){
    setAuthErrors({...AuthErrors,password:'This field cannot be empty*'}); 
    setTimeout(() => {
      setAuthErrors({...AuthErrors,password:''});
    }, 3000);
   }
}

}



  return (
    <div className="w-full gap-4 flex flex-col justify-center items-center h-screen bg-gradient-to-r from-gray-700 via-gray-900 to-black">
    
    <h1 className="text-white font-bold text-lg">{CurrentForm==='Login'?'Login To Your Account':'Regsiter New Account'}</h1>
    <form className="max-w-lg  md:gap-5 flex flex-col  w-full border border-white mx-auto  p-10 rounded-md shadow shadow-white">
    
    <div className={`${CurrentForm==='Register'?'':'hidden'} relative  z-0 w-full mb-5 group`}>
      <input
      onChange={(e)=>setAuthInfo({...AuthInfo,Name:e.target.value})}
        type="text"
        name="floating_FirstName"
        id="floating_FirstName"
        className="block py-2.5 px-0 w-full text-sm text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
        placeholder=" "
        autoComplete="off"
        disabled={Loading?true:false}
        value={AuthInfo.Name}
     
      />
      <label
        htmlFor="floating_FirstName"
        className="peer-focus:font-medium flex gap-4 absolute text-sm text-white dark:text-white duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
      >
        First Name
        <span className="text-red-500">{AuthErrors.Name!=='' && AuthErrors.Name} </span>
      
      </label>
    </div>
    
    
    
    <div className="relative  z-0 w-full mb-5 group">
      <input
      onChange={(e)=>setAuthInfo({...AuthInfo,email:e.target.value})}
        type="email"
        name="floating_email"
        id="floating_email"
        className="block py-2.5 px-0 w-full text-sm text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
        placeholder=''
        autoComplete="off"
        disabled={Loading?true:false}
        value={AuthInfo.email}
     
      />
      <label
        htmlFor="floating_email"
        className="peer-focus:font-medium flex gap-2  absolute text-sm text-white dark:text-white duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
      >
        Email address

       <span className="text-red-500">{AuthErrors.email!=='' && AuthErrors.email} </span>
      
      </label>
    </div>
    <div className="relative z-0 w-full mb-5 group">
      <input
      onChange={(e)=>setAuthInfo({...AuthInfo,password:e.target.value})}
        type="password"
        name="floating_password"
        id="floating_password"
        className="block py-2.5 px-0 w-full text-sm text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
        placeholder=" "
        autoComplete="off"
        disabled={Loading?true:false}
        value={AuthInfo.password}
     
      />
      <label
        htmlFor="floating_password"
        className="peer-focus:font-medium flex gap-4 absolute text-sm text-white dark:text-white duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
      >
        Password
        <span className="text-red-500">{AuthErrors.password!=='' && AuthErrors.password} </span>
     
      </label>
    </div>
    <div className="relative z-0 w-full mb-5 group">
      <input
      onChange={(e)=>setAuthInfo({...AuthInfo,confirmPassword:e.target.value})}
        type="password"
        name="repeat_password"
        id="floating_repeat_password"
        className="block py-2.5 px-0 w-full text-sm text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
        placeholder=" "
        autoComplete="off"
        disabled={Loading?true:false}
        value={AuthInfo.confirmPassword}
     
      />
      <label
        htmlFor="floating_repeat_password"
        className="peer-focus:font-medium flex gap-4 absolute text-sm text-white dark:text-white duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
      >
        Confirm password
        <span className="text-red-500">{AuthErrors.confirmPassword!=='' && AuthErrors.confirmPassword} </span>
     
      </label>
    </div>

      <div className="relative">
    <button
      type="submit"
      onClick={(e)=>HandleAuth(e,'Login')}
      className={`${CurrentForm==='Login'?'':'hidden'} text-white  bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full  px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800`}
    >
      Login
    </button>
    
    <button
      type="submit"
      onClick={(e)=>HandleAuth(e,'Register')}
      className={`${CurrentForm==='Register'?'':'hidden'} text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full  px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800`}
    >
      Register
    </button>


    <div role="status" className={`${Loading?'':'hidden'} absolute right-5 top-1`}>
  <svg
    aria-hidden="true"
    className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
    viewBox="0 0 100 101"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
      fill="currentColor"
    />
    <path
      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
      fill="currentFill"
    />
  </svg>
</div>




  </div>
  </form>
  
<button className="text-white flex items-center gap-1" onClick={()=>{
  if(CurrentForm==='Login'){
    setAuthInfo({...AuthInfo,confirmPassword:'',password:''});
  setCurrentForm('Register')
  }else{
    setAuthInfo({...AuthInfo,confirmPassword:'',password:'',Name:''});
    setCurrentForm('Login')  
  }
  }}>Don't have an Account? <span className="text-blue-400 underline hover:text-blue-500 transition-all 300ms ease-in-out">{CurrentForm==='Login'?'Register Here':'Login Here'}</span></button>

  </div>


  )
}

export default Login