import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import UserService from '../services/userServices';
import { toast } from 'react-toastify';

// Define the Training interface
interface Training {
  drill_name: string;
  drill_category: string;
  training_name: string;
  photo?: File | null;
  week: string;
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
      toast.success('Training created successfully');

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


// // Async function to add a training
// export const addTrainings = async (payload: Training, dispatch: any) => {
//   try {
//     const res = await UserService.addTraining(payload);
//     console.log('redux response addTraining:', res);

//     if (res?.status === 200) {
//       // Notify the user of the success
//       toast.success('Training created successfully');

//       // Dispatch the action to add training to the state
//       dispatch(addTraining({
//         training: res?.data ? [res?.data] : []
//       }));
//     }

//     return res?.data || [];
//   } catch (err) {
//     console.log('Error in addTraining slice:', err);
    
//     // Notify the user of the error
//     toast.error('Error adding training');
    
//     // Throw the error to be handled by the calling function
//     throw err;
//   }
// };

// Create the slice with explicit initial state type
const trainingSlice = createSlice({
  name: 'training',
  initialState,
  reducers: {
    addTraining: (state, action: PayloadAction<{ training: Training[] }>) => {
      state.trainings = [...state.trainings, ...action.payload.training];
    }
  }
});

// Export the action and reducer
export const { addTraining } = trainingSlice.actions;
export default trainingSlice.reducer;
