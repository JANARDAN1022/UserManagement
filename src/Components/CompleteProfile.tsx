import { useState ,useCallback,useEffect} from "react";
import { useNavigate } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../Hooks";
import {storage,ID,appwriteDB,account} from '../appwrite';
import { SaveUser } from "../Redux/Actions/UserActions";


const CompleteProfile = () => {
    const Navigate = useNavigate();
    const Dispatch = useAppDispatch();
    const User = useAppSelector((state)=>state.UserState.User); 
    const [ProfilePic, setProfilePic] = useState<any | null>(User?User.ProfileImg:null);
    const [Loading,setLoading]=useState(false);
    const [Fetching,setFetching]=useState(false);
    const [formData, setFormData] = useState({
        firstName:User?User.firstName:'',
        lastName:User?User.lastName: "",
        phone: User?User.phone: "",
        gender: User?User.gender: "",
        LoggedIn:false,
      });

      const [FormErrors,setFormErrors]=useState({
        ProfileImg:'',
        Other:'',
      });
    
    const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
         setProfilePic(file);
      };

      const handleChange = (e:any) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
      };


      const FetchCurrentUser =
      useCallback(
      async()=>{
        try {
          setFetching(true);
          const User = await account.get();
          const FetchUser = await appwriteDB.getDocument('65bd1697148950b2b2a7','65bd16a3930e4a44270a',User.$id);
          Dispatch(SaveUser({
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
          setFormData({
            firstName:FetchUser.firstName,
            gender:FetchUser.gender,
            lastName:FetchUser.lastName,
            phone:FetchUser.phone,
            LoggedIn:true,
          });
          setProfilePic(FetchUser.ProfileImg)
          setFetching(false);
        } catch (error) {
          setFetching(false);
          Navigate('/Login');
        }
        
      },[]);
      
      useEffect(()=>{
        FetchCurrentUser();
      },[FetchCurrentUser]);



      const handleSubmit = async(e:any) => {
        e.preventDefault();
        if(User && (
          formData.firstName !== User.firstName ||
          formData.lastName !== User.lastName ||
          formData.phone !== User.phone ||
          formData.gender !== User.gender ||
          ProfilePic !== User.ProfileImg
        )){
            if(ProfilePic){
              try {
                setLoading(true);
               
                if(ProfilePic!==User.ProfileImg){
                 const Uploaded = await storage.createFile('65be0e0f9f944e5a9dad',ID.unique(),ProfilePic)
                 const ImgUrl = await storage.getFileView(Uploaded.bucketId,Uploaded.$id);
                 const UpdatedUserData = {
                  email:User.email,
                  firstName:formData.firstName,
                   lastName:formData.lastName,
                   gender:formData.gender,
                   password:'',
                   phone:formData.phone,
                   ProfileImg:ImgUrl.href
                 }
                
                   await appwriteDB.updateDocument('65bd1697148950b2b2a7','65bd16a3930e4a44270a',User.Id,UpdatedUserData);
                  await Dispatch(SaveUser({
                    Id:User.Id,
                    email:User.email,
                    firstName:formData.firstName,
                     lastName:formData.lastName,
                     LoggedIn:true,
                     gender:formData.gender,
                     password:'',
                     phone:formData.phone,
                     repeatPassword:'',
                     ProfileImg:ImgUrl.href
                  }))
                  setLoading(false);       
                  Navigate("/");
                  setFormData({
                    firstName:'',
                    lastName: "",
                    phone: "",
                    gender: "",
                    LoggedIn:true,
                  });
                }else{
                  const UpdatedUserData = {
                    email:User.email,
                    firstName:formData.firstName,
                     lastName:formData.lastName,
                     gender:formData.gender,
                     password:'',
                     phone:formData.phone,
                     ProfileImg:User.ProfileImg
                   }
                  
                    await appwriteDB.updateDocument('65bd1697148950b2b2a7','65bd16a3930e4a44270a',User.Id,UpdatedUserData);
                    await Dispatch(SaveUser({
                      Id:User.Id,
                      email:User.email,
                      firstName:formData.firstName,
                       lastName:formData.lastName,
                       LoggedIn:true,
                       gender:formData.gender,
                       password:'',
                       phone:formData.phone,
                       repeatPassword:'',
                       ProfileImg:User.ProfileImg
                    }))
                    setLoading(false);       
                    Navigate("/");
                    setFormData({
                      firstName:'',
                      lastName: "",
                      phone: "",
                      gender: "",
                      LoggedIn:true,
                    });
                } 
                  
              } catch (error:any) {
                console.log(error);
                setLoading(false);
              }  
    }else{
      setFormErrors({...FormErrors,ProfileImg:'Please Select a Profile Image*'})
      setTimeout(() => {
        setFormErrors({...FormErrors,Other:''});
      },3000)
    }
  }else{
    setFormErrors({...FormErrors,Other:'Please Change Atleast one Field*'})
    setTimeout(() => {
      setFormErrors({...FormErrors,Other:''});
    },3000)
  
  }
      };

    return (
     <div className="w-full gap-4 flex flex-col justify-center items-center h-screen bg-gradient-to-r from-gray-700 via-gray-900 to-black">
       <div className="flex gap-2  items-center relative">
        <h1 className="text-white font-bold text-lg">Your Profile Information</h1>
        <span className={`${FormErrors.Other!==''?'':'hidden'} absolute right-[-220px] text-red-500 text-center w-full text-sm `}>{FormErrors.Other}</span>
        <span className={`${FormErrors.ProfileImg!==''?'':'hidden'} absolute right-[-220px] text-red-500 text-center w-full text-sm `}>{FormErrors.ProfileImg}</span>
</div>
       {User && !Fetching?
        <form 
          onSubmit={handleSubmit}
        className="max-w-lg md:gap-4 flex flex-col  w-full mx-auto border border-white p-10 rounded-md shadow shadow-white">
       
        <div className="flex items-center gap-5  z-0 w-full  ">
            {ProfilePic?
            <div className="w-28 h-20 rounded-full" >
            <img    src={User && ProfilePic===User.ProfileImg?ProfilePic:URL.createObjectURL(ProfilePic)} alt="ProfileImg" className="w-full h-full object-cover rounded-full bg-black" /> 
            </div>
            :
            <div className="w-28 h-20 rounded-full bg-black" />
            }
          <input
            type="file"
            name="ProfileIMG"
            id="ProfileIMG"
            accept="image/*" // Only allow image files
            onChange={handlePhotoChange} // Call handleFileChange when a file is selected  
            className="py-2.5 px-0 w-full text-sm text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"

          />
        </div>

                <div className="grid md:grid-cols-2 md:gap-6">
          <div className="relative z-0 w-full mb-5 group">
            <input
              type="text"
              name="firstName"
              id="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="block py-2.5 px-0 w-full text-sm text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              required
            />
            <label
              htmlFor="firstName"
              className="peer-focus:font-medium absolute text-sm text-white dark:text-white duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              First name
            </label>
          </div>
          <div className="relative z-0 w-full mb-5 group">
            <input
              type="text"
              name="lastName"
              id="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="block py-2.5 px-0 w-full text-sm text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              required
            />
            <label
              htmlFor="lastName"
              className="peer-focus:font-medium absolute text-sm text-white dark:text-white duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Last name
            </label>
          </div>
        </div>
        <div className="grid md:grid-cols-2 md:gap-6">
          <div className="relative z-0 w-full mb-5 group">
            <input
              type="tel"
              pattern="[0-9]{10}"
              name="phone"
              id="phone"
              value={formData.phone}
              onChange={handleChange}
              className="block py-2.5 px-0 w-full text-sm text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              required
            />
            <label
              htmlFor="phone"
              className="peer-focus:font-medium absolute text-sm text-white dark:text-white duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Phone number (9876543210)
            </label>
          </div>
          <div className="relative z-0 w-full mb-5 group">
            <select
              name="gender"
              id="gender"
              value={formData.gender}
              onChange={handleChange}
              className="block py-2.5 px-0 w-full text-sm text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              required
            >
                <option className="bg-black text-white" value={''}>Your Gender</option>
                <option className="bg-black text-white" value={'Male'}>Male</option>
                <option className="bg-black text-white" value={'Female'}>Female</option>
            </select>
            <label
              htmlFor="gender"
              className="peer-focus:font-medium absolute text-sm text-white dark:text-white duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Gender
            </label>
          </div>
        </div>
                
        <div className="relative">
          
        <button
          type="submit"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full  px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Save Information
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

<span onClick={()=>Navigate('/')} className={`text-white cursor-pointer w-full ${User && User.gender!=='' && User.phone!==''?'':'hidden'}`}>Changed Your Mind <span className="text-blue-500 opacity-80 hover:opacity-100 transition-all ease-in-out underline">Go Back?</span></span>
      </form>
      
    :
    <div  className="max-w-lg md:gap-4 flex flex-col animate-pulse h-[370px]  w-full mx-auto border border-white p-10 rounded-md shadow shadow-white">

    </div>
    
}

      </div>




    
    )
  }
  
  export default CompleteProfile