import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import UserService from '../services/userServices';
import { toast } from 'react-toastify';

// Define the Training interface
interface Training {
  drill_name: string;
  drill_category: string;
  training_name: string;
  photo?: File | null;
  week: [Number];
}

// Define the state interface
interface TrainingState {
  trainings: Training[];
}

// Initial state with explicit type
const initialState: TrainingState = {
  trainings: []
};


// Change Training to FormData
export const addTrainings = async (formData: any, dispatch: any) => {
  try {
    // Sending FormData as payload
    const res = await UserService.addTraining(formData);
    console.log('redux response addTraining:', res);

    if (res?.status === 200) {
      // Notify the user of the success

      
     // toast.success('Training created successfully');

      // Dispatch the action to add training to the state
      dispatch(addTraining({
        training: res?.data ? [res?.data] : []
      }));
    }

    return res?.data || [];
  } catch (err) {
    console.log('Error in addTraining slice:', err);
    
    // Notify the user of the error
    toast.error('Error adding training');
    
    // Throw the error to be handled by the calling function
    throw err;
  }
};

export const updateTraining = async (payload: any, dispatch: any) => {
  try {
    const res = await UserService.updateTraining(payload);
    console.log('redux res update Training', res);
    // dispatch(authUser({
    //   token: res?.data?.token || '',
    //   userInfo: res?.data?.data ? [res?.data?.data] : []
    // }));
    toast.success('Training updated successfully!', { autoClose: 2000 });
    return res?.data;
  } catch (err) {
    console.log('Error on update Training slice', err);
    toast.error('Error updating Training.', { autoClose: 2000 });
    throw err;
  }
};
export const fetchTrainingById = async (payload: any, dispatch: any) => {
  try {
    const res = await UserService.updateUserProfile(payload);
    console.log('redux res update profile', res);
    // dispatch(authUser({
    //   token: res?.data?.token || '',
    //   userInfo: res?.data?.data ? [res?.data?.data] : []
    // }));
    toast.success('Profile updated successfully!', { autoClose: 2000 });
    return res?.data;
  } catch (err) {
    console.log('Error on update profile slice', err);
    toast.error('Error updating profile.', { autoClose: 2000 });
    throw err;
  }
};

// // Async function to add a training
export const addTrainingsDrills = async (payload: any, dispatch: any) => {
  try {
    const res = await UserService.addTrainingDrills(payload);
    console.log('redux response addTraining:', res);

    if (res?.status === 200) {
      // Notify the user of the success
    //  toast.success('Training created successfully');

      // Dispatch the action to add training to the state
      dispatch(addTraining({
        training: res?.data ? [res?.data] : []
      }));
    }

    return res?.data || [];
  } catch (err) {
    console.log('Error in addTraining slice:', err);
    
    // Notify the user of the error
    toast.error('Error adding training');
    
    // Throw the error to be handled by the calling function
    throw err;
  }
};

export const assignTrainingPlan = async (payload: any, dispatch: any) => {
  try {
    const res = await UserService.assignTrainingPlan(payload);
    console.log('redux response assignTrainingPlan:', res);

    if (res?.status === 200) {
      // Notify the user of the success
      toast.success('Training plan assigned successfully!');

      // Dispatch the action to update the state with the assigned training
      dispatch(setAssignedTrainingPlan({
        training: res?.data ? [res?.data] : []
      }));
    }

    return res?.data || [];
  } catch (err) {
    console.log('Error in assignTrainingPlan slice:', err);
    
    // Notify the user of the error
    toast.error('Error assigning training plan');
    
    // Throw the error to be handled by the calling function
    throw err;
  }
};

// Create the slice with explicit initial state type
const trainingSlice = createSlice({
  name: 'training',
  initialState,
  reducers: {
    addTraining: (state, action: PayloadAction<{ training: Training[] }>) => {
      state.trainings = [...state.trainings, ...action.payload.training];
    },
    setAssignedTrainingPlan: (state, action: PayloadAction<{ training: Training[] }>) => {
      state.trainings = [...state.trainings, ...action.payload.training];
    }
  }
});

// Export the action and reducer
export const { addTraining, setAssignedTrainingPlan } = trainingSlice.actions;
export default trainingSlice.reducer;
