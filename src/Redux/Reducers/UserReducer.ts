import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserState,UserType } from '../../Types/User';



const initialState: UserState = {
  User: null,
}

const SaveUser = (state:UserState, action:PayloadAction<UserType>) => {
    state.User = action.payload;
  }

  const LogoutUser = (state:UserState) => {
    state.User = null;
  }


const UserSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    saveUser: SaveUser,
    logoutUser:LogoutUser
  },
});

export const  {saveUser,logoutUser}  = UserSlice.actions;


export default UserSlice.reducer;
