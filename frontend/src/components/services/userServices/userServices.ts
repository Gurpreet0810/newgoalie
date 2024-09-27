import { getRequest, imagePostRequest, postRequest,putRequest } from "../index";
import axios from 'axios';
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
  add_coach = async (payload:any) => {
    return postRequest(`/api/v1/add_coach`,payload) 
  }
   add_goalie = async (payload: any) => {
    // const formData = new FormData();
  
    // // Append your payload to FormData
    // for (const key in payload) {
    //   if (payload.hasOwnProperty(key)) {
    //     formData.append(key, payload[key]);
    //   }
    // }
  return imagePostRequest ('/api/v1/add_goalie', payload)
  
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
  addDrillCat = async (payload: any) => {
    return postRequest('/api/v1/addDrillCat', payload)
  } 

  addDrill = async (payload: any) => {
    return imagePostRequest('/api/v1/addDrill', payload)
  } 
  addTraining = async (payload: any) => {
    return imagePostRequest('/api/v1/addTraining', payload)
  } 
  addTrainingDrills = async (payload: any) => {
    return postRequest('/api/v1/addTrainingdrills', payload)
  }
  addBlogCat = async (payload: any) => {
    return postRequest('/api/v1/addBlogCat', payload)
  } 
  addBlog = async (payload: any) => {
    return imagePostRequest('/api/v1/addBlog', payload)
  }  
  updateTraining = async (payload: any) => {
    return imagePostRequest('/api/v1/updateTraining', payload)
  } 
}

const instance = new LoginService;
export default instance
