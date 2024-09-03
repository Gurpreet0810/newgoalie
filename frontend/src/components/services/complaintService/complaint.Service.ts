import { getRequest, postRequest,putRequest, uploadPostRequest } from "../index";

class complaintServices {
  uploadComplaint = async (payload:any) => {
    return uploadPostRequest(`/api/v1/complaint-box`,payload) 
  }

  uploadComplaintReason = async (payload:any) => {
    return postRequest(`/api/v1/add-new-reason`,payload) 
  }
  getAllComplaintReason = async () => {
    return getRequest(`/api/v1/add-new-reason`) 
  }


}

const instance = new complaintServices;
export default instance
