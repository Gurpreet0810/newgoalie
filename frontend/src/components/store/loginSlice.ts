import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import UserService from '../services/userServices';
import { toast } from 'react-toastify';

interface UserState {
  userInfo: any[]; // Adjust this type according to your user data structure
  token: string;
}

interface AuthPayload {
  token: string;
  userInfo: any[]; // Add userInfo to the AuthPayload
}

// Async login function
export const userLogin = async (payload: any, dispatch: any) => {
  try {
    const res: any = await UserService.signInUSer(payload);
    console.log('redux res login here', res);

    dispatch(authUser({
      token: res?.data?.data?.token || '',
      userInfo: res?.data?.data ? [res?.data?.data] : []
    }));

    if (res?.data?.token) {
      await localStorage.setItem('token', res?.data?.token);
      return res?.data;
    } else {
      console.log('User not able to login');
    }
  } catch (err) {
    console.log('Error on login slice', err);
    throw err;
  }
};

export const userLogout = async (dispatch: any) => {
  try {
    const res: any = await UserService.logoutUser();
    console.log('redux res logout', res);
    return res?.data;
  } catch (err) {
    console.log('Error on login slice', err);
    throw err;
  }
};

export const getForgotPassword = async (payload: any, dispatch: any) => {
  try {
    const res = await UserService.forgotPassword(payload);
    dispatch(authUser({
      token: '',
      userInfo: res?.data ? [res?.data] : []
    }));
    return res?.data;
  } catch (err) {
    console.log('Error on login slice', err);
    throw err;
  }
};

export const resetPassword = async (payload: any, dispatch: any) => {
  try {
    const res = await UserService.resetPassword(payload);
    dispatch(authUser({
      token: '',
      userInfo: res?.data ? [res?.data] : []
    }));
    return res?.data;
  } catch (err) {
    console.log('Error on login slice', err);
    throw err;
  }
};

export const LogoutFunction = async (dispatch: any) => {
  try {
    const res = await UserService.logoutUser();
    dispatch(authUser({
      token: '',
      userInfo: []
    }));
    return res?.data;
  } catch (err) {
    console.log('Error on login slice', err);
    throw err;
  }
};

export const updateUserProfile = async (payload: any, dispatch: any) => {
  try {
    const res = await UserService.updateUserProfile(payload);
    console.log('redux res update profile', res);
    dispatch(authUser({
      token: res?.data?.token || '',
      userInfo: res?.data?.data ? [res?.data?.data] : []
    }));
    toast.success('Profile updated successfully!', { autoClose: 2000 });
    return res?.data;
  } catch (err) {
    console.log('Error on update profile slice', err);
    toast.error('Error updating profile.', { autoClose: 2000 });
    throw err;
  }
};

export const signupFunction = async (payload: any, dispatch: any) => {
  try {
    const res = await UserService.signUpUser(payload);
    await localStorage.setItem("token", res?.data?.data?.token);
    dispatch(authUser({
      token: res?.data?.data?.token || '',
      userInfo: res?.data?.data ? [res?.data?.data] : []
    }));
    return res?.data || [];
  } catch (err) {
    console.log('Error on login slice', err);
    throw err;
  }
};

const initialState: UserState = {
  userInfo: [],
  token: ''
};

const loginSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {
    authUser: (state, action: PayloadAction<AuthPayload>) => {
      console.log('initialState', state);
      
      state.userInfo = action.payload.userInfo;
      state.token = action.payload.token;
    },
    signoutUser: (state) => {
      state.userInfo = [];
      state.token = '';
    }
  }
});

export const { authUser, signoutUser } = loginSlice.actions;
export default loginSlice.reducer;
