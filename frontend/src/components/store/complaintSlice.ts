import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import UserService from '../services/userServices';
import { toast } from 'react-toastify';
import complaintServices from '../services/complaintService';

interface UserState {
    complaintInfo: any[];
  allComplaintReason: any[];
  // Adjust this type according to your user data structure
}

interface AuthPayload {
  token: string;
  // Add other user properties if needed
}


export const setComplaintBox = async (payload: any, dispatch: any) => {
    
    try {
        const res = await complaintServices.uploadComplaint(payload);
        dispatch(setComplaintInfo(res?.data || {}));
        return res?.data
    } catch (err) {
        console.log('Error on login slice', err);
        throw err
    }
}
export const addNewComplaintReason = async (payload: any, dispatch: any) => {
    
    try {
        const res = await complaintServices.uploadComplaintReason(payload);
        
        dispatch(setComplaintReason(res?.data?.data?.allReason || []));
        return res?.data
    } catch (err) {
        console.log('Error on login slice', err);
        throw err
    }
}
export const getAllComplaintReason = async (dispatch: any) => {
    
    try {
        const res = await complaintServices.getAllComplaintReason();
        
        dispatch(setComplaintReason(res?.data?.data?.allReason || []));
        return res?.data
    } catch (err) {
        console.log('Error on login slice', err);
        throw err
    }
}



const initialState: UserState = {
  complaintInfo: [],
  allComplaintReason: []
};

const complaintSlice = createSlice({
  name: 'complaint',
  initialState,
  reducers: {
    setComplaintInfo: (state, action: PayloadAction<AuthPayload>) => {
      state.complaintInfo = [action.payload];
    },
    setComplaintReason: (state, action: any) => {
      state.allComplaintReason = [action.payload];
    },
  }
});

export const { setComplaintInfo ,setComplaintReason} = complaintSlice.actions;
export default complaintSlice.reducer;
