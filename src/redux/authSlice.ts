import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthSlice {
  token: string;
  user: UserData;
}

interface UserData {
  id: string;
  name: string;
  email: string;
  image :string
  // role_id: 1,
}

const initialState : AuthSlice = {
    token : "",
    user : {
        id : "", 
        name : "",
        email : "",
        image : ""
    }
}

const authSlice = createSlice({
    name : "auth",
    initialState,
    reducers : {
        loginSuccess : (state , action : PayloadAction<AuthSlice>) => {
            state.token = action.payload.token;
            state.user = action.payload.user
        },
        logout: (state) => {
            state.token = "";
            state.user = { id: "", name: "", email: ""  , image : ""};
          },
        updateUser: (state, action: PayloadAction<Partial<UserData>>) => {
            state.user = { ...state.user, ...action.payload };
          },
    }
})

export const {loginSuccess , logout , updateUser } = authSlice.actions;
export default authSlice.reducer