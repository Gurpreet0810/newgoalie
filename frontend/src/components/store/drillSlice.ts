import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import UserService from '../services/userServices';
import { toast } from 'react-toastify';

// Define DrillCategory type (adjust based on actual structure)
interface DrillCategory {
  category_name: string;
  category_status: string;
  user_id: string; // Adjust based on your user structure
}

// DrillState type
interface DrillState {
  drillInfo: DrillCategory[]; // Use defined DrillCategory type
}

interface DrillPayload {
  drillInfo: DrillCategory[];
}

// Async function for adding a drill category
export const addDrillCat = async (payload: any, dispatch: any) => {
  try {
    const res: any = await UserService.addDrillCat(payload);
    console.log('redux res addDrillCat here', res);

    if (res.status === 200) {
      toast.success('Drill category created successfully');
      dispatch(addDrill({
        drillInfo: res?.data ? [res?.data] : []
      }));
    }

    return res?.data || [];
  } catch (err) {
    console.log('Error on addDrillCat slice', err);
    toast.error('Error adding drill category');
    throw err;
  }
};

// Initial state for drill categories
const initialState: DrillState = {
  drillInfo: []
};

// Drill slice to manage state
const drillSlice = createSlice({
  name: 'drill',
  initialState,
  reducers: {
    addDrill: (state, action: PayloadAction<DrillPayload>) => {
      console.log('initialState drill', state);
      state.drillInfo = action.payload.drillInfo;
    },
  }
});

// Export actions and reducer from the slice
export const { addDrill } = drillSlice.actions;
export default drillSlice.reducer;
