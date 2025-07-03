import { createSlice } from '@reduxjs/toolkit'

const blogSlice = createSlice({
  name: 'blogs',
  initialState: [],
  reducers: {
    addBlog: (state, action) => {
        state.push(action.payload)
    },
    updateBlog: (state, action) => {
      const index = state.findIndex(blog => blog.id === action.payload.id)
      if (index !== -1) {
        state[index] = action.payload
      }
    },
    deleteBlog: (state, action) => {
      return state.filter(blog => blog.id !== action.payload)
    },
    clearBlogs: (state) => {
      return []
    },
    initializeBlogs: (state, action) => {
        return action.payload
    }
  },
})

export const { addBlog, updateBlog, deleteBlog, clearBlogs, initializeBlogs} = blogSlice.actions
export default blogSlice.reducer
