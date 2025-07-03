import { createSlice } from '@reduxjs/toolkit'

const userSlice = createSlice({
  name: 'user',
  initialState: null,
  reducers: {
    loginUser: (state, action) => {
      return action.payload
    },
    logoutUser: (state) => {
      return null
    },
    setUser: (state, action) => {
      return action.payload
    }
  }
})

export const { loginUser, logoutUser, setUser } = userSlice.actions
export default userSlice.reducer