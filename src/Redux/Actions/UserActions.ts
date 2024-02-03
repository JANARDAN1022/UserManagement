import {createAsyncThunk,Dispatch } from "@reduxjs/toolkit"; 
import {
   saveUser,
   logoutUser
} from '../Reducers/UserReducer';
import { UserType } from "../../Types/User";



export const SaveUser = createAsyncThunk('user/save',async(User:UserType,{ dispatch }: { dispatch: Dispatch })=>{
    try{
     dispatch(saveUser(User));
    }catch(error:any){
    console.log(error);
    }
});


export const LogoutUser = createAsyncThunk('user/logout',async(_,{ dispatch }: { dispatch: Dispatch })=>{
    try{
     dispatch(logoutUser());
    }catch(error:any){
    console.log(error);
    }
});



