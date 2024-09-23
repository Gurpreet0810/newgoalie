import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import UserService from '../services/userServices';
import { toast } from 'react-toastify';

interface BlogCategory {
  category_name: string;
  user_id: string; // Adjust based on your user structure
}

// Define BlogState type
interface BlogState {
  blogCategories: BlogCategory[]; // Use BlogCategory type for categories
}

// BlogCategoryPayload for categories
interface BlogCategoryPayload {
  blogCategories: BlogCategory[];
}

// Async function for adding a blog category
export const addBlogCat = async (payload: any, dispatch: any) => {
  try {
    const res: any = await UserService.addBlogCat(payload);
    console.log('redux res addBlogCategory here', res);

    if (res.status === 200) {
      toast.success('Blog category created successfully');
      dispatch(addBlogCategoryToState({
        blogCategories: res?.data ? [res?.data] : []
      }));
    }

    return res?.data || [];
  } catch (err) {
    console.log('Error on addBlogCategory slice', err);
    toast.error('Error adding blog category');
    throw err;
  }
};

// Async function for adding a blog
export const addBlog = async (payload: any, dispatch: any) => {
  try {
    const res: any = await UserService.addBlog(payload);
    console.log('redux res addBlog here', res);

    if (res.status === 200) {
      toast.success('Blog created successfully');
      // You can add a dispatch here if needed to update state
    }

    return res?.data || [];
  } catch (err) {
    console.log('Error on addBlog slice', err);
    toast.error('Error adding blog');
    throw err;
  }
};

// Initial state for blog categories
const initialState: BlogState = {
  blogCategories: []
};

// Blog slice to manage state
const blogSlice = createSlice({
  name: 'blog',
  initialState,
  reducers: {
    // Reducer to handle adding a blog category
    addBlogCategoryToState: (state, action: PayloadAction<BlogCategoryPayload>) => {
      console.log('initialState blogCategories', state.blogCategories);
      state.blogCategories = [...state.blogCategories, ...action.payload.blogCategories];
    }
  }
});

// Export actions and reducer from the slice
export const { addBlogCategoryToState } = blogSlice.actions;
export default blogSlice.reducer;
