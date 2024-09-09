import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import UserService from '../services/userServices';
import { toast } from 'react-toastify';

// Define DrillCategory type (adjust based on actual structure)
interface DrillCategory {
  category_name: string;
  category_status: string;
  user_id: string; // Adjust based on your user structure
}

// Define Drill type
interface Drill {
  drill_name: string;
  category: string;
  description: string;
  photo?: File | null;
  video_option?: string;
  video_file?: File | null;
  video_link?: string;
  user_id: string;
}

// DrillState type to hold both categories and drills
interface DrillState {
  drillInfo: Drill[]; // Use Drill type for drills
  drillCategories: DrillCategory[]; // Use DrillCategory type for categories
}

// DrillPayload for drills
interface DrillPayload {
  drillInfo: Drill[];
}

// DrillCategoryPayload for categories
interface DrillCategoryPayload {
  drillCategories: DrillCategory[];
}

// Async function for adding a drill category
export const addDrillCat = async (payload: any, dispatch: any) => {
  try {
    const res: any = await UserService.addDrillCat(payload);
    console.log('redux res addDrillCat here', res);

    if (res.status === 200) {
      toast.success('Drill category created successfully');
      dispatch(addDrillCategory({
        drillCategories: res?.data ? [res?.data] : []
      }));
    }

    return res?.data || [];
  } catch (err) {
    console.log('Error on addDrillCat slice', err);
    toast.error('Error adding drill category');
    throw err;
  }
};

// Async function for adding a drill
export const addDrill = async (payload: any, dispatch: any) => {
  try {
    const res: any = await UserService.addDrill(payload);
    console.log('redux res addDrill here', res);

    if (res.status === 200) {
      toast.success('Drill created successfully');
      dispatch(addDrillToState({
        drillInfo: res?.data ? [res?.data] : []
      }));
    }

    return res?.data || [];
  } catch (err) {
    console.log('Error on addDrill slice', err);
    toast.error('Error adding drill');
    throw err;
  }
};

// Initial state for drills and categories
const initialState: DrillState = {
  drillInfo: [],
  drillCategories: []
};

// Drill slice to manage state
const drillSlice = createSlice({
  name: 'drill',
  initialState,
  reducers: {
    // Reducer to handle adding a drill category
    addDrillCategory: (state, action: PayloadAction<DrillCategoryPayload>) => {
      console.log('initialState drillCategories', state.drillCategories);
      state.drillCategories = [...state.drillCategories, ...action.payload.drillCategories];
    },

    // Reducer to handle adding a drill
    addDrillToState: (state, action: PayloadAction<DrillPayload>) => {
      console.log('initialState drill', state.drillInfo);
      state.drillInfo = [...state.drillInfo, ...action.payload.drillInfo];
    }
  }
});

// Export actions and reducer from the slice
export const { addDrillCategory, addDrillToState } = drillSlice.actions;
export default drillSlice.reducer;
