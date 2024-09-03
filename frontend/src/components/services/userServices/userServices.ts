import { getRequest, postRequest,putRequest } from "../index";

class LoginService {
  signInUSer = async (payload:any) => {
    return postRequest(`/api/v1/login`,payload) 
  }
  signUpUser = async (payload:any) =>{
    return postRequest(`/api/v1/signIn`,payload)
  }
  logoutUser = async () => {
    return getRequest('/api/v1/logout')
  }
  add_goalie = async (payload:any) => {
    return postRequest(`/api/v1/add_goalie`,payload) 
  }
  forgotPassword = async (payload: any) => {
    return putRequest('/api/v1/forgotPassword', payload)
  } 
  resetPassword = async (payload: any) => {
    return postRequest('/api/v1/resetPassword', payload)
  } 
  updateUserProfile = async (payload: any) => {
    return postRequest('/api/v1/updateProfile', payload)
  } 

}

const instance = new LoginService;
export default instance
